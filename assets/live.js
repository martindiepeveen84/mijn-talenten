/* Live meedoen: rechtstreekse verbinding tussen het scherm van de gespreksleider en de telefoons.
   Gebruikt Trystero (open bron, MIT). Alleen het opzetten van de verbinding loopt via openbare diensten;
   de antwoorden zelf gaan rechtstreeks van telefoon naar scherm en worden nergens bewaard. */
import {joinRoom, selfId, maakQR} from "./vendor/live-lib.js?v=202611032346";

var APP_ID="mijn-talenten-live-v1";
var ALFABET="ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // zonder tekens die op elkaar lijken

export {maakQR, selfId};

export function maakCode(){
  var b=new Uint8Array(8); crypto.getRandomValues(b);
  return Array.from(b,function(x){return ALFABET[x%ALFABET.length];}).join("");
}
export function geldigeCode(c){return /^[A-HJKMNP-Z2-9]{8}$/.test(c||"");}
// Openbare Nostr-servers die alleen helpen bij het opzetten van de verbinding. De eerste vier zijn
// de standaardkeuze van de bibliotheek voor deze app (zonder de server die niet meer bereikbaar is),
// de rest is extra. Zo vinden oudere en nieuwere versies van de pagina elkaar nog.
var RELAYS=["wss://nostrcity-club.fly.dev","wss://nos.lol","wss://nostr.stakey.net","wss://relay.aarpia.com",
  "wss://nostr.chaima.info","wss://bendernostur.duckdns.org:8443","wss://cdn.satellite.earth","wss://nostr.rblb.it"];
function kamer(code){return joinRoom({appId:APP_ID,password:code,relayConfig:{urls:RELAYS}},code);}
function stuur(actie,data,doel){
  try{var p=actie.send(data,doel?{target:doel}:undefined); if(p&&p.catch)p.catch(function(){});}catch(e){}
}

/* Gespreksleider: stuurt vragen, ontvangt antwoorden */
export function startHost(code,cb){
  var room=kamer(code);
  var vraag=room.makeAction("vraag"), antw=room.makeAction("antw"), ok=room.makeAction("ok");
  var peers=new Set(), huidig=null;
  function tel(){if(cb.peers)cb.peers(peers.size);}
  room.onPeerJoin=function(id){peers.add(id); tel(); if(huidig)stuur(vraag,huidig,id);};
  room.onPeerLeave=function(id){peers.delete(id); tel();};
  antw.onMessage=function(d,ctx){if(d&&typeof d==="object"&&cb.antwoord)cb.antwoord(ctx.peerId,d);};
  return {
    stuurVraag:function(v){huidig=v; stuur(vraag,v);},
    bevestig:function(id,data){stuur(ok,data,id);},
    aantal:function(){return peers.size;},
    stop:function(){try{return room.leave();}catch(e){}}
  };
}

/* Deelnemer (telefoon): ontvangt vragen, stuurt antwoorden naar de gespreksleider */
export function startDeelnemer(code,cb){
  var room=kamer(code);
  var vraag=room.makeAction("vraag"), antw=room.makeAction("antw"), ok=room.makeAction("ok");
  var peers=new Set(), hostId=null;
  function tel(){if(cb.peers)cb.peers(peers.size);}
  room.onPeerJoin=function(id){peers.add(id); tel();};
  room.onPeerLeave=function(id){peers.delete(id); tel(); if(id===hostId){hostId=null; if(cb.hostWeg)cb.hostWeg();}};
  vraag.onMessage=function(d,ctx){
    if(!d||typeof d!=="object")return;
    if(!hostId){hostId=ctx.peerId; if(cb.host)cb.host();}
    if(ctx.peerId!==hostId)return; // alleen de eerste afzender geldt als gespreksleider
    if(cb.vraag)cb.vraag(d);
  };
  ok.onMessage=function(d,ctx){if(ctx.peerId===hostId&&cb.ok)cb.ok(d);};
  return {
    antwoord:function(data){if(!hostId)return false; stuur(antw,data,hostId); return true;},
    heeftHost:function(){return !!hostId;},
    stop:function(){try{return room.leave();}catch(e){}}
  };
}
