/* De vragenlijst: één stelling per scherm. Niets wordt opgeslagen. */
(function(){
"use strict";
var T=window.TALENT, el=function(id){return document.getElementById(id);};
var volgorde=[], antw=[], pos=0, bezig=false;

function schud(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

// Zes rondes; in elke ronde komt van elk kenmerk één stelling, in willekeurige volgorde
function maakVolgorde(){
  var per={E:[],A:[],C:[],S:[],O:[]};
  T.ITEMS.forEach(function(it,i){per[it.d==="N"?"S":it.d].push(i);});
  T.VOLGORDE.forEach(function(d){schud(per[d]);});
  var uit=[];
  for(var r=0;r<6;r++){schud(T.VOLGORDE.slice()).forEach(function(d){uit.push(per[d][r]);});}
  return uit;
}

function start(){
  volgorde=maakVolgorde(); antw=new Array(T.ITEMS.length); pos=0;
  el("intro").classList.add("hide"); el("flow").classList.remove("hide");
  toon(); window.scrollTo(0,0);
}

function toon(){
  bezig=false;
  var idx=volgorde[pos], n=T.ITEMS.length;
  el("counter").textContent="Stelling "+(pos+1)+" van "+n;
  el("nogTekst").textContent=(n-pos-1)===0?"Laatste stelling":("Nog "+(n-pos-1));
  el("progress").setAttribute("aria-valuenow",pos);
  el("bar").style.width=(pos/n*100)+"%";
  el("question").textContent=T.ITEMS[idx].t;
  var wrap=el("answers"); wrap.textContent="";
  T.SCHAAL.forEach(function(tekst,i){
    var b=document.createElement("button");
    b.type="button"; b.className="answer"+(antw[idx]===i+1?" picked":"");
    var num=document.createElement("b"); num.textContent=String(i+1);
    b.appendChild(num); b.appendChild(document.createTextNode(tekst));
    b.addEventListener("click",function(){kies(i+1,b);});
    wrap.appendChild(b);
  });
  el("terugKnop").style.visibility=pos===0?"hidden":"visible";
}

function kies(w,knop){
  if(bezig)return; bezig=true;
  antw[volgorde[pos]]=w;
  if(knop){knop.classList.add("picked");}
  setTimeout(function(){
    if(pos<T.ITEMS.length-1){pos++; toon();} else {klaar();}
  },160);
}

function klaar(){
  var sc=T.bereken(antw), codes=T.controles(antw,sc);
  window.location.href="uitslag.html#"+T.codeNaarLink(sc,codes);
}

el("startKnop").addEventListener("click",start);
el("terugKnop").addEventListener("click",function(){if(pos>0){pos--; toon();}});
document.addEventListener("keydown",function(e){
  if(el("flow").classList.contains("hide"))return;
  if(e.key>="1"&&e.key<="5"&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
    var knoppen=el("answers").querySelectorAll(".answer");
    kies(parseInt(e.key,10),knoppen[parseInt(e.key,10)-1]);
  }
});
})();
