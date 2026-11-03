/* Kernkwadranten: kies kwaliteiten, vul de vier vakken in, toon en exporteer. Niets wordt opgeslagen. */
(function(){
"use strict";
var K=window.KWADRANT, mk=window.UI.maakEl, el=function(id){return document.getElementById(id);};
var MAXITEMS=3, MAXLEN=60;
var state={groepen:[], gekozen:[], data:{}, ed:0, weg:{}};

/* ---------- Schermen ---------- */
function toon(s){
  ["s0","stappen","s4"].forEach(function(id){el(id).classList.add("hide");});
  ["s1","s2","s3"].forEach(function(id){el(id).classList.add("hide");});
  if(s==="s0"){el("s0").classList.remove("hide");}
  else if(s==="s4"){el("s4").classList.remove("hide");}
  else{
    el("stappen").classList.remove("hide"); el(s).classList.remove("hide");
    var n=s==="s1"?1:(s==="s2"?2:3);
    el("stapTekst").textContent="Stap "+n+" van 3";
    el("stapHulp").textContent=n===1?"Kies je groepen":(n===2?"Kies je kwaliteiten":"Vul je kwadranten in");
    el("progress").setAttribute("aria-valuenow",n-1);
    el("bar").style.width=((n-1)/3*100)+"%";
  }
  window.scrollTo(0,0);
}
function nieuweData(id){if(!state.data[id])state.data[id]={valkuil:[],uitdaging:[],allergie:[]};}

/* ---------- Stap 1: groepen ---------- */
function renderGroepen(){
  var w=el("groepen"); w.textContent="";
  K.GROEPEN.forEach(function(g,i){
    var b=mk("button","pick"); b.type="button";
    var aan=state.groepen.indexOf(i)>-1; b.setAttribute("aria-pressed",aan?"true":"false");
    b.appendChild(mk("strong",null,g.naam)); b.appendChild(mk("span",null,g.tekst));
    b.appendChild(mk("em",null,g.k.map(function(k){return k[0];}).join(" · ")));
    b.addEventListener("click",function(){
      var p=state.groepen.indexOf(i);
      if(p>-1){state.groepen.splice(p,1);}
      else if(state.groepen.length<3){state.groepen.push(i);}
      else{el("msg1").textContent="Je kunt maximaal 3 groepen kiezen. Klik een groep weg om een andere te kiezen.";return;}
      el("msg1").textContent=""; renderGroepen();
    });
    w.appendChild(b);
  });
}

/* ---------- Stap 2: kwaliteiten ---------- */
function renderKwaliteiten(){
  var w=el("kwaliteiten"); w.textContent="";
  // alleen gekozen groepen, in de volgorde van de groepen
  var ids=K.LIJST.filter(function(q){return state.groepen.indexOf(q.groep)>-1;});
  // een eerder gekozen kwaliteit blijft zichtbaar
  state.gekozen=state.gekozen.filter(function(id){return ids.some(function(q){return q.id===id;});});
  ids.forEach(function(q){
    var b=mk("button","pick"); b.type="button";
    b.setAttribute("aria-pressed",state.gekozen.indexOf(q.id)>-1?"true":"false");
    b.appendChild(mk("strong",null,q.naam)); b.appendChild(mk("span",null,q.uitleg));
    b.appendChild(mk("em",null,K.GROEPEN[q.groep].naam));
    b.addEventListener("click",function(){
      var p=state.gekozen.indexOf(q.id);
      if(p>-1){state.gekozen.splice(p,1);}
      else if(state.gekozen.length<3){state.gekozen.push(q.id);}
      else{el("msg2").textContent="Je hebt al 3 kwaliteiten. Klik er een weg om een andere te kiezen.";return;}
      el("msg2").textContent=""; renderKwaliteiten();
    });
    w.appendChild(b);
  });
  el("telGekozen").textContent="Gekozen: "+state.gekozen.length+" van 3";
}

/* ---------- Stap 3: vakken invullen ---------- */
function vakBlok(q,vak){
  var info=K.VAKKEN[vak], lijst=state.data[q.id][vak];
  var blok=mk("div","card vak");
  blok.appendChild(mk("h2",null,info.titel));
  blok.appendChild(mk("p",null,"")).appendChild(mk("strong",null,info.vraag));
  blok.appendChild(mk("p","small",info.hulp));

  var gekozen=mk("div","chips");
  lijst.forEach(function(t,i){
    var c=mk("span","chip"); c.appendChild(document.createTextNode(t+" "));
    var x=mk("button","chip-x","×"); x.type="button"; x.setAttribute("aria-label","Verwijder: "+t);
    x.addEventListener("click",function(){lijst.splice(i,1); ververs(q,vak);});
    c.appendChild(x); gekozen.appendChild(c);
  });
  if(!lijst.length){gekozen.appendChild(mk("span","small","Nog niets gekozen."));}
  blok.appendChild(gekozen);

  var rij=mk("div","add-row"); var inp=document.createElement("input");
  inp.type="text"; inp.maxLength=MAXLEN; inp.autocomplete="off"; inp.id="in-"+vak;
  inp.setAttribute("aria-label","Schrijf je eigen woorden bij "+info.titel.toLowerCase());
  inp.placeholder="Schrijf het in je eigen woorden";
  var ok=mk("button","btn btn-white btn-small","Toevoegen"); ok.type="button";
  function voegToe(){
    var t=inp.value.trim().slice(0,MAXLEN); if(!t)return;
    if(lijst.length>=MAXITEMS){el("msg3").textContent="Je kunt maximaal "+MAXITEMS+" dingen per vak kiezen. Verwijder er eerst één.";return;}
    if(lijst.indexOf(t)===-1)lijst.push(t);
    el("msg3").textContent=""; ververs(q,vak,true);
  }
  ok.addEventListener("click",voegToe);
  inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();voegToe();}});
  rij.appendChild(inp); rij.appendChild(ok); blok.appendChild(rij);

  // suggesties: pas zichtbaar als je erom vraagt, zodat ze je niet sturen
  var det=document.createElement("details"); det.className="sug-box"; if(state.open&&state.open[vak])det.open=true;
  det.addEventListener("toggle",function(){state.open=state.open||{}; state.open[vak]=det.open;});
  det.appendChild(mk("summary",null,"Hulp nodig? Bekijk suggesties"));
  det.appendChild(mk("p","small","Dit zijn alleen ideeën. Kies alleen wat echt bij jou past. Klik op × om een suggestie weg te halen."));
  var sw=mk("div","chips");
  var wegSet=(state.weg[q.id+vak]=state.weg[q.id+vak]||[]);
  q[vak].forEach(function(t){
    if(lijst.indexOf(t)>-1||wegSet.indexOf(t)>-1)return;
    var c=mk("span","sug");
    var kies=mk("button","sug-kies","+ "+t); kies.type="button";
    kies.addEventListener("click",function(){
      if(lijst.length>=MAXITEMS){el("msg3").textContent="Je kunt maximaal "+MAXITEMS+" dingen per vak kiezen. Verwijder er eerst één.";return;}
      lijst.push(t); el("msg3").textContent=""; ververs(q,vak);
    });
    var x=mk("button","chip-x","×"); x.type="button"; x.setAttribute("aria-label","Haal suggestie weg: "+t);
    x.addEventListener("click",function(){wegSet.push(t); ververs(q,vak);});
    c.appendChild(kies); c.appendChild(x); sw.appendChild(c);
  });
  if(!sw.firstChild){sw.appendChild(mk("span","small","Geen suggesties meer. Schrijf je eigen woorden."));}
  det.appendChild(sw); blok.appendChild(det);
  blok.setAttribute("data-vak",vak);
  return blok;
}
function ververs(q,vak,focus){
  var oud=el("vakken").querySelector('[data-vak="'+vak+'"]'), nieuw=vakBlok(q,vak);
  oud.parentNode.replaceChild(nieuw,oud);
  if(focus){var i=nieuw.querySelector("input"); if(i)i.focus();}
}
function renderEditor(){
  var q=K.LIJST[state.gekozen[state.ed]]; nieuweData(q.id);
  el("edKop").textContent="Kwaliteit "+(state.ed+1)+" van 3: "+q.naam;
  el("edUitleg").textContent=q.uitleg+" Vul de drie vakken hieronder in.";
  var w=el("vakken"); w.textContent="";
  ["valkuil","uitdaging","allergie"].forEach(function(v){w.appendChild(vakBlok(q,v));});
  el("msg3").textContent="";
  el("verder3").textContent=state.ed===2?"Maak mijn kwadranten":"Volgende kwaliteit";
  toon("s3");
}
function controleerEditor(){
  var q=K.LIJST[state.gekozen[state.ed]], d=state.data[q.id], ontbreekt=[];
  ["valkuil","uitdaging","allergie"].forEach(function(v){if(!d[v].length)ontbreekt.push(K.VAKKEN[v].titel.toLowerCase());});
  if(ontbreekt.length){el("msg3").textContent="Kies of schrijf nog minstens één ding bij: "+ontbreekt.join(", ")+".";return false;}
  return true;
}

/* ---------- Link ---------- */
function b64(s){var b=new TextEncoder().encode(s), bin="";for(var i=0;i<b.length;i++)bin+=String.fromCharCode(b[i]);return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function unb64(t){t=t.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4)t+="=";var bin=atob(t),b=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);return new TextDecoder().decode(b);}
function codeer(){
  return b64(JSON.stringify({q:state.gekozen.map(function(id){var d=state.data[id];return [id,d.valkuil,d.uitdaging,d.allergie];})}));
}
function schoon(a){return Array.isArray(a)?a.filter(function(t){return typeof t==="string"&&t.trim();}).slice(0,MAXITEMS).map(function(t){return t.trim().slice(0,MAXLEN);}):[];}
function leesHash(){
  var m=/^#k=([A-Za-z0-9_-]+)$/.exec(window.location.hash); if(!m)return null;
  try{
    var o=JSON.parse(unb64(m[1])); if(!o||!Array.isArray(o.q)||o.q.length<1||o.q.length>3)return null;
    var gekozen=[], data={};
    for(var i=0;i<o.q.length;i++){
      var r=o.q[i]; if(!Array.isArray(r)||!Number.isInteger(r[0])||r[0]<0||r[0]>=K.LIJST.length)return null;
      gekozen.push(r[0]); data[r[0]]={valkuil:schoon(r[1]),uitdaging:schoon(r[2]),allergie:schoon(r[3])};
    }
    return {gekozen:gekozen,data:data};
  }catch(e){return null;}
}
function maakLink(){
  if(window.location.protocol!=="http:"&&window.location.protocol!=="https:")return "";
  return window.location.origin+window.location.pathname+"#k="+codeer();
}

/* ---------- Resultaat ---------- */
function vak(titel,cap,items,klasse){
  var b=mk("div","kw-box "+klasse); b.appendChild(mk("b",null,titel)); b.appendChild(mk("small",null,cap));
  var ul=mk("ul"); (items.length?items:["–"]).forEach(function(t){ul.appendChild(mk("li",null,t));}); b.appendChild(ul); return b;
}
function renderResultaat(){
  var w=el("resultaat"); w.textContent="";
  state.gekozen.forEach(function(id,i){
    var q=K.LIJST[id], d=state.data[id], kaart=mk("article","card trait");
    kaart.appendChild(mk("h2",null,"Kwaliteit "+(i+1)+": "+q.naam));
    var grid=mk("div","kw-grid");
    grid.appendChild(vak("Kernkwaliteit","Wat je goed kunt",[q.naam+" – "+q.uitleg],"kw-kern"));
    grid.appendChild(vak("Valkuil","Als je er te veel van hebt",d.valkuil,"kw-valkuil"));
    grid.appendChild(vak("Uitdaging","Wat je kunt leren",d.uitdaging,"kw-uitdaging"));
    grid.appendChild(vak("Allergie","Gedrag van anderen dat je irriteert",d.allergie,"kw-allergie"));
    kaart.appendChild(grid); w.appendChild(kaart);
  });
  var ul=el("gespreksvragen"); ul.textContent="";
  K.GESPREKSVRAGEN.forEach(function(t){ul.appendChild(mk("li",null,t));});
  toon("s4");
}
function klaar(){
  window.history.replaceState(null,"",window.location.pathname+"#k="+codeer());
  renderResultaat();
}

/* ---------- Exporteren ---------- */
function naam(){return el("naam").value.trim();}
function melding(t){el("melding").textContent=t;}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function kwadrantenData(){
  return state.gekozen.map(function(id){var q=K.LIJST[id],d=state.data[id];return {naam:q.naam,uitleg:q.uitleg,valkuil:d.valkuil,uitdaging:d.uitdaging,allergie:d.allergie};});
}
function download(blob,bestand){
  var u=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=u; a.download=bestand; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){URL.revokeObjectURL(u);},2000);
}
function pdf(){
  var b=window.PDFExport.maakKwadranten({kwadranten:kwadrantenData(),vragen:K.GESPREKSVRAGEN,naam:naam(),datum:new Date().toLocaleDateString("nl-NL"),link:maakLink()});
  download(b,"mijn-kernkwadranten.pdf"); melding("PDF gedownload. Kijk in je map Downloads.");
}
function word(){
  var n=naam();
  var h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Mijn kernkwadranten</title>'
   +'<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#0d2b3a}h1{font-size:20pt}h2{font-size:14pt}p{margin:3pt 0}table.kw{border-collapse:collapse;width:100%}table.kw td{border:1px solid #0d2b3a;padding:6pt;vertical-align:top;width:50%}</style></head><body>';
  h+='<h1>Mijn kernkwadranten</h1><p>'+(n?esc(n)+" – ":"")+esc(new Date().toLocaleDateString("nl-NL"))+'</p>';
  h+='<p>Een kernkwadrant laat zien hoe je kwaliteit en je valkuil bij elkaar horen. Wat je irriteert bij anderen, laat vaak zien wat jij nog kunt leren. Je allergie gaat over gedrag, niet over een persoon.</p>';
  function cel(kleur,titel,cap,items){return '<td bgcolor="'+kleur+'"><p><b>'+esc(titel)+'</b></p><p style="font-size:9pt;color:#4d6573">'+esc(cap)+'</p><ul>'+(items.length?items:["–"]).map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul></td>';}
  kwadrantenData().forEach(function(k,i){
    h+='<h2>Kwaliteit '+(i+1)+': '+esc(k.naam)+'</h2><table class="kw"><tr>'
      +cel("#66d1ff","Kernkwaliteit","Wat je goed kunt",[k.naam+" – "+k.uitleg])
      +cel("#fffbc2","Valkuil","Als je er te veel van hebt",k.valkuil)+'</tr><tr>'
      +cel("#e6f7ff","Uitdaging","Wat je kunt leren",k.uitdaging)
      +cel("#ffffff","Allergie","Gedrag van anderen dat je irriteert",k.allergie)+'</tr></table>';
  });
  h+='<h2>Vragen om mee verder te gaan</h2><ul>'+K.GESPREKSVRAGEN.map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul>';
  h+='<p style="font-size:9pt;color:#4d6573">Gebaseerd op het kernkwadrant van Daniel Ofman. Een hulpmiddel om na te denken over jezelf, geen test of meting. Gebruik het niet om anderen te beoordelen.</p>';
  var l=maakLink(); if(l){h+='<p style="font-size:9pt;color:#4d6573">Opnieuw bekijken: <a href="'+esc(l)+'">'+esc(l)+'</a></p>';}
  h+='</body></html>';
  download(new Blob(["﻿",h],{type:"application/msword"}),"mijn-kernkwadranten.doc");
  melding("Word-bestand gedownload. Kijk in je map Downloads.");
}
function print(){
  var n=naam(), oud=document.title;
  el("printNaam").textContent=n?"– "+n:"";
  document.title="Mijn kernkwadranten"+(n?" - "+n:"");
  window.print(); document.title=oud;
}
function samenvatting(){
  var n=naam(), r=["Mijn kernkwadranten"+(n?" ("+n+")":""),""];
  kwadrantenData().forEach(function(k,i){
    r.push((i+1)+". "+k.naam);
    r.push("   Valkuil: "+(k.valkuil.join(", ")||"–"));
    r.push("   Uitdaging: "+(k.uitdaging.join(", ")||"–"));
    r.push("   Allergie: "+(k.allergie.join(", ")||"–"));
    r.push("");
  });
  var l=maakLink(); if(l){r.push("Bekijk mijn kwadranten:",l);}
  return r.join("\n");
}
function mail(){
  window.location.href="mailto:?subject="+encodeURIComponent("Mijn kernkwadranten")+"&body="+encodeURIComponent(samenvatting());
  melding("Je mailprogramma opent. Opent er niets? Download dan de PDF en mail die zelf naar jezelf.");
}
function kopieer(){
  var l=maakLink();
  if(!l){melding("De link werkt pas als de app op een webadres staat.");return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(l).then(function(){melding("Link gekopieerd.");},function(){melding("Kopiëren lukt niet. Kopieer de link uit de adresbalk.");});
  }else{melding("Kopiëren lukt niet in deze browser. Kopieer de link uit de adresbalk.");}
}

/* ---------- Knoppen ---------- */
el("startKnop").addEventListener("click",function(){renderGroepen();toon("s1");});
el("terug1").addEventListener("click",function(){toon("s0");});
el("verder1").addEventListener("click",function(){
  if(!state.groepen.length){el("msg1").textContent="Kies minstens 1 groep.";return;}
  renderKwaliteiten(); toon("s2");
});
el("terug2").addEventListener("click",function(){renderGroepen();toon("s1");});
el("verder2").addEventListener("click",function(){
  if(state.gekozen.length!==3){el("msg2").textContent="Kies precies 3 kwaliteiten. Je hebt er "+state.gekozen.length+".";return;}
  state.ed=0; renderEditor();
});
el("terug3").addEventListener("click",function(){
  if(state.ed>0){state.ed--; renderEditor();} else {renderKwaliteiten(); toon("s2");}
});
el("verder3").addEventListener("click",function(){
  if(!controleerEditor())return;
  if(state.ed<2){state.ed++; renderEditor();} else {klaar();}
});
el("pdfKnop").addEventListener("click",pdf);
el("wordKnop").addEventListener("click",word);
el("printKnop").addEventListener("click",print);
el("mailKnop").addEventListener("click",mail);
el("linkKnop").addEventListener("click",kopieer);
el("aanpasKnop").addEventListener("click",function(){
  // zet de gekozen kwaliteiten terug als keuze en ga naar de eerste
  state.groepen=[]; state.gekozen.forEach(function(id){var g=K.LIJST[id].groep; if(state.groepen.indexOf(g)===-1)state.groepen.push(g);});
  state.ed=0; renderEditor();
});
el("opnieuwKnop").addEventListener("click",function(){
  state={groepen:[], gekozen:[], data:{}, ed:0, weg:{}};
  window.history.replaceState(null,"",window.location.pathname); el("naam").value=""; toon("s0");
});

var uitHash=leesHash();
if(uitHash){state.gekozen=uitHash.gekozen; state.data=uitHash.data; renderResultaat();}
else{toon("s0");}
})();
