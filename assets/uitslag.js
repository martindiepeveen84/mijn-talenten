/* Uitslagpagina: leest de scores uit het adres (#r=...), toont en exporteert ze. Niets wordt opgeslagen. */
(function(){
"use strict";
var T=window.TALENT, mk=window.UI.maakEl, el=function(id){return document.getElementById(id);};
var sc=null;

function toon(){
  var gelezen=T.leesHash(window.location.hash);
  if(!gelezen){el("leeg").classList.remove("hide"); return;}
  sc=gelezen.sc;
  el("inhoud").classList.remove("hide");
  window.UI.tekenRadar(el("radar"),sc);

  // opvallendste kenmerken: de twee die het verst van het midden liggen
  var rang=T.VOLGORDE.slice().sort(function(a,b){return Math.abs(sc[b]-3)-Math.abs(sc[a]-3);});
  var chips=el("chips"), aantal=0;
  rang.slice(0,2).forEach(function(d){
    var n=T.niveau(sc[d]); if(n==="mid")return;
    chips.appendChild(mk("span","chip",T.DOMEINEN[d][n].talent)); aantal++;
  });
  if(!aantal){chips.appendChild(mk("span","chip","Je scoort overal in het midden: een alleskunner"));}

  gelezen.codes.split("").forEach(function(c){
    if(T.MELDINGEN[c]){el("meldingen").appendChild(mk("p","note",T.MELDINGEN[c]));}
  });

  var wrap=el("kenmerken");
  T.VOLGORDE.forEach(function(d){
    var info=T.DOMEINEN[d], n=T.niveau(sc[d]), t=info[n];
    var kaart=mk("article","card trait");
    var kop=mk("header"); var h=mk("h3",null,info.naam+" ");
    h.appendChild(mk("span","big5","("+info.big5+")"));
    kop.appendChild(h); kop.appendChild(mk("span","level",T.niveauTekst(n)+" · "+T.nl(sc[d])+" van 5"));
    kaart.appendChild(kop);
    kaart.appendChild(mk("p",null,"")).appendChild(mk("strong",null,t.talent));
    var meter=mk("div","meter"); meter.setAttribute("aria-hidden","true");
    [20,40,60,80].forEach(function(p){var s=mk("i"); s.style.left=p+"%"; meter.appendChild(s);});
    var dot=mk("div","dot"); dot.style.left=((sc[d]-1)/4*100)+"%"; meter.appendChild(dot);
    kaart.appendChild(meter);
    var polen=mk("div","poles"); polen.appendChild(mk("span",null,info.links)); polen.appendChild(mk("span",null,info.rechts));
    kaart.appendChild(polen);
    kaart.appendChild(mk("p",null,t.wat));
    var twee=mk("div","two");
    var a=mk("div"); a.appendChild(mk("b",null,"Hier ben je goed in")); a.appendChild(document.createTextNode(t.best));
    var b=mk("div"); b.appendChild(mk("b",null,"Let hierop")); b.appendChild(document.createTextNode(t.let));
    twee.appendChild(a); twee.appendChild(b); kaart.appendChild(twee);
    var vraag=mk("div","ask"); vraag.appendChild(document.createTextNode("Gespreksvragen voor je team"));
    var ul=mk("ul"); info.vragen.forEach(function(q){ul.appendChild(mk("li",null,q));}); vraag.appendChild(ul);
    kaart.appendChild(vraag);
    wrap.appendChild(kaart);
  });
}

/* ---------- Delen en bewaren ---------- */
function melding(t){el("melding").textContent=t;}
function naam(){return el("naam").value.trim();}
function maakLink(){
  if(window.location.protocol!=="http:"&&window.location.protocol!=="https:")return "";
  return window.location.origin+window.location.pathname+"#"+T.codeNaarLink(sc,"");
}
function samenvatting(){
  var n=naam(), r=["Mijn talentenprofiel"+(n?" ("+n+")":""),""];
  T.VOLGORDE.forEach(function(d){
    var nv=T.niveau(sc[d]);
    r.push("- "+T.DOMEINEN[d].naam+": "+T.niveauTekst(nv)+" ("+T.nl(sc[d])+" van 5) – "+T.DOMEINEN[d][nv].talent);
  });
  var l=maakLink(); if(l){r.push("","Bekijk mijn volledige uitslag met uitleg:",l);}
  return r.join("\n");
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

function print(){
  var n=naam(), oud=document.title;
  el("printNaam").textContent=n?"– "+n:"";
  document.title="Mijn talentenprofiel"+(n?" - "+n:"");
  window.print();
  document.title=oud;
}

function pdf(){
  var blob=window.PDFExport.maak({sc:sc,naam:naam(),datum:new Date().toLocaleDateString("nl-NL"),link:maakLink()});
  download(blob,"mijn-talentenprofiel.pdf");
  melding("PDF gedownload. Kijk in je map Downloads.");
}

function word(){
  var n=naam();
  var h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Mijn talentenprofiel</title>'
   +'<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#0d2b3a}h1{font-size:20pt}h2{font-size:14pt;margin-bottom:2pt}p{margin:3pt 0}'
   +'table.balk{border-collapse:collapse;width:100%}table.balk td{border:1px solid #0d2b3a;height:14px}.vraag{background:#fff04f;padding:4pt}</style></head><body>';
  h+='<h1>Mijn talentenprofiel</h1><p>'+(n?esc(n)+" – ":"")+esc(new Date().toLocaleDateString("nl-NL"))+'</p>';
  h+='<p>Een score links of rechts is niet beter of slechter. Het laat zien wat je meestal doet. Je scoort lager, midden of hoger op een schaal van 1 tot 5. Er is geen vergelijking met andere mensen.</p>';
  T.VOLGORDE.forEach(function(d){
    var info=T.DOMEINEN[d], nv=T.niveau(sc[d]), t=info[nv];
    var vak=Math.min(4,Math.floor((sc[d]-1)/4*5));
    h+='<h2>'+esc(info.naam)+' ('+esc(info.big5)+')</h2>';
    h+='<p><b>'+T.niveauTekst(nv)+' · '+T.nl(sc[d])+' van 5 – '+esc(t.talent)+'</b></p><table class="balk"><tr>';
    for(var i=0;i<5;i++){h+='<td'+(i===vak?' bgcolor="#66d1ff"':'')+'>&nbsp;</td>';}
    h+='</tr></table><p style="font-size:9pt;color:#4d6573">'+esc(info.links)+' &lt;—&gt; '+esc(info.rechts)+'</p>';
    h+='<p>'+esc(t.wat)+'</p><p><b>Hier ben je goed in:</b> '+esc(t.best)+'</p><p><b>Let hierop:</b> '+esc(t.let)+'</p>';
    h+='<p class="vraag"><b>Gespreksvragen:</b></p><ul>'+info.vragen.map(function(q){return '<li>'+esc(q)+'</li>';}).join("")+'</ul>';
  });
  h+='<p style="font-size:9pt;color:#4d6573">Big Five-model, 30 stellingen uit de International Personality Item Pool. Gebruik dit als start van een gesprek. Niet geschikt voor selectie of beoordeling.</p>';
  var l=maakLink();
  if(l){h+='<p style="font-size:9pt;color:#4d6573">Opnieuw bekijken: <a href="'+esc(l)+'">'+esc(l)+'</a></p>';}
  h+='</body></html>';
  download(new Blob(["﻿",h],{type:"application/msword"}),"mijn-talentenprofiel.doc");
  melding("Word-bestand gedownload. Kijk in je map Downloads.");
}

function download(blob,naamBestand){
  var u=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=u; a.download=naamBestand; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){URL.revokeObjectURL(u);},2000);
}

function mail(){
  window.location.href="mailto:?subject="+encodeURIComponent("Mijn talentenprofiel")+"&body="+encodeURIComponent(samenvatting());
  melding("Je mailprogramma opent. Opent er niets? Download dan het Word-bestand en mail dat zelf naar jezelf.");
}
function kopieer(){
  var l=maakLink();
  if(!l){melding("De link werkt pas als de app op een webadres staat.");return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(l).then(function(){melding("Link gekopieerd.");},function(){melding("Kopiëren lukt niet. Kopieer de link uit de adresbalk.");});
  }else{melding("Kopiëren lukt niet in deze browser. Kopieer de link uit de adresbalk.");}
}

/* ---------- Afbeelding ---------- */
function rondRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function regels(c,tekst,x,y,maxB,lh){
  var regel="";
  tekst.split(" ").forEach(function(w){
    var test=regel?regel+" "+w:w;
    if(c.measureText(test).width>maxB&&regel){c.fillText(regel,x,y);y+=lh;regel=w;}else{regel=test;}
  });
  if(regel){c.fillText(regel,x,y);y+=lh;}
  return y;
}
function png(){
  var W=1080,H=1500,cv=document.createElement("canvas"); cv.width=W; cv.height=H;
  var x=cv.getContext("2d"), F="Segoe UI, Arial, sans-serif";
  x.fillStyle="#f4fbff"; x.fillRect(0,0,W,H);
  x.fillStyle="#66d1ff"; x.fillRect(0,0,W,160);
  x.fillStyle="#fff04f"; x.fillRect(0,160,W,12);
  x.fillStyle="#0d2b3a"; x.font="bold 58px "+F; x.fillText("Mijn talentenprofiel",50,98);
  var n=naam(); if(n){x.font="32px "+F; x.fillText(n,50,142);}
  var y=240;
  T.VOLGORDE.forEach(function(d){
    var nv=T.niveau(sc[d]), info=T.DOMEINEN[d];
    x.fillStyle="#fff"; x.strokeStyle="#cfe3ee"; x.lineWidth=3; rondRect(x,40,y-44,W-80,236,22); x.fill(); x.stroke();
    x.fillStyle="#0d2b3a"; x.font="bold 36px "+F; x.fillText(info.naam,70,y);
    x.font="bold 30px "+F; x.fillText(info[nv].talent,70,y+44);
    x.font="26px "+F; x.fillStyle="#4d6573"; x.fillText(T.niveauTekst(nv)+" · "+T.nl(sc[d])+" van 5",70,y+82);
    var bx=70,bw=W-140,by=y+106;
    x.fillStyle="#e6f7ff"; x.strokeStyle="#0d2b3a"; x.lineWidth=3; rondRect(x,bx,by,bw,22,11); x.fill(); x.stroke();
    x.fillStyle="#fff04f"; x.beginPath(); x.arc(bx+(sc[d]-1)/4*bw,by+11,18,0,Math.PI*2); x.fill(); x.stroke();
    x.fillStyle="#4d6573"; x.font="22px "+F; x.textAlign="left"; x.fillText(info.links,bx,by+58);
    x.textAlign="right"; x.fillText(info.rechts,bx+bw,by+58); x.textAlign="left";
    y+=264;
  });
  x.fillStyle="#4d6573"; x.font="22px "+F;
  regels(x,"Big Five-model · 30 stellingen uit de International Personality Item Pool. Een stip links of rechts is niet beter of slechter. Gebruik dit als start van een gesprek.",50,y+6,W-100,32);
  cv.toBlob(function(b){download(b,"mijn-talentenprofiel.png"); melding("Afbeelding gedownload.");},"image/png");
}

el("pdfKnop").addEventListener("click",pdf);
el("wordKnop").addEventListener("click",word);
el("pngKnop").addEventListener("click",png);
el("printKnop").addEventListener("click",print);
el("mailKnop").addEventListener("click",mail);
el("linkKnop").addEventListener("click",kopieer);
window.addEventListener("hashchange",function(){window.location.reload();});
toon();
})();
