/* Teamgesprek: kies een gesprek en laat de site het gesprek leiden, als schermvullende stappen.
   Niets wordt opgeslagen. De afspraken staan alleen op het scherm tot je ze downloadt. */
(function(){
"use strict";
var T=window.TALENT, K=window.KWADRANT, G=window.GESPREK, mk=window.UI.maakEl;
function el(id){return document.getElementById(id);}
var st={g:null,i:0,slides:[],afspraken:"",geluid:false,tips:false,start:0,timer:null,tick:null,idle:null,wake:null,fase:0,kies:null,vraag:0};

/* ---------- Hulpjes ---------- */
function pad(n){return (n<10?"0":"")+n;}
function mmss(sec){return pad(Math.floor(sec/60))+":"+pad(sec%60);}
function slideMin(s){
  if(s.min)return s.min;
  if(s.fases)return s.fases.reduce(function(a,f){return a+f.min;},0);
  return 0;
}
function stappen(g){
  var res=[], lijst=G.gesprekken[g].slides;
  lijst.forEach(function(s){
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
  return {el:box,
    zet:function(m,auto){stop(); totaal=m*60; rest=totaal; toon(); if(auto)begin();},
    wissel:wissel, stop:stop};
}

/* ---------- Stappen tonen ---------- */
function punten(lijst){var ul=mk("ul"); lijst.forEach(function(t){ul.appendChild(mk("li",null,t));}); return ul;}
function kwVoorbeeld(){
  var g=mk("div","kw-grid kw-groot");
  [["kw-kern","Kernkwaliteit","Besluitvaardig"],["kw-valkuil","Valkuil","Drammerig"],["kw-uitdaging","Uitdaging","Geduld"],["kw-allergie","Allergie","Iemand die niet kan kiezen"]].forEach(function(r){
    var b=mk("div","kw-box "+r[0]); b.appendChild(mk("b",null,r[1])); b.appendChild(mk("span",null,r[2])); g.appendChild(b);
  });
  return g;
}
function kenmerkKiezer(){
  var blok=mk("div","kiezer");
  function teken(){
    blok.textContent="";
    blok.appendChild(mk("p","kiezer-kop","Kies een kenmerk om over te praten"));
    var rij=mk("div","kiezer-knoppen");
    T.VOLGORDE.forEach(function(d){
      var b=mk("button","btn btn-small"+(st.kies===d?"":" btn-white"),T.DOMEINEN[d].naam); b.type="button";
      b.setAttribute("aria-pressed",st.kies===d?"true":"false");
      b.addEventListener("click",function(){st.kies=d; teken();});
      rij.appendChild(b);
    });
    var r=mk("button","btn btn-small btn-white","Kies voor ons"); r.type="button";
    r.addEventListener("click",function(){st.kies=T.VOLGORDE[Math.floor(Math.random()*T.VOLGORDE.length)]; teken();});
    rij.appendChild(r); blok.appendChild(rij);
    if(st.kies){
      var info=T.DOMEINEN[st.kies], kaart=mk("div","kiezer-kaart");
      kaart.appendChild(mk("h3",null,info.naam));
      kaart.appendChild(mk("p","small",info.links+" ↔ "+info.rechts));
      kaart.appendChild(punten(info.vragen)); blok.appendChild(kaart);
    }
  }
  teken(); return blok;
}

var BOUW={};
BOUW.titel=function(s,inh){
  inh.appendChild(mk("h1","titel-kop",s.kop));
  inh.appendChild(mk("p","titel-sub",s.sub));
  inh.appendChild(mk("p","titel-duur","Duur: "+s.duur+" minuten · samen · vrijwillig"));
  inh.appendChild(mk("p","small","Klaar? Klik op Volgende of druk op de pijl naar rechts."));
};
BOUW.uitleg=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  if(s.kwVoorbeeld)inh.appendChild(kwVoorbeeld());
  inh.appendChild(punten(s.punten));
  if(s.voorbeeld)inh.appendChild(mk("p","vb",s.voorbeeld));
};
BOUW.spelregels=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(punten(s.regels));
  inh.appendChild(mk("div","vraag-groot",s.vraag));
};
BOUW.stap=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie",s.instructie));
  inh.appendChild(punten(s.punten));
  if(s.voorbeeld)inh.appendChild(mk("p","vb",s.voorbeeld));
};
BOUW.rondje=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie",s.intro));
  var z=mk("div","zinnen"); s.zinnen.forEach(function(t){z.appendChild(mk("div","zin-kaart",t));}); inh.appendChild(z);
  inh.appendChild(punten(s.regels));
};
BOUW.vragen=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie",s.intro));
  var vraag=mk("div","vraag-groot"); inh.appendChild(vraag);
  var rij=mk("div","btn-row");
  var vorige=mk("button","btn btn-white btn-small","← Vorige vraag"), volgende=mk("button","btn btn-small","Andere vraag →");
  vorige.type="button"; volgende.type="button";
  var stippen=mk("span","stippen");
  function toon(){
    vraag.textContent=s.vragen[st.vraag];
    stippen.textContent=(st.vraag+1)+" van "+s.vragen.length;
  }
  vorige.addEventListener("click",function(){st.vraag=(st.vraag+s.vragen.length-1)%s.vragen.length; toon();});
  volgende.addEventListener("click",function(){st.vraag=(st.vraag+1)%s.vragen.length; toon();});
  rij.appendChild(vorige); rij.appendChild(volgende); rij.appendChild(stippen); inh.appendChild(rij);
  toon();
};
BOUW.tweetal=function(s,inh,timer){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie",s.intro));
  if(s.kenmerkKiezer)inh.appendChild(kenmerkKiezer());
  var kaart=mk("div","fase-kaart"); inh.appendChild(kaart);
  function toonFase(auto){
    var f=s.fases[st.fase]; kaart.textContent="";
    var dots=mk("div","fase-dots");
    s.fases.forEach(function(_,i){dots.appendChild(mk("span","dot"+(i===st.fase?" nu":(i<st.fase?" klaar":""))));});
    kaart.appendChild(dots);
    kaart.appendChild(mk("p","fase-wie",f.wie));
    kaart.appendChild(mk("p","fase-tekst",f.tekst));
    var rij=mk("div","btn-row");
    if(st.fase<s.fases.length-1){
      var b=mk("button","btn btn-small","Volgende fase →"); b.type="button";
      b.addEventListener("click",function(){st.fase++; toonFase(true);});
      rij.appendChild(b);
    }else{
      rij.appendChild(mk("p","small","Klaar? Ga door met Volgende."));
    }
    kaart.appendChild(rij);
    timer.zet(f.min,auto);
  }
  toonFase(false);
};
BOUW.afspraken=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie",s.intro));
  var ta=document.createElement("textarea"); ta.className="afspraak-tekst"; ta.rows=7; ta.value=st.afspraken;
  ta.setAttribute("aria-label","Afspraken van het team"); ta.placeholder="Typ hier de afspraken. Eén per regel.";
  ta.addEventListener("input",function(){st.afspraken=ta.value; window.onbeforeunload=ta.value.trim()?function(){return "Je afspraken zijn nog niet gedownload.";}:null;});
  inh.appendChild(ta);
  var vb=mk("div","vb-chips");
  vb.appendChild(mk("p","small","Voorbeelden. Klik om toe te voegen:"));
  s.voorbeelden.forEach(function(t){
    var c=mk("button","btn btn-white btn-small",t); c.type="button";
    c.addEventListener("click",function(){ta.value+=(ta.value&&!/\n$/.test(ta.value)?"\n":"")+"• "+t+"\n"; st.afspraken=ta.value; ta.dispatchEvent(new Event("input"));});
    vb.appendChild(c);
  });
  inh.appendChild(vb);
  inh.appendChild(afspraakKnoppen());
};
function afspraakTekst(){
  var g=G.gesprekken[st.g];
  return g.naam+"\nDatum: "+new Date().toLocaleDateString("nl-NL")+"\n\nAfspraken:\n"+(st.afspraken.trim()||"(nog geen afspraken genoteerd)")+"\n";
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
    p.appendChild(mk("h2",null,"Afspraken"));
    (st.afspraken.trim()||"(nog geen afspraken genoteerd)").split("\n").forEach(function(r){if(r.trim())p.appendChild(mk("p",null,r));});
    window.print();
  });
  rij.appendChild(dl); rij.appendChild(kopie); rij.appendChild(pr);
  var w=mk("div"); w.appendChild(rij); w.appendChild(melding); return w;
}
BOUW.einde=function(s,inh){
  inh.appendChild(mk("h1",null,s.kop));
  inh.appendChild(mk("p","instructie","Jullie hebben het gesprek gedaan. Dit zijn jullie afspraken:"));
  var k=mk("div","vraag-groot afspraak-recap");
  if(st.afspraken.trim()){st.afspraken.split("\n").forEach(function(r){if(r.trim())k.appendChild(mk("p",null,r));});}
  else{k.appendChild(mk("p",null,"Er zijn geen afspraken genoteerd. Ga eventueel terug naar de afspraken."));}
  inh.appendChild(k);
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
function ga(i){
  if(i<0||i>=st.slides.length)return;
  stopTimer(); st.i=i; st.fase=0; st.vraag=0; st.kies=null;
  var s=st.slides[i], g=G.gesprekken[st.g], slide=el("slide");
  slide.textContent=""; slide.className="slide";
  var inh=mk("div","slide-inhoud"); slide.appendChild(inh);
  var heeftTimer=(s.t!=="titel"&&s.t!=="einde")&&(slideMin(s)>0);
  var timer=null;
  if(heeftTimer){
    slide.classList.add("heeft-timer");
    timer=maakTimer(s.t==="tweetal"?s.fases[0].min:slideMin(s)); st.timer=timer;
    var zij=mk("div","slide-zij"); zij.appendChild(timer.el);
    if(slideMin(s)){zij.appendChild(mk("p","small","Totaal voor deze stap: "+slideMin(s)+" min"));}
    slide.appendChild(zij);
  }
  slide.classList.add("t-"+s.t);
  BOUW[s.t](s,inh,timer);

  // balk bovenin
  var aantalStappen=stappen(st.g).length;
  el("deckTitel").textContent=g.naam;
  el("deckStap").textContent=s.stap?("Stap "+s.stap+" van "+aantalStappen+" · "+s.stapNaam):"";
  var prog=el("deckProg"); prog.textContent="";
  st.slides.forEach(function(_,k){prog.appendChild(mk("span","seg"+(k<i?" klaar":(k===i?" nu":""))));});
  el("tips").textContent=s.tip?("Tip voor jou: "+s.tip):"";
  el("dVorige").disabled=i===0;
  el("dVolgende").disabled=i===st.slides.length-1;
  el("dVolgende").textContent=i===0?"Start →":"Volgende →";
  try{window.history.replaceState(null,"",window.location.pathname+"#g="+st.g+"&s="+i);}catch(e){}
  slide.scrollTop=0; el("deck").querySelector(".deck-main").scrollTop=0;
}
function openDeck(k,i,herstel){
  st.g=k; st.slides=G.gesprekken[k].slides; st.start=Date.now();
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
  if(vraag&&st.afspraken.trim()&&!window.confirm("Weet je het zeker? Je afspraken zijn misschien nog niet gedownload.")){return;}
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
function tipsWissel(){
  st.tips=!st.tips; el("tips").classList.toggle("hide",!st.tips||!el("tips").textContent);
  el("dTips").setAttribute("aria-pressed",st.tips?"true":"false");
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
el("dTips").addEventListener("click",tipsWissel);
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
  else if(k==="n"||k==="N"){tipsWissel();}
  else if(k==="f"||k==="F"){schermWissel();}
  else if(k==="t"||k==="T"){if(st.timer)st.timer.wissel();}
});

// naslag onderaan
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
