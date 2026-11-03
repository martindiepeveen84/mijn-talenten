/* Uitlegpagina: toont de vijf kenmerken met beide kanten */
(function(){
"use strict";
var T=window.TALENT, mk=window.UI.maakEl, wrap=document.getElementById("kenmerkenLijst");
T.VOLGORDE.forEach(function(d){
  var info=T.DOMEINEN[d];
  var kaart=mk("div","card trait");
  var kop=mk("header"); var h=mk("h3",null,info.naam+" "); h.appendChild(mk("span","big5","("+info.big5+")")); kop.appendChild(h); kaart.appendChild(kop);
  var twee=mk("div","two");
  [["laag",info.links],["hoog",info.rechts]].forEach(function(p){
    var vak=mk("div"); vak.appendChild(mk("b",null,(p[0]==="laag"?"Lager: ":"Hoger: ")+p[1]));
    vak.appendChild(document.createTextNode(info[p[0]].wat)); twee.appendChild(vak);
  });
  kaart.appendChild(twee);
  wrap.appendChild(kaart);
});
})();
