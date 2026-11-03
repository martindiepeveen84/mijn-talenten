/* Mijn talenten – stellingen, teksten en rekenregels. Geen opslag, geen verbinding. */
(function(){
"use strict";

var ITEMS = [
  {t:"Ik ben de gangmaker op een feestje.", d:"E", k:1},
  {t:"Ik praat met veel verschillende mensen op een feestje.", d:"E", k:1},
  {t:"Ik begin makkelijk een gesprek.", d:"E", k:1},
  {t:"Ik praat niet zo veel.", d:"E", k:-1},
  {t:"Ik hou me liever op de achtergrond.", d:"E", k:-1},
  {t:"Ik vind het moeilijk om op mensen af te stappen.", d:"E", k:-1},

  {t:"Ik leef met anderen mee.", d:"A", k:1},
  {t:"Ik voel de emoties van anderen goed aan.", d:"A", k:1},
  {t:"Ik neem tijd voor anderen.", d:"A", k:1},
  {t:"Ik heb geen interesse in de problemen van anderen.", d:"A", k:-1},
  {t:"Ik ben niet echt geïnteresseerd in anderen.", d:"A", k:-1},
  {t:"Ik maak anderen weleens belachelijk.", d:"A", k:-1},

  {t:"Ik doe klusjes meteen.", d:"C", k:1},
  {t:"Ik hou van orde.", d:"C", k:1},
  {t:"Ik hou me aan een vast schema.", d:"C", k:1},
  {t:"Ik laat mijn spullen vaak rondslingeren.", d:"C", k:-1},
  {t:"Ik maak er vaak een rommeltje van.", d:"C", k:-1},
  {t:"Ik vind het moeilijk om aan het werk te gaan.", d:"C", k:-1},

  {t:"Mijn stemming wisselt vaak.", d:"N", k:1},
  {t:"Ik raak snel van streek.", d:"N", k:1},
  {t:"Ik pieker over dingen.", d:"N", k:1},
  {t:"Ik ben meestal ontspannen.", d:"N", k:-1},
  {t:"Ik voel me zelden somber.", d:"N", k:-1},
  {t:"Kleine dingen houden me niet snel bezig.", d:"N", k:-1},

  {t:"Ik heb een levendige fantasie.", d:"O", k:1},
  {t:"Ik hoor graag nieuwe ideeën.", d:"O", k:1},
  {t:"Ik bedenk graag nieuwe manieren om dingen te doen.", d:"O", k:1},
  {t:"Ik vind abstracte ideeën moeilijk te begrijpen.", d:"O", k:-1},
  {t:"Abstracte ideeën interesseren me niet.", d:"O", k:-1},
  {t:"Ik heb weinig fantasie.", d:"O", k:-1}
];

var SCHAAL = ["Helemaal oneens","Oneens","Neutraal","Eens","Helemaal eens"];

// S = emotionele stabiliteit (het omgekeerde van neuroticisme): hoog = kalm
var DOMEINEN = {
 E:{naam:"Energie en contact", kort:"Energie", big5:"Extraversie", links:"Rustig en diepgaand", rechts:"Contact en energie",
  vragen:["Wanneer krijg jij energie van mensen, en wanneer kost het juist energie?","Hoe deel jij ideeën het liefst: in de groep, in een klein gesprek of op papier?","Wat kunnen wij doen zodat jij je stem laat horen?"],
  laag:{talent:"Rustig en diepgaand", wat:"Je werkt graag rustig en met een paar mensen. Je denkt na voor je iets zegt. Veel drukte kost je energie.", best:"Je luistert goed en gaat de diepte in.", let:"Anderen zien niet altijd wat jij kunt. Laat je ideeën horen."},
  mid:{talent:"Schakelen tussen praten en luisteren", wat:"Je kunt goed met mensen omgaan, maar je hebt ook tijd voor jezelf nodig. Je schakelt makkelijk tussen praten en luisteren.", best:"Je past je aan wat de groep nodig heeft.", let:"Anderen weten soms niet wat jij nodig hebt. Zeg het."},
  hoog:{talent:"Contact en energie geven", wat:"Je krijgt energie van mensen. Je maakt snel contact en praat makkelijk. Je brengt sfeer en beweging in een groep.", best:"Je haalt mensen bij elkaar en maakt een team levendig.", let:"Anderen komen soms moeilijk aan het woord. Geef ook ruimte om te luisteren."}},
 A:{naam:"Samenwerken", kort:"Samenwerken", big5:"Vriendelijkheid", links:"Kritisch en duidelijk", rechts:"Meeleven en samenwerken",
  vragen:["Wanneer help je anderen graag, en wanneer zeg je liever duidelijk wat je vindt?","Wanneer is het voor jou lastig om nee te zeggen? En wanneer juist om iets aardigs te zeggen?","Hoe laten we merken dat we het ergens niet mee eens zijn, zonder dat het pijn doet?"],
  laag:{talent:"Kritisch en duidelijk", wat:"Je zegt wat je vindt en let op de feiten. Je komt op voor je eigen standpunt. Je kunt goed kritisch zijn.", best:"Je bent duidelijk en helpt om scherpe keuzes te maken.", let:"Je kunt hard overkomen. Laat ook merken dat je anderen waardeert."},
  mid:{talent:"Balans tussen meeleven en duidelijk zijn", wat:"Je let op anderen, maar je durft ook je eigen mening te geven. Je zoekt vaak een middenweg.", best:"Je kunt zowel steunen als tegengas geven.", let:"Soms weet een ander niet welke kant je kiest. Zeg het hardop."},
  hoog:{talent:"Meeleven en samenwerken", wat:"Je let op anderen en wilt dat iedereen zich prettig voelt. Je helpt graag en zoekt naar wat past voor beide kanten.", best:"Je zorgt voor vertrouwen en een fijne sfeer.", let:"Je kunt moeilijk nee zeggen of lastige dingen uitstellen. Zeg ook wat jij vindt."}},
 C:{naam:"Aanpak en planning", kort:"Aanpak", big5:"Zorgvuldigheid", links:"Flexibel en snel schakelen", rechts:"Plannen en afmaken",
  vragen:["Hoeveel plan en structuur heb jij nodig om goed te werken?","Welke afspraken helpen jou om dingen af te maken?","Wanneer is een plan fijn, en wanneer zit het je in de weg?"],
  laag:{talent:"Flexibel en snel schakelen", wat:"Je werkt flexibel en op gevoel. Je past je snel aan als het anders loopt. Vaste plannen en regels vind je snel te strak.", best:"Je schakelt snel en blijft rustig als plannen veranderen.", let:"Deadlines en details kunnen blijven liggen. Maak afspraken die jou helpen."},
  mid:{talent:"Structuur met ruimte", wat:"Je plant wat nodig is en laat de rest open. Je kunt netjes werken, maar ook improviseren.", best:"Je kunt wisselen tussen plannen en meebewegen.", let:"Je weet soms niet wat anderen van je verwachten. Maak afspraken duidelijk."},
  hoog:{talent:"Plannen en afmaken", wat:"Je werkt gestructureerd en komt afspraken na. Je plant vooruit en maakt dingen af.", best:"Anderen kunnen op je rekenen.", let:"Je kunt streng zijn voor jezelf en anderen. Laat ook ruimte voor verrassingen."}},
 S:{naam:"Omgaan met spanning", kort:"Spanning", big5:"Emotionele stabiliteit", links:"Gevoelig en alert", rechts:"Kalm blijven",
  vragen:["Wat helpt jou om rustig te blijven als het druk of spannend is?","Wat merk je aan jezelf als de druk oploopt?","Hoe kunnen collega's jou helpen als het spannend wordt?"],
  laag:{talent:"Gevoelig en alert", wat:"Je voelt dingen sterk en merkt snel op wat mis kan gaan. Stress en zorgen kunnen je flink bezighouden.", best:"Je ziet risico's vroeg en voelt goed aan wat er speelt.", let:"Je kunt veel energie kwijt zijn aan piekeren. Praat erover en zorg goed voor rust."},
  mid:{talent:"Wisselend gevoelig", wat:"Soms blijf je kalm en soms raakt iets je meer. Dat hangt af van de situatie.", best:"Je voelt wat er speelt en blijft meestal in balans.", let:"Weet welke situaties jou onrustig maken. Zeg dat tijdig."},
  hoog:{talent:"Kalm blijven", wat:"Je blijft meestal rustig, ook als het druk is of tegenzit. Je laat je niet snel uit het veld slaan.", best:"Je geeft rust aan anderen in spannende tijden.", let:"Je ziet soms niet dat anderen zich wél zorgen maken. Vraag het hen."}},
 O:{naam:"Nieuwsgierigheid", kort:"Nieuwsgierig", big5:"Openheid", links:"Praktisch en beproefd", rechts:"Nieuwe ideeën",
  vragen:["Wanneer kies je liever voor iets bekends, en wanneer probeer je iets nieuws?","Welk idee wil jij nog een keer uitproberen?","Wat werkt al goed en moeten we vooral zo houden?"],
  laag:{talent:"Praktisch en beproefd", wat:"Je kiest voor wat werkt. Je houdt van duidelijke, praktische oplossingen en bewezen manieren.", best:"Je houdt het praktisch en haalbaar.", let:"Nieuwe ideeën kunnen je eerst tegenstaan. Probeer iets nieuws een keer uit."},
  mid:{talent:"Praktisch met oog voor nieuw", wat:"Je staat open voor nieuwe ideeën, maar kijkt ook of het werkt. Je houdt van een mix.", best:"Je kunt vernieuwing en praktijk met elkaar verbinden.", let:"Anderen zien niet altijd of je een idee wilt of niet. Zeg waar je voor bent."},
  hoog:{talent:"Nieuwe ideeën bedenken", wat:"Je bent nieuwsgierig en houdt van nieuwe ideeën. Je denkt graag na over hoe het anders kan.", best:"Je brengt vernieuwing en ziet verbanden.", let:"Je kunt je snel vervelen bij vaste routine. Maak dingen ook af."}}
};
var VOLGORDE = ["E","A","C","S","O"];

var MELDINGEN = {
  x:"Je koos bijna steeds hetzelfde antwoord. Dan zegt de uitslag weinig. Overweeg de test nog eens rustig te doen.",
  j:"Je antwoordde vaak aan dezelfde kant, ook bij stellingen die elkaars tegendeel zijn. Lees je uitslag daarom met een korreltje zout.",
  w:"Je scoort op alles aan de 'fijne' kant. Dat komt bijna niemand voor. Het kan zijn dat je het mooier hebt neergezet dan je meestal bent. Dat is menselijk. Vraag een collega hoe die jou ziet."
};

function rond(x){return Math.round(x*10)/10;}
function nl(x){return String(rond(x)).replace(".",",");}
function niveau(s){return s<2.6?"laag":(s>3.4?"hoog":"mid");}
function niveauTekst(n){return n==="laag"?"Lager":(n==="hoog"?"Hoger":"Midden");}

// antw: lijst van 30 antwoorden (1-5) in de volgorde van ITEMS
function bereken(antw){
  var som={E:0,A:0,C:0,N:0,O:0}, tel={E:0,A:0,C:0,N:0,O:0};
  ITEMS.forEach(function(it,i){som[it.d]+=(it.k===1?antw[i]:6-antw[i]); tel[it.d]++;});
  return {E:som.E/tel.E, A:som.A/tel.A, C:som.C/tel.C, S:6-som.N/tel.N, O:som.O/tel.O};
}
// geeft een tekenreeks met codes: x, j en/of w
function controles(antw, sc){
  var c="", telling={}, max=0;
  antw.forEach(function(w){telling[w]=(telling[w]||0)+1; if(telling[w]>max)max=telling[w];});
  var gem=antw.reduce(function(a,b){return a+b;},0)/antw.length;
  if(max>=24){c+="x";} else if(gem>=4.0||gem<=2.0){c+="j";}
  if(VOLGORDE.every(function(d){return sc[d]>=4.3;})){c+="w";}
  return c;
}
function codeNaarLink(sc,codes){
  return "r="+VOLGORDE.map(function(d){return d+rond(sc[d]).toFixed(1);}).join("-")+(codes?"&f="+codes:"");
}
// leest "#r=E3.8-A4.2-C2.5-S3.0-O4.5&f=xw"; geeft {sc, codes} of null
function leesHash(h){
  var m=/^#r=([EACSO][1-5](?:\.\d)?(?:-[EACSO][1-5](?:\.\d)?){4})(?:&f=([xjw]{0,3}))?$/.exec(h||"");
  if(!m)return null;
  var sc={};
  m[1].split("-").forEach(function(p){sc[p.charAt(0)]=parseFloat(p.slice(1));});
  for(var i=0;i<VOLGORDE.length;i++){var v=sc[VOLGORDE[i]]; if(!(v>=1&&v<=5))return null;}
  return {sc:sc, codes:m[2]||""};
}

window.TALENT={ITEMS:ITEMS,SCHAAL:SCHAAL,DOMEINEN:DOMEINEN,VOLGORDE:VOLGORDE,MELDINGEN:MELDINGEN,
  rond:rond,nl:nl,niveau:niveau,niveauTekst:niveauTekst,bereken:bereken,controles:controles,codeNaarLink:codeNaarLink,leesHash:leesHash};
})();
