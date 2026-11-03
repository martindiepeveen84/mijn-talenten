/* Gedeelde hulpjes: menu-markering en het spinnenwebdiagram (radar) */
(function(){
"use strict";
var NS="http://www.w3.org/2000/svg";

function maakEl(tag,klasse,tekst){var e=document.createElement(tag);if(klasse)e.className=klasse;if(tekst!==undefined)e.textContent=tekst;return e;}

// Markeer de huidige pagina in het menu
var pagina=(document.body.getAttribute("data-page")||"");
document.querySelectorAll(".site-header nav a").forEach(function(a){
  if(a.getAttribute("data-page")===pagina){a.setAttribute("aria-current","page");}
});

// vals: object met sleutels E,A,C,S,O en waarden 1 t/m 5
function tekenRadar(svg,vals){
  var T=window.TALENT, cx=180, cy=160, R=100, n=T.VOLGORDE.length;
  svg.setAttribute("viewBox","-40 0 440 330");
  svg.setAttribute("role","img");
  svg.textContent="";
  function pt(i,f){var a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*R*f, cy+Math.sin(a)*R*f, Math.cos(a), Math.sin(a)];}
  function mk(naam,at){var e=document.createElementNS(NS,naam);Object.keys(at).forEach(function(k){e.setAttribute(k,at[k]);});return e;}
  [0.2,0.4,0.6,0.8,1].forEach(function(f){
    var p=T.VOLGORDE.map(function(_,i){var q=pt(i,f);return q[0].toFixed(1)+","+q[1].toFixed(1);}).join(" ");
    svg.appendChild(mk("polygon",{points:p,"class":"r-grid"}));
  });
  T.VOLGORDE.forEach(function(_,i){var q=pt(i,1);svg.appendChild(mk("line",{x1:cx,y1:cy,x2:q[0],y2:q[1],"class":"r-spoke"}));});
  var punten=T.VOLGORDE.map(function(d,i){var f=Math.max(0.06,(vals[d]-1)/4);return pt(i,f);});
  svg.appendChild(mk("polygon",{points:punten.map(function(q){return q[0].toFixed(1)+","+q[1].toFixed(1);}).join(" "),"class":"r-shape"}));
  punten.forEach(function(q){svg.appendChild(mk("circle",{cx:q[0],cy:q[1],r:6,"class":"r-dot"}));});
  T.VOLGORDE.forEach(function(d,i){
    var q=pt(i,1.2), anker=q[2]>0.3?"start":(q[2]<-0.3?"end":"middle");
    var dy=q[3]<-0.9?-4:(q[3]>0.5?16:5);
    var t=mk("text",{x:q[0].toFixed(1),y:(q[1]+dy).toFixed(1),"text-anchor":anker});
    t.textContent=T.DOMEINEN[d].kort;
    svg.appendChild(t);
  });
  svg.setAttribute("aria-label","Spinnenwebdiagram met je scores: "+T.VOLGORDE.map(function(d){return T.DOMEINEN[d].kort+" "+T.nl(vals[d]);}).join(", "));
}

// Voorbeeld-diagrammen op de landingspagina
document.querySelectorAll("svg.radar[data-values]").forEach(function(svg){
  var w=svg.getAttribute("data-values").split(",").map(parseFloat), v={};
  window.TALENT.VOLGORDE.forEach(function(d,i){v[d]=w[i];});
  tekenRadar(svg,v);
});

window.UI={maakEl:maakEl,tekenRadar:tekenRadar};
})();
