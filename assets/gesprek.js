/* Teamgesprek: kies een gesprek en laat de site het gesprek leiden, als schermvullende stappen.
   Niets wordt opgeslagen. De afspraken staan alleen op het scherm tot je ze downloadt. */
(function(){
"use strict";
var T=window.TALENT, K=window.KWADRANT, G=window.GESPREK, mk=window.UI.maakEl;
function el(id){return document.getElementById(id);}
var st={g:null,i:0,slides:[],afspraken:"",veilig:"",geluid:false,paneel:null,start:0,timer:null,tick:null,idle:null,wake:null,fase:0,vraag:0,reveal:0};

/* ---------- Hulpjes ---------- */
function pad(n){return (n<10?"0":"")+n;}
function mmss(sec){return pad(Math.floor(sec/60))+":"+pad(sec%60);}
function slideMin(s){
  if(s.min)return s.min;
  if(s.fases)return s.fases.reduce(function(a,f){return a+(f.min||0);},0);
  return 0;
}
function stappen(g){
  var res=[];
  G.gesprekken[g].slides.forEach(function(s){
    if(!s.stap)return;
    var r=res[s.stap-1]; if(!r){r=res[s.stap-1]={nr:s.stap,naam:s.stapNaam,min:0};}
    r.min+=slideMin(s);
  });
  return res.filter(Boolean);
}
function piep(){
  try{
    var C=window.AudioContext||window.webkitAudioContext; if(!C)return;
    var c=new C(), o=c.createOscillator(), g=c.createGain();
    o.type="sine"; o.frequency.value=660; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0.0001,c.currentTime); g.gain.exponentialRampToValueAtTime(0.25,c.currentTime+0.05);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+1.2);
    o.start(); o.frequency.setValueAtTime(880,c.currentTime+0.4); o.stop(c.currentTime+1.3);
    setTimeout(function(){c.close();},1600);
  }catch(e){}
}
function punten(lijst){var ul=mk("ul"); lijst.forEach(function(t){ul.appendChild(mk("li",null,t));}); return ul;}

/* ---------- Voorbereiden ---------- */
function renderKeuzes(){
  var w=el("keuzes"); w.textContent="";
  G.volgorde.forEach(function(k){
    var g=G.gesprekken[k], b=mk("button","pick"); b.type="button";
    b.setAttribute("role","radio"); b.setAttribute("aria-checked",st.g===k?"true":"false"); b.setAttribute("aria-pressed",st.g===k?"true":"false");
    b.appendChild(mk("em",null,g.min+" minuten"));
    b.appendChild(mk("strong",null,g.naam));
    b.appendChild(mk("span",null,g.doel));
    b.appendChild(mk("em",null,g.voor));
    b.addEventListener("click",function(){kies(k);});
    w.appendChild(b);
  });
}
function kies(k){
  st.g=k; renderKeuzes();
  var g=G.gesprekken[k];
  el("voorbereiding").classList.remove("hide");
  var n=el("nodig"); n.textContent=""; g.nodig.forEach(function(t){n.appendChild(mk("li",null,t));});
  var o=el("overzicht"); o.textContent="";
  stappen(k).forEach(function(s){
    var li=mk("li"); li.appendChild(mk("strong",null,s.naam)); li.appendChild(mk("span","time",s.min+" min")); o.appendChild(li);
  });
  el("startKnop").textContent="Start het "+g.naam.toLowerCase();
  el("voorbereiding").scrollIntoView({behavior:"smooth",block:"start"});
}

/* ---------- Timer ---------- */
function maakTimer(min){
  var box=mk("div","timer-box"), label=mk("p","timer-label","Tijd"), tijd=mk("div","tijd"), knoppen=mk("div","btn-row timer-knoppen");
  var start=mk("button","btn btn-small","Start"), reset=mk("button","btn btn-white btn-small","Opnieuw");
  start.type="button"; reset.type="button";
  var rest=min*60, eind=0, lopend=false, iv=null, totaal=min*60;
  function toon(){
    tijd.textContent=mmss(rest);
    box.classList.toggle("laatste",rest<=60&&rest>0);
    box.classList.toggle("tijd-om",rest===0);
    label.textContent=rest===0?"Tijd is om. Rond rustig af.":(lopend?"Tijd loopt":"Tijd");
    start.textContent=lopend?"Pauze":(rest===0?"Klaar":"Start");
  }
  function stop(){lopend=false; if(iv){clearInterval(iv);iv=null;} toon();}
  function begin(){
    if(rest===0)return; lopend=true; eind=Date.now()+rest*1000;
    iv=setInterval(function(){
      rest=Math.max(0,Math.round((eind-Date.now())/1000));
      if(rest===0){clearInterval(iv);iv=null;lopend=false; if(st.geluid)piep();}
      toon();
    },250);
    toon();
  }
  function wissel(){if(lopend)stop(); else begin();}
  start.addEventListener("click",wissel);
  reset.addEventListener("click",function(){stop(); rest=totaal; toon();});
  knoppen.appendChild(start); knoppen.appendChild(reset);
  box.appendChild(label); box.appendChild(tijd); box.appendChild(knoppen);
  toon();
  return {el:box, zet:function(m,auto){stop(); totaal=m*60; rest=totaal; toon(); if(auto)begin();}, wissel:wissel, stop:stop};
}

/* ---------- Bouwstenen ---------- */
function kopblok(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  if(s.intro)inh.appendChild(mk("p","instructie",s.intro));
  if(s.instructie)inh.appendChild(mk("p","instructie",s.instructie));
  if(s.waarom){var w=mk("p","waarom"); w.appendChild(mk("strong",null,"Waarom: ")); w.appendChild(document.createTextNode(s.waarom)); inh.appendChild(w);}
}
function kolommen(lijst){
  var g=mk("div","kolommen");
  lijst.forEach(function(k){
    var b=mk("div","kolom kw-box "+(k.klasse||"")); b.appendChild(mk("h3",null,k.kop)); b.appendChild(punten(k.punten)); g.appendChild(b);
  });
  return g;
}
function bordEl(modus){
  var g=mk("div","bord bord-"+modus);
  T.VOLGORDE.forEach(function(d){
    var info=T.DOMEINEN[d], k=mk("div","bord-kaart");
    k.appendChild(mk("h3",null,info.naam));
    k.appendChild(mk("p","polen-klein",info.links+" ↔ "+info.rechts));
    k.appendChild(mk("p","bord-vraag",G.kort[d]));
    if(modus==="kies"){k.appendChild(punten(info.vragen));}
    g.appendChild(k);
  });
  return g;
}
function kwadrantUitleg(){
  var g=mk("div","kw-grid");
  [["kw-kern","Kernkwaliteit","Wat je goed kunt"],["kw-valkuil","Valkuil","Als je er te veel van doet"],["kw-uitdaging","Uitdaging","Wat je kunt leren"],["kw-allergie","Allergie","Gedrag van anderen dat je irriteert"]].forEach(function(r){
    var b=mk("div","kw-box "+r[0]); b.appendChild(mk("b",null,r[1])); b.appendChild(mk("span",null,r[2])); g.appendChild(b);
  });
  return g;
}
function veiligLijst(){
  var rijen=st.veilig.split("\n").map(function(r){return r.replace(/^[•\-\s]+/,"").trim();}).filter(Boolean);
  return rijen;
}

var BOUW={};
BOUW.titel=function(s,inh){
  inh.appendChild(mk("h1","titel-kop",s.kop));
  inh.appendChild(mk("p","titel-sub",s.sub));
  inh.appendChild(mk("p","titel-duur","Duur: "+s.duur+" minuten · samen · vrijwillig"));
  inh.appendChild(mk("p","small","Klaar? Klik op Start of druk op de pijl naar rechts."));
};
BOUW.agenda=function(s,inh){
  kopblok(s,inh);
  var ol=mk("ol","agenda");
  stappen(s.g).forEach(function(r){
    var li=mk("li"); li.appendChild(mk("span","agenda-naam",r.naam)); li.appendChild(mk("span","time",r.min+" min")); ol.appendChild(li);
  });
  inh.appendChild(ol);
  inh.appendChild(mk("p","instructie","Je hebt nodig:"));
  inh.appendChild(punten(G.gesprekken[s.g].bij));
};
BOUW.uitleg=function(s,inh){
  kopblok(s,inh);
  (s.alinea||[]).forEach(function(t){inh.appendChild(mk("p","alinea",t));});
  if(s.punten)inh.appendChild(punten(s.punten));
  if(s.kolommen)inh.appendChild(kolommen(s.kolommen));
  if(s.voorbeeld)inh.appendChild(mk("p","vb",s.voorbeeld));
};
BOUW.spelregels=function(s,inh){
  kopblok(s,inh);
  inh.appendChild(punten(s.regels));
  var b=mk("div","bijdragen"); b.appendChild(mk("p","bijdragen-kop","Zo kun je bijdragen:"));
  var rij=mk("div","bijdragen-rij"); s.bijdragen.forEach(function(t){rij.appendChild(mk("span","bijdrage",t));}); b.appendChild(rij);
  inh.appendChild(b);
  inh.appendChild(mk("div","vraag-groot",s.vraag));
};
BOUW.bord=function(s,inh){kopblok(s,inh); inh.appendChild(bordEl(s.modus||"uitleg"));};
BOUW.stap=function(s,inh){
  kopblok(s,inh);
  if(s.punten)inh.appendChild(punten(s.punten));
  if(s.kolommen)inh.appendChild(kolommen(s.kolommen));
  if(s.voorbeeld)inh.appendChild(mk("p","vb",s.voorbeeld));
};
BOUW.kwBouw=function(s,inh){
  kopblok(s,inh);
  var wrap=mk("div","kw-bouw"); inh.appendChild(wrap);
  function teken(){
    wrap.textContent="";
    var grid=mk("div","kw-grid kw-groot");
    s.fases.forEach(function(f,i){
      var b=mk("div","kw-box "+f.klasse+(i<=st.reveal?"":" verborgen-vak")+(i===st.reveal?" nieuw-vak":""));
      b.appendChild(mk("b",null,i<=st.reveal?f.titel:"?"));
      if(i<=st.reveal)b.appendChild(mk("span",null,i===0?"Besluitvaardig":(i===1?"Drammerig":(i===2?"Geduld":"Iemand die niet kan kiezen"))));
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    var f=s.fases[st.reveal];
    wrap.appendChild(mk("p","uitleg-nu",f.titel+": "+f.tekst));
    var rij=mk("div","btn-row");
    if(st.reveal<s.fases.length-1){
      var b=mk("button","btn","Toon het volgende vak"); b.type="button";
      b.addEventListener("click",function(){st.reveal++; teken();});
      rij.appendChild(b);
    }else{rij.appendChild(mk("p","small","Klaar? Ga door met Volgende."));}
    wrap.appendChild(rij);
  }
  teken();
};
BOUW.vragen=function(s,inh){
  kopblok(s,inh);
  var vraag=mk("div","vraag-groot"); inh.appendChild(vraag);
  var rij=mk("div","btn-row");
  var vorige=mk("button","btn btn-white btn-small","← Vorige vraag"), volgende=mk("button","btn btn-small","Andere vraag →");
  vorige.type="button"; volgende.type="button";
  var stippen=mk("span","stippen");
  function toon(){vraag.textContent=s.vragen[st.vraag]; stippen.textContent=(st.vraag+1)+" van "+s.vragen.length;}
  vorige.addEventListener("click",function(){st.vraag=(st.vraag+s.vragen.length-1)%s.vragen.length; toon();});
  volgende.addEventListener("click",function(){st.vraag=(st.vraag+1)%s.vragen.length; toon();});
  rij.appendChild(vorige); rij.appendChild(volgende); rij.appendChild(stippen); inh.appendChild(rij);
  if(s.hulp)inh.appendChild(mk("p","hulp",s.hulp));
  toon();
};
BOUW.tweetal=function(s,inh,timer){
  kopblok(s,inh);
  var kaart=mk("div","fase-kaart"); inh.appendChild(kaart);
  function toonFase(auto){
    var f=s.fases[st.fase]; kaart.textContent="";
    var dots=mk("div","fase-dots");
    s.fases.forEach(function(_,i){dots.appendChild(mk("span","dot"+(i===st.fase?" nu":(i<st.fase?" klaar":""))));});
    kaart.appendChild(dots);
    kaart.appendChild(mk("p","fase-wie",f.wie));
    if(f.tekst)kaart.appendChild(mk("p","fase-tekst",f.tekst));
    if(f.bord)kaart.appendChild(bordEl("kies"));
    if(f.spreker){
      var r=mk("div","rollen");
      var a=mk("div","rol kw-box kw-kern"); a.appendChild(mk("h3",null,f.sprekerKop)); a.appendChild(mk("p",null,f.spreker));
      var b=mk("div","rol kw-box kw-uitdaging"); b.appendChild(mk("h3",null,f.luisterKop)); b.appendChild(mk("p",null,f.luister));
      r.appendChild(a); r.appendChild(b); kaart.appendChild(r);
    }
    var rij=mk("div","btn-row");
    if(st.fase<s.fases.length-1){
      var n=mk("button","btn btn-small","Volgende fase →"); n.type="button";
      n.addEventListener("click",function(){st.fase++; toonFase(true);});
      rij.appendChild(n);
      rij.appendChild(mk("span","hierna-fase","Hierna: "+s.fases[st.fase+1].wie));
    }else{rij.appendChild(mk("p","small","Klaar? Ga door met Volgende."));}
    kaart.appendChild(rij);
    timer.zet(f.min,auto);
  }
  toonFase(false);
  if(s.hulp){var h=mk("div","hulp-kader"); h.appendChild(mk("strong",null,"Lukt het even niet? ")); h.appendChild(document.createTextNode(s.hulp.replace(/^Lukt het even niet\?\s*/,""))); inh.appendChild(h);}
};
BOUW.rondje=function(s,inh){
  kopblok(s,inh);
  var z=mk("div","zinnen"); s.zinnen.forEach(function(t){z.appendChild(mk("div","zin-kaart",t));}); inh.appendChild(z);
  if(s.menu){var m=mk("div","bijdragen"); m.appendChild(mk("p","bijdragen-kop","Of kies een andere bijdrage:")); var rij=mk("div","bijdragen-rij"); s.menu.forEach(function(t){rij.appendChild(mk("span","bijdrage",t));}); m.appendChild(rij); inh.appendChild(m);}
  inh.appendChild(punten(s.regels));
};
BOUW.pauze=function(s,inh){kopblok(s,inh); inh.appendChild(mk("p","instructie",s.tekst));};

function afspraakTekst(){
  var g=G.gesprekken[st.g], v=veiligLijst();
  var t=g.naam+"\nDatum: "+new Date().toLocaleDateString("nl-NL")+"\n\n";
  t+="Afspraken om het veilig te maken:\n"+(v.length?v.map(function(r){return "• "+r;}).join("\n"):"(geen genoteerd)")+"\n\n";
  t+="Afspraken van het team:\n"+(st.afspraken.trim()||"(nog geen afspraken genoteerd)")+"\n";
  return t;
}
function afspraakKnoppen(){
  var rij=mk("div","btn-row"), melding=mk("p","msg"); melding.setAttribute("aria-live","polite");
  var dl=mk("button","btn btn-small","Download afspraken"), kopie=mk("button","btn btn-white btn-small","Kopieer"), pr=mk("button","btn btn-white btn-small","Print");
  [dl,kopie,pr].forEach(function(b){b.type="button";});
  dl.addEventListener("click",function(){
    var u=URL.createObjectURL(new Blob(["﻿",afspraakTekst()],{type:"text/plain;charset=utf-8"})), a=document.createElement("a");
    a.href=u; a.download="afspraken-teamgesprek.txt"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){URL.revokeObjectURL(u);},2000); melding.textContent="Afspraken gedownload.";
  });
  kopie.addEventListener("click",function(){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(afspraakTekst()).then(function(){melding.textContent="Afspraken gekopieerd.";},function(){melding.textContent="Kopiëren lukt niet. Download de afspraken.";});}
    else{melding.textContent="Kopiëren lukt niet. Download de afspraken.";}
  });
  pr.addEventListener("click",function(){
    var p=el("printAfspraken"); p.textContent="";
    p.appendChild(mk("h1",null,G.gesprekken[st.g].naam));
    p.appendChild(mk("p",null,"Datum: "+new Date().toLocaleDateString("nl-NL")));
    afspraakTekst().split("\n").slice(3).forEach(function(r){if(r.trim())p.appendChild(mk("p",null,r));});
    window.print();
  });
  rij.appendChild(dl); rij.appendChild(kopie); rij.appendChild(pr);
  var w=mk("div"); w.appendChild(rij); w.appendChild(melding); return w;
}
BOUW.afspraken=function(s,inh){
  kopblok(s,inh);
  var veld=s.veld==="veilig"?"veilig":"afspraken";
  var ta=document.createElement("textarea"); ta.className="afspraak-tekst"; ta.rows=6; ta.value=st[veld];
  ta.setAttribute("aria-label",veld==="veilig"?"Afspraken om het veilig te maken":"Afspraken van het team");
  ta.placeholder="Typ hier. Eén per regel.";
  ta.addEventListener("input",function(){
    st[veld]=ta.value;
    window.onbeforeunload=(st.afspraken.trim()||st.veilig.trim())?function(){return "Je afspraken zijn nog niet gedownload.";}:null;
  });
  inh.appendChild(ta);
  var vb=mk("div","vb-chips"); vb.appendChild(mk("p","small","Voorbeelden. Klik om toe te voegen:"));
  s.voorbeelden.forEach(function(t){
    var c=mk("button","btn btn-white btn-small",t); c.type="button";
    c.addEventListener("click",function(){ta.value+=(ta.value&&!/\n$/.test(ta.value)?"\n":"")+"• "+t+"\n"; ta.dispatchEvent(new Event("input"));});
    vb.appendChild(c);
  });
  inh.appendChild(vb);
  if(veld==="afspraken")inh.appendChild(afspraakKnoppen());
};
BOUW.einde=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie","Jullie hebben het gesprek gedaan. Dit zijn jullie afspraken:"));
  var k=mk("div","vraag-groot afspraak-recap");
  if(st.afspraken.trim()){st.afspraken.split("\n").forEach(function(r){if(r.trim())k.appendChild(mk("p",null,r));});}
  else{k.appendChild(mk("p",null,"Er zijn geen afspraken genoteerd. Ga eventueel terug naar de afspraken."));}
  inh.appendChild(k);
  var v=veiligLijst();
  if(v.length){inh.appendChild(mk("h2","wat-nu","Om het veilig te houden")); inh.appendChild(punten(v));}
  inh.appendChild(mk("h2","wat-nu","Wat nu?"));
  inh.appendChild(punten(["Plan over ongeveer vier weken een check-in van 15 minuten. Vraag: wat is gelukt van onze afspraken?","Neem de afspraken mee naar je volgende teamoverleg.","Gebruik de uitslagen nooit bij beoordeling, werving of promotie."]));
  inh.appendChild(afspraakKnoppen());
  var rij=mk("div","btn-row");
  var terug=mk("button","btn btn-white btn-small","Terug naar het begin"), sluit=mk("button","btn btn-small","Sluit af");
  terug.type="button"; sluit.type="button";
  terug.addEventListener("click",function(){ga(0);});
  sluit.addEventListener("click",function(){sluitDeck(true);});
  rij.appendChild(terug); rij.appendChild(sluit); inh.appendChild(rij);
};

/* ---------- De gespreksleider ---------- */
function stopTimer(){if(st.timer){st.timer.stop();st.timer=null;}}
function hierna(i){
  var cur=st.slides[i], nxt=st.slides[i+1];
  if(!nxt)return "";
  if(nxt.t==="einde")return "Hierna: afronden";
  if(nxt.stap&&(!cur.stap||nxt.stap!==cur.stap))return "Hierna: stap "+nxt.stap+" · "+nxt.stapNaam;
  return "Hierna: "+nxt.kop;
}
function ga(i){
  if(i<0||i>=st.slides.length)return;
  stopTimer(); st.i=i; st.fase=0; st.vraag=0; st.reveal=0;
  var s=st.slides[i], g=G.gesprekken[st.g], slide=el("slide");
  slide.textContent=""; slide.className="slide";
  var inh=mk("div","slide-inhoud"); slide.appendChild(inh);
  var heeftTimer=(s.t!=="titel"&&s.t!=="einde")&&(slideMin(s)>0);
  var timer=null;
  if(heeftTimer){
    slide.classList.add("heeft-timer");
    timer=maakTimer(s.t==="tweetal"?s.fases[0].min:slideMin(s)); st.timer=timer;
    var zij=mk("div","slide-zij"); zij.appendChild(timer.el);
    zij.appendChild(mk("p","small","Totaal voor dit onderdeel: "+slideMin(s)+" min"));
    slide.appendChild(zij);
  }
  slide.classList.add("t-"+s.t);
  BOUW[s.t](s,inh,timer);
  var h=hierna(i); if(h&&s.t!=="titel")inh.appendChild(mk("p","hierna",h));

  var aantalStappen=stappen(st.g).length;
  el("deckTitel").textContent=g.naam;
  el("deckStap").textContent=s.stap?("Stap "+s.stap+" van "+aantalStappen+" · "+s.stapNaam):"";
  var prog=el("deckProg"); prog.textContent="";
  st.slides.forEach(function(_,k){prog.appendChild(mk("span","seg"+(k<i?" klaar":(k===i?" nu":""))));});
  el("dVorige").disabled=i===0;
  el("dVolgende").disabled=i===st.slides.length-1;
  el("dVolgende").textContent=i===0?"Start →":"Volgende →";
  try{window.history.replaceState(null,"",window.location.pathname+"#g="+st.g+"&s="+i);}catch(e){}
  el("deck").querySelector(".deck-main").scrollTop=0;
  if(st.paneel)paneelVul(st.paneel);
}

/* Panelen: tips, spelregels en naslag */
function paneelVul(soort){
  var p=el("paneel"), s=st.slides[st.i]; p.textContent="";
  var kop=mk("div","paneel-kop"); var x=mk("button","chip-x","×"); x.type="button"; x.setAttribute("aria-label","Sluit");
  x.addEventListener("click",function(){paneelToon(soort);});
  if(soort==="tips"){
    kop.appendChild(mk("strong",null,"Tips voor jou als gespreksleider")); kop.appendChild(x); p.appendChild(kop);
    p.appendChild(mk("p",null,s.tip||"Geen tip bij dit scherm."));
    if(s.faq&&s.faq.length){
      p.appendChild(mk("p","paneel-sub","Vragen die je kunt krijgen"));
      s.faq.forEach(function(q){var d=mk("div","faq"); d.appendChild(mk("strong",null,q[0])); d.appendChild(mk("span",null,q[1])); p.appendChild(d);});
    }
  }else if(soort==="regels"){
    kop.appendChild(mk("strong",null,"Onze spelregels")); kop.appendChild(x); p.appendChild(kop);
    p.appendChild(punten(G.regels));
    var v=veiligLijst();
    if(v.length){p.appendChild(mk("p","paneel-sub","Wat jullie nog nodig hebben")); p.appendChild(punten(v));}
  }else{
    kop.appendChild(mk("strong",null,"Naslag")); kop.appendChild(x); p.appendChild(kop);
    var heeftTalent=st.g!=="kwadranten", heeftKw=st.g!=="talenten";
    if(heeftTalent){p.appendChild(mk("p","paneel-sub","De vijf kenmerken")); p.appendChild(bordEl("kies"));}
    if(heeftKw){p.appendChild(mk("p","paneel-sub","Het kernkwadrant")); p.appendChild(kwadrantUitleg());}
  }
}
function paneelToon(soort){
  var p=el("paneel");
  st.paneel=(st.paneel===soort)?null:soort;
  p.classList.toggle("hide",!st.paneel);
  ["Tips","Regels","Naslag"].forEach(function(n){
    var b=el("d"+n), actief=(n==="Tips"&&st.paneel==="tips")||(n==="Regels"&&st.paneel==="regels")||(n==="Naslag"&&st.paneel==="naslag");
    b.setAttribute("aria-pressed",actief?"true":"false");
  });
  if(st.paneel)paneelVul(st.paneel);
}

function openDeck(k,i,herstel){
  st.g=k; st.slides=G.gesprekken[k].slides; st.start=Date.now(); st.paneel=null; el("paneel").classList.add("hide");
  el("deck").classList.remove("hide"); document.body.classList.add("deck-open");
  if(!herstel){schermAan();}
  try{if(navigator.wakeLock){navigator.wakeLock.request("screen").then(function(w){st.wake=w;},function(){});}}catch(e){}
  st.tick=setInterval(function(){
    var sec=Math.floor((Date.now()-st.start)/1000);
    el("deckTotaal").textContent="Totaal "+mmss(sec)+" van "+G.gesprekken[st.g].min+":00";
  },1000);
  el("deckTotaal").textContent="Totaal 00:00 van "+G.gesprekken[k].min+":00";
  ga(i||0);
  el("dVolgende").focus();
}
function sluitDeck(vraag){
  if(vraag&&(st.afspraken.trim()||st.veilig.trim())&&!window.confirm("Weet je het zeker? Je afspraken zijn misschien nog niet gedownload.")){return;}
  stopTimer(); clearInterval(st.tick); st.tick=null;
  el("deck").classList.add("hide"); document.body.classList.remove("deck-open");
  window.onbeforeunload=null;
  try{if(st.wake){st.wake.release();st.wake=null;}}catch(e){}
  if(document.fullscreenElement&&document.exitFullscreen){document.exitFullscreen();}
  try{window.history.replaceState(null,"",window.location.pathname);}catch(e){}
  window.scrollTo(0,0);
}
function schermAan(){
  var d=el("deck");
  try{if(!document.fullscreenElement&&d.requestFullscreen){var p=d.requestFullscreen(); if(p&&p.catch)p.catch(function(){});}}catch(e){}
}
function schermWissel(){
  var d=el("deck");
  try{
    if(document.fullscreenElement){document.exitFullscreen();}
    else if(d.requestFullscreen){var p=d.requestFullscreen(); if(p&&p.catch)p.catch(function(){});}
  }catch(e){}
}
function geluidWissel(){
  st.geluid=!st.geluid; el("dGeluid").textContent=st.geluid?"Geluid aan":"Geluid uit";
  el("dGeluid").setAttribute("aria-pressed",st.geluid?"true":"false");
  if(st.geluid)piep();
}
function rust(){
  var d=el("deck"); d.classList.remove("idle");
  clearTimeout(st.idle); st.idle=setTimeout(function(){if(!el("deck").classList.contains("hide"))d.classList.add("idle");},3500);
}

/* ---------- Opstarten ---------- */
el("startKnop").addEventListener("click",function(){if(st.g)openDeck(st.g,0);});
el("dVorige").addEventListener("click",function(){ga(st.i-1);});
el("dVolgende").addEventListener("click",function(){ga(st.i+1);});
el("dTips").addEventListener("click",function(){paneelToon("tips");});
el("dRegels").addEventListener("click",function(){paneelToon("regels");});
el("dNaslag").addEventListener("click",function(){paneelToon("naslag");});
el("dGeluid").addEventListener("click",geluidWissel);
el("dScherm").addEventListener("click",schermWissel);
el("dStop").addEventListener("click",function(){sluitDeck(true);});
document.addEventListener("fullscreenchange",function(){el("dScherm").textContent=document.fullscreenElement?"Sluit volledig scherm (F)":"Volledig scherm (F)";});
["mousemove","mousedown","keydown","touchstart"].forEach(function(e){document.addEventListener(e,function(){if(!el("deck").classList.contains("hide"))rust();},{passive:true});});
document.addEventListener("keydown",function(e){
  if(el("deck").classList.contains("hide"))return;
  var tag=(e.target&&e.target.tagName)||"";
  if(tag==="TEXTAREA"||tag==="INPUT")return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  var k=e.key;
  if(k==="ArrowRight"||k==="PageDown"){e.preventDefault(); ga(st.i+1);}
  else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault(); ga(st.i-1);}
  else if(k===" "&&tag!=="BUTTON"){e.preventDefault(); ga(st.i+1);}
  else if(k==="n"||k==="N"){paneelToon("tips");}
  else if(k==="s"||k==="S"){paneelToon("regels");}
  else if(k==="k"||k==="K"){paneelToon("naslag");}
  else if(k==="f"||k==="F"){schermWissel();}
  else if(k==="t"||k==="T"){if(st.timer)st.timer.wissel();}
  else if(k==="Escape"&&st.paneel){paneelToon(st.paneel);}
});

// naslag onderaan de pagina
(function(){
  var w=el("vragenLijst");
  T.VOLGORDE.forEach(function(d){
    var info=T.DOMEINEN[d], kaart=mk("div","card qcard");
    kaart.appendChild(mk("h3",null,info.naam));
    kaart.appendChild(mk("p","small",info.links+" ↔ "+info.rechts));
    kaart.appendChild(punten(info.vragen)); w.appendChild(kaart);
  });
  var kv=el("kwVragen"); K.GESPREKSVRAGEN.forEach(function(q){kv.appendChild(mk("li",null,q));});
})();

renderKeuzes();
var m=/^#g=(talenten|kwadranten|combi)&s=(\d+)$/.exec(window.location.hash);
if(m&&G.gesprekken[m[1]]){
  var n=parseInt(m[2],10);
  kies(m[1]);
  if(n>=0&&n<G.gesprekken[m[1]].slides.length){openDeck(m[1],n,true);}
}
})();
