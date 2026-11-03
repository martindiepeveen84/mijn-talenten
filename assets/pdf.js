/* Kleine PDF-schrijver: maakt uitslagen als PDF-bestand, volledig in de browser.
   Gebruikt de standaardlettertypen Helvetica en Helvetica-Bold, dus geen externe bestanden. */
(function(){
"use strict";

// Breedtes (per 1000) van de tekens spatie t/m ~ in Helvetica en Helvetica-Bold
var REG=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,
  667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,
  556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
var BOLD=[278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,
  722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,
  556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

var SPECIAL={"–":0x96,"—":0x97,"’":0x92,"‘":0x91,"“":0x93,"”":0x94,"•":0x95,"·":0xB7};

function code(ch){
  if(SPECIAL[ch]!==undefined)return SPECIAL[ch];
  var c=ch.charCodeAt(0);
  if(c===0x2194||c===0x2192)return 0x2D; // pijl wordt een streepje
  if(c>=32&&c<=126)return c;
  if(c>=0xA0&&c<=0xFF)return c;
  return 0x3F;
}
function charW(ch,bold){
  var c=code(ch);
  if(c>=32&&c<=126)return (bold?BOLD:REG)[c-32];
  if(c===0x96)return 556; if(c===0x97)return 1000; if(c===0x95)return 350; if(c===0xB7)return 278;
  if(c>=0xC0){
    var base=ch.normalize("NFD").charAt(0), b=base.charCodeAt(0);
    if(b>=32&&b<=126)return (bold?BOLD:REG)[b-32];
  }
  return 556;
}
function width(s,size,bold){var w=0;for(var i=0;i<s.length;i++){w+=charW(s.charAt(i),bold);}return w*size/1000;}
function esc(s){ // PDF-tekenreeks in WinAnsi, met octale ontsnapping
  var out="";
  for(var i=0;i<s.length;i++){
    var c=code(s.charAt(i));
    if(c===0x28||c===0x29||c===0x5C){out+="\\"+String.fromCharCode(c);}
    else if(c>126||c<32){out+="\\"+("00"+c.toString(8)).slice(-3);}
    else{out+=String.fromCharCode(c);}
  }
  return out;
}
function f(n){return (Math.round(n*100)/100).toString();}
function breek(str,size,bold,maxW){
  var woorden=String(str).split(/\s+/), huidig="", regels=[];
  woorden.forEach(function(w){
    var test=huidig?huidig+" "+w:w;
    if(width(test,size,bold)>maxW&&huidig){regels.push(huidig);huidig=w;}else{huidig=test;}
  });
  if(huidig)regels.push(huidig);
  return regels;
}

var INK=[0.051,0.169,0.227], MUTED=[0.302,0.396,0.451], BLUE=[0.4,0.82,1], BLUESOFT=[0.9,0.97,1],
    YELLOW=[1,0.94,0.31], YELLOWSOFT=[1,0.984,0.76], LINE=[0.81,0.89,0.93], DEEP=[0.04,0.37,0.54], WHITE=[1,1,1];
var PW=595, PH=842, M=50, CW=PW-2*M, BOTTOM=PH-60;

// Een document met tekenhulpjes. d.y is de huidige plek (vanaf de bovenkant).
function nieuwDoc(titel){
  var d={pages:[],page:null,y:0};
  function Y(top){return PH-top;}
  function kleur(c,fill){return f(c[0])+" "+f(c[1])+" "+f(c[2])+(fill?" rg":" RG");}
  d.nieuw=function(){d.page=[];d.pages.push(d.page);d.y=M;};
  d.need=function(h){if(d.y+h>BOTTOM){d.nieuw();}};
  d.rect=function(x,top,w,h,fill,stroke,lw){
    var op=(fill&&stroke)?"B":(fill?"f":"S");
    d.page.push((fill?kleur(fill,true)+" ":"")+(stroke?kleur(stroke,false)+" "+f(lw||1)+" w ":"")+f(x)+" "+f(Y(top+h))+" "+f(w)+" "+f(h)+" re "+op);
  };
  d.lijn=function(x1,t1,x2,t2,c,lw){d.page.push(kleur(c,false)+" "+f(lw||1)+" w "+f(x1)+" "+f(Y(t1))+" m "+f(x2)+" "+f(Y(t2))+" l S");};
  d.cirkel=function(cx,top,r,fill,stroke,lw){
    var k=0.5523*r, cy=Y(top);
    d.page.push((fill?kleur(fill,true)+" ":"")+(stroke?kleur(stroke,false)+" "+f(lw||1)+" w ":"")+
      f(cx+r)+" "+f(cy)+" m "+
      f(cx+r)+" "+f(cy+k)+" "+f(cx+k)+" "+f(cy+r)+" "+f(cx)+" "+f(cy+r)+" c "+
      f(cx-k)+" "+f(cy+r)+" "+f(cx-r)+" "+f(cy+k)+" "+f(cx-r)+" "+f(cy)+" c "+
      f(cx-r)+" "+f(cy-k)+" "+f(cx-k)+" "+f(cy-r)+" "+f(cx)+" "+f(cy-r)+" c "+
      f(cx+k)+" "+f(cy-r)+" "+f(cx+r)+" "+f(cy-k)+" "+f(cx+r)+" "+f(cy)+" c h "+(fill&&stroke?"B":(fill?"f":"S")));
  };
  d.veelhoek=function(pts,fill,stroke,lw){
    var s=(fill?kleur(fill,true)+" ":"")+(stroke?kleur(stroke,false)+" "+f(lw||1)+" w ":"");
    pts.forEach(function(p,i){s+=f(p[0])+" "+f(Y(p[1]))+(i?" l ":" m ");});
    d.page.push(s+"h "+(fill&&stroke?"B":(fill?"f":"S")));
  };
  // Eén regel tekst op een vaste plek
  d.regel=function(str,x,top,size,bold,c,uitlijn){
    var w=width(str,size,bold), px=uitlijn==="rechts"?x-w:(uitlijn==="midden"?x-w/2:x);
    d.page.push("BT "+kleur(c,true)+" /"+(bold?"F2":"F1")+" "+f(size)+" Tf "+f(px)+" "+f(Y(top))+" Td ("+esc(str)+") Tj ET");
  };
  // Tekst met afbreken, over meerdere pagina's
  d.tekst=function(str,opt){
    opt=opt||{};
    var size=opt.size||10.5, bold=!!opt.bold, c=opt.kleur||INK, lh=opt.lh||size*1.4, x=opt.x||M, maxW=(opt.maxW||CW)-(x-M);
    breek(str,size,bold,maxW).forEach(function(r){d.need(lh); d.regel(r,x,d.y+size,size,bold,c); d.y+=lh;});
  };
  d.kopje=function(str){d.tekst(str,{bold:true,size:10.5,lh:15});};
  d.klaar=function(){
    var n=d.pages.length;
    d.pages.forEach(function(p,i){
      d.page=p;
      d.regel(titel+"  ·  pagina "+(i+1)+" van "+n,PW/2,PH-30,8,false,MUTED,"midden");
    });
    var delen=[], pos=0, offs=[];
    function put(s){delen.push(s);pos+=s.length;}
    function obj(num,body){offs[num]=pos;put(num+" 0 obj\n"+body+"\nendobj\n");}
    put("%PDF-1.4\n%âãÏÓ\n");
    var totaal=4+2*n;
    var kids=d.pages.map(function(_,i){return (5+2*i)+" 0 R";}).join(" ");
    obj(1,"<< /Type /Catalog /Pages 2 0 R >>");
    obj(2,"<< /Type /Pages /Kids ["+kids+"] /Count "+n+" >>");
    obj(3,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    obj(4,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    d.pages.forEach(function(p,i){
      var inhoud=p.join("\n");
      obj(5+2*i,"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+PW+" "+PH+"] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents "+(6+2*i)+" 0 R >>");
      obj(6+2*i,"<< /Length "+inhoud.length+" >>\nstream\n"+inhoud+"\nendstream");
    });
    var xref=pos, s="xref\n0 "+(totaal+1)+"\n0000000000 65535 f \n";
    for(var k=1;k<=totaal;k++){s+=("0000000000"+offs[k]).slice(-10)+" 00000 n \n";}
    put(s+"trailer\n<< /Size "+(totaal+1)+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n");
    var all=delen.join(""), bytes=new Uint8Array(all.length);
    for(var q=0;q<all.length;q++){bytes[q]=all.charCodeAt(q)&0xFF;}
    return new Blob([bytes],{type:"application/pdf"});
  };
  d.nieuw();
  return d;
}

function kop(d,titel,sub){
  d.rect(0,0,PW,110,BLUE); d.rect(0,110,PW,6,YELLOW);
  d.regel(titel,M,58,26,true,INK);
  if(sub&&sub.trim())d.regel(sub,M,86,12,false,INK);
  d.y=142;
}

/* ---------- Talentenprofiel ---------- */
function maak(o){
  var T=window.TALENT, sc=o.sc, d=nieuwDoc("Mijn talentenprofiel");
  kop(d,"Mijn talentenprofiel",(o.naam?o.naam+"  ·  ":"")+(o.datum||""));
  d.tekst("Hieronder zie je waar jij staat op vijf kenmerken. Een score links of rechts is niet beter of slechter. Het laat zien wat je meestal doet. Je scoort lager, midden of hoger op een schaal van 1 tot 5. Er is geen vergelijking met andere mensen.",{size:10.5});
  d.y+=10;

  var cx=PW/2, cy=d.y+112, R=88, n=T.VOLGORDE.length;
  function pt(i,fr){var a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*R*fr, cy+Math.sin(a)*R*fr, Math.cos(a), Math.sin(a)];}
  [0.2,0.4,0.6,0.8,1].forEach(function(fr){d.veelhoek(T.VOLGORDE.map(function(_,i){return pt(i,fr);}),null,LINE,0.8);});
  T.VOLGORDE.forEach(function(_,i){var p=pt(i,1);d.lijn(cx,cy,p[0],p[1],LINE,0.8);});
  var punten=T.VOLGORDE.map(function(k,i){return pt(i,Math.max(0.06,(sc[k]-1)/4));});
  d.veelhoek(punten,[0.72,0.91,1],DEEP,2);
  punten.forEach(function(p){d.cirkel(p[0],p[1],4.5,YELLOW,INK,1.5);});
  T.VOLGORDE.forEach(function(k,i){
    var p=pt(i,1.0), tx=cx+(p[0]-cx)*1.2, ty=cy+(p[1]-cy)*1.2;
    var uit=p[2]>0.3?"links":(p[2]<-0.3?"rechts":"midden");
    var dy=p[3]<-0.9?-4:(p[3]>0.5?12:4);
    d.regel(T.DOMEINEN[k].kort,tx,ty+dy,10,true,INK,uit);
  });
  d.y=cy+R+34;

  var rang=T.VOLGORDE.slice().sort(function(a,b){return Math.abs(sc[b]-3)-Math.abs(sc[a]-3);});
  var op=[]; rang.slice(0,2).forEach(function(k){var nv=T.niveau(sc[k]); if(nv!=="mid")op.push(T.DOMEINEN[k][nv].talent);});
  d.kopje("Wat valt het meest op?");
  d.tekst(op.length?op.join("  ·  "):"Je scoort overal in het midden: een alleskunner.",{size:11,bold:true,kleur:DEEP});
  d.y+=10;

  T.VOLGORDE.forEach(function(k){
    var info=T.DOMEINEN[k], nv=T.niveau(sc[k]), t=info[nv];
    d.need(215);
    d.lijn(M,d.y,M+CW,d.y,LINE,1); d.y+=14;
    d.tekst(info.naam+" ("+info.big5+")",{size:14,bold:true,lh:19});
    d.tekst(T.niveauTekst(nv)+" · "+T.nl(sc[k])+" van 5 – "+t.talent,{size:10.5,bold:true,kleur:DEEP,lh:16});
    d.y+=6;
    d.rect(M,d.y,CW,10,BLUESOFT,INK,1);
    [0.2,0.4,0.6,0.8].forEach(function(fr){d.lijn(M+CW*fr,d.y+1,M+CW*fr,d.y+9,LINE,0.8);});
    d.cirkel(M+(sc[k]-1)/4*CW,d.y+5,8,YELLOW,INK,1.5);
    d.y+=26;
    d.regel(info.links,M,d.y,8,false,MUTED); d.regel(info.rechts,M+CW,d.y,8,false,MUTED,"rechts"); d.y+=14;
    d.tekst(t.wat,{size:10});
    d.y+=3; d.kopje("Hier ben je goed in"); d.tekst(t.best,{size:10});
    d.y+=3; d.kopje("Let hierop"); d.tekst(t.let,{size:10});
    d.y+=3; d.kopje("Gespreksvragen voor je team");
    info.vragen.forEach(function(q){d.need(15); d.regel("•",M+2,d.y+10,10,false,INK); d.tekst(q,{size:10,x:M+14});});
    d.y+=12;
  });

  d.need(60);
  d.lijn(M,d.y,M+CW,d.y,LINE,1); d.y+=14;
  d.tekst("Big Five-model, 30 stellingen uit de International Personality Item Pool. Gebruik dit als start van een gesprek. Niet geschikt voor selectie, beoordeling of promotie.",{size:8.5,kleur:MUTED});
  if(o.link){d.tekst("Opnieuw bekijken: "+o.link,{size:8.5,kleur:MUTED});}
  return d.klaar();
}

/* ---------- Kernkwadranten ---------- */
// o.kwadranten: [{naam, uitleg, valkuil:[], uitdaging:[], allergie:[]}], o.vragen: [tekst]
function maakKwadranten(o){
  var d=nieuwDoc("Mijn kernkwadranten");
  kop(d,"Mijn kernkwadranten",(o.naam?o.naam+"  ·  ":"")+(o.datum||""));
  d.tekst("Een kernkwadrant laat zien hoe je kwaliteit en je valkuil bij elkaar horen. Wat je irriteert bij anderen, laat vaak zien wat jij nog kunt leren. Je allergie gaat over gedrag, niet over een persoon.",{size:10.5});
  d.y+=8;

  var BW=(CW-12)/2, PAD=9, LH=12.5;
  function inhoud(items){return (items&&items.length?items:["–"]).map(function(s){return "• "+s;});}
  function boxHoogte(titel,cap,items){
    var h=PAD+12+11+4, regels=0;
    inhoud(items).forEach(function(s){regels+=breek(s,10,false,BW-2*PAD).length;});
    return h+regels*LH+PAD;
  }
  function teken(x,top,w,h,fill,titel,cap,items,stroke){
    d.rect(x,top,w,h,fill,stroke||INK,1);
    d.regel(titel.toUpperCase(),x+PAD,top+PAD+9,9,true,INK);
    d.regel(cap,x+PAD,top+PAD+21,8,false,MUTED);
    var yy=top+PAD+12+11+4+10;
    inhoud(items).forEach(function(s){
      breek(s,10,false,w-2*PAD).forEach(function(r){d.regel(r,x+PAD,yy,10,false,INK); yy+=LH;});
    });
  }

  o.kwadranten.forEach(function(k,i){
    var h1=Math.max(boxHoogte("a","b",[k.naam, k.uitleg]),boxHoogte("a","b",k.valkuil),64);
    var h1b=Math.max(h1,boxHoogte("a","b",k.valkuil));
    var h2=Math.max(boxHoogte("a","b",k.uitdaging),boxHoogte("a","b",k.allergie),64);
    d.need(30+h1b+6+h2+16);
    d.tekst("Kwaliteit "+(i+1)+": "+k.naam,{size:15,bold:true,lh:22});
    d.y+=4;
    var top=d.y;
    teken(M,top,BW,h1b,BLUE,"Kernkwaliteit","Wat je goed kunt",[k.naam+(k.uitleg?" – "+k.uitleg:"")]);
    teken(M+BW+12,top,BW,h1b,YELLOWSOFT,"Valkuil","Als je er te veel van hebt",k.valkuil);
    top+=h1b+6;
    teken(M,top,BW,h2,BLUESOFT,"Uitdaging","Wat je kunt leren",k.uitdaging);
    teken(M+BW+12,top,BW,h2,WHITE,"Allergie","Gedrag van anderen dat je irriteert",k.allergie);
    d.y=top+h2+20;
  });

  d.need(100);
  d.lijn(M,d.y,M+CW,d.y,LINE,1); d.y+=14;
  d.kopje("Vragen om mee verder te gaan");
  (o.vragen||[]).forEach(function(q){d.need(15); d.regel("•",M+2,d.y+10,10,false,INK); d.tekst(q,{size:10,x:M+14});});
  d.y+=10;
  d.tekst("Het kernkwadrant is gebaseerd op het model van Daniel Ofman. Het is een hulpmiddel om na te denken over jezelf, geen test of meting. Gebruik het niet om anderen te beoordelen.",{size:8.5,kleur:MUTED});
  if(o.link){d.tekst("Opnieuw bekijken: "+o.link,{size:8.5,kleur:MUTED});}
  return d.klaar();
}

window.PDFExport={maak:maak,maakKwadranten:maakKwadranten,_breedte:width};
})();
