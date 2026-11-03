/* Teamgesprek: gespreksvragen per kenmerk en printknop */
(function(){
"use strict";
var T=window.TALENT, mk=window.UI.maakEl, wrap=document.getElementById("vragenLijst");
T.VOLGORDE.forEach(function(d){
  var info=T.DOMEINEN[d], kaart=mk("div","card qcard");
  kaart.appendChild(mk("h3",null,info.naam));
  kaart.appendChild(mk("p","small",info.links+" ↔ "+info.rechts));
  var ul=mk("ul"); info.vragen.forEach(function(q){ul.appendChild(mk("li",null,q));});
  kaart.appendChild(ul); wrap.appendChild(kaart);
});
document.getElementById("printKnop").addEventListener("click",function(){window.print();});
})();
