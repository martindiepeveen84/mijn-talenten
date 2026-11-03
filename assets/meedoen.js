/* Meedoen vanaf je telefoon: anoniem antwoorden op de vragen van de gespreksleider. Niets wordt bewaard. */
import {startDeelnemer, geldigeCode} from "./live.js";

function el(id){return document.getElementById(id);}
function maak(tag,klasse,tekst){var e=document.createElement(tag); if(klasse)e.className=klasse; if(tekst!==undefined)e.textContent=tekst; return e;}
var kaarten=["codeKaart","statusKaart","vraagKaart"];
function toon(naam){kaarten.forEach(function(k){el(k).classList.toggle("hide",k!==naam);});}
function status(kop,tekst,hulp){
  el("statusKop").textContent=kop; el("statusTekst").textContent=tekst;
  el("statusHulp").classList.toggle("hide",!hulp);
  toon("statusKaart");
}

var sessie=null, huidig=null, verstuurd={}, hulpTimer=null;

function verstuur(data){
  if(!sessie||!sessie.antwoord(data)){el("vraagMsg").textContent="De verbinding met het scherm is er niet. Probeer het zo opnieuw."; return false;}
  return true;
}

function toonVraag(v){
  huidig=v; var q=el("vraagTekst"), inv=el("vraagInvoer"); inv.textContent="";
  el("vraagMsg").textContent="";
  el("vraagLabel").textContent=v.open?"Vraag":"Gesloten";
  q.textContent=v.vraag||"";
  el("vraagHint").textContent=v.hint||"";
  var st=verstuurd[v.id]||(verstuurd[v.id]={n:0,w:null});
  if(!v.open){el("vraagMsg").textContent="Deze vraag is gesloten. Wacht op de volgende."; toon("vraagKaart"); return;}

  if(v.soort==="schaal"||v.soort==="keuze"){
    var opties=v.soort==="schaal"?[1,2,3,4,5].map(String):v.opties;
    var lijst=maak("div","md-opties"+(v.soort==="schaal"?" md-schaal":""));
    opties.forEach(function(t,i){
      var w=v.soort==="schaal"?i+1:i;
      var b=maak("button","md-optie"+(st.w===w?" gekozen":""),t); b.type="button";
      b.addEventListener("click",function(){
        if(!huidig||!huidig.open)return;
        if(verstuur({id:v.id,w:w})){st.w=w; lijst.querySelectorAll(".md-optie").forEach(function(x){x.classList.remove("gekozen");}); b.classList.add("gekozen"); el("vraagMsg").textContent="Verstuurd. Je kunt je antwoord nog aanpassen.";}
      });
      lijst.appendChild(b);
    });
    inv.appendChild(lijst);
    if(v.soort==="schaal"&&v.labels){var l=maak("div","md-labels"); l.appendChild(maak("span",null,"1 = "+v.labels[0])); l.appendChild(maak("span",null,"5 = "+v.labels[1])); inv.appendChild(l);}
  }else{
    var max=v.max||2;
    var ta=document.createElement("textarea"); ta.rows=4; ta.maxLength=140; ta.className="md-tekst";
    ta.setAttribute("aria-label","Je antwoord"); ta.placeholder="Typ je antwoord (maximaal 140 tekens)";
    var rij=maak("div","btn-row");
    var ok=maak("button","btn","Verstuur"); ok.type="button";
    var pas=maak("button","btn btn-white","Ik pas"); pas.type="button";
    function ververs(){
      var vol=st.n>=max; ta.disabled=vol; ok.disabled=vol; pas.disabled=vol;
      el("vraagMsg").textContent=st.n?("Verstuurd: "+st.n+" van "+max+"."+(vol?" Je kunt niet meer sturen.":" Je kunt nog iets sturen.")):"";
    }
    ok.addEventListener("click",function(){
      var t=ta.value.trim(); if(!t){el("vraagMsg").textContent="Typ eerst iets, of kies Ik pas."; return;}
      if(verstuur({id:v.id,w:t})){st.n++; ta.value=""; ververs();}
    });
    pas.addEventListener("click",function(){if(verstuur({id:v.id,pas:true})){st.n=max; ververs(); el("vraagMsg").textContent="Je past. Dat is ook een bijdrage.";}});
    rij.appendChild(ok); rij.appendChild(pas);
    inv.appendChild(ta); inv.appendChild(rij); ververs();
  }
  toon("vraagKaart");
}

function start(code){
  status("Verbinden…","We zoeken het scherm van de gespreksleider.",false);
  clearTimeout(hulpTimer); hulpTimer=setTimeout(function(){if(sessie&&!sessie.heeftHost()){el("statusHulp").classList.remove("hide");}},9000);
  try{
    sessie=startDeelnemer(code,{
      host:function(){status("Verbonden","Wacht tot de gespreksleider een vraag opent.",false);},
      vraag:function(v){
        if(v.geen||(!v.open&&!v.vraag)){huidig=null; status("Verbonden","Wacht tot de gespreksleider een vraag opent.",false); return;}
        toonVraag(v);
      },
      ok:function(d){if(d&&d.ok&&huidig&&huidig.id===d.id&&huidig.soort!=="tekst"){el("vraagMsg").textContent="Ontvangen. Je kunt je antwoord nog aanpassen.";}},
      hostWeg:function(){huidig=null; status("Verbinding weg","De verbinding met de gespreksleider is weg. Wacht even, of laad deze pagina opnieuw.",true);},
      peers:function(){}
    });
  }catch(e){status("Er ging iets mis","Meedoen lukt niet in deze browser. Probeer een andere browser of mobiel internet.",false);}
}

var code=(window.location.hash||"").slice(1).toUpperCase();
if(geldigeCode(code)){start(code);}
else{
  toon("codeKaart");
  el("codeKnop").addEventListener("click",function(){
    var c=el("codeIn").value.trim().toUpperCase();
    if(!geldigeCode(c)){el("codeMsg").textContent="Dat is geen geldige code. Een code heeft 8 tekens."; return;}
    window.history.replaceState(null,"","#"+c); start(c);
  });
  el("codeIn").addEventListener("keydown",function(e){if(e.key==="Enter")el("codeKnop").click();});
}
