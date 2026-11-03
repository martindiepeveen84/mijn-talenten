/* Teamgesprek: de stappen van de drie gesprekken. Alleen tekst, geen opslag, geen verbinding.
   Elke stap (slide) heeft een type (t), een kop en eventueel een timer (min).
   stap/stapNaam: het nummer en de naam van de stap in het gesprek. tip: alleen voor de gespreksleider. */
(function(){
"use strict";

var REGELS=[
  "Delen is vrijwillig. Niemand moet zijn uitslag laten zien.",
  "Geen oordeel. Er is geen beste uitslag.",
  "Een uitslag is je eigen kijk. Een collega ziet je misschien anders.",
  "We praten over gedrag, niet over mensen.",
  "Geen namen van collega's noemen.",
  "Wat hier gezegd wordt, blijft hier."
];

function titel(kop,sub,duur,tip){return {t:"titel",kop:kop,sub:sub,duur:duur,tip:tip||"Wacht tot iedereen zit. Klik op Volgende of druk op de pijl naar rechts om te beginnen."};}
function einde(){return {t:"einde",kop:"Bedankt!",tip:"Bedank iedereen. Plan nu meteen een korte check-in, bijvoorbeeld over vier weken."};}
function spelregels(min){return {t:"spelregels",stap:1,stapNaam:"Welkom en spelregels",min:min,kop:"Spelregels",regels:REGELS,vraag:"Is iedereen akkoord?",
  tip:"Lees de regels hardop voor. Vraag echt om een ja van iedereen. Zeg dat niemand iets hoeft te delen en dat je zelf ook kunt passen."};}
function afspraken(nr,min,voorbeelden,intro){return {t:"afspraken",stap:nr,stapNaam:"Afspraken",min:min,kop:"Afspraken",intro:intro,voorbeelden:voorbeelden,
  tip:"Houd het klein: één of twee afspraken die morgen kunnen beginnen. Typ ze hier in, dan staan ze op het scherm. Download ze voor je afsluit."};}
function allergieUitleg(nr,naam,min){return {t:"uitleg",stap:nr,stapNaam:naam,min:min,kop:"Mijn allergie, jouw kwaliteit",
  punten:["Wat jou irriteert, is vaak een kwaliteit van de ander.","Voorbeeld: iemand die snel kiest, ergert zich aan iemand die twijfelt.","Maar twijfelen kan ook zorgvuldig zijn."],
  tip:"Laat dit even bezinken. Het is de kern van het kwadrant: de allergie laat zien wat de ander goed kan."};}
function allergieTweetal(nr,naam,min){return {t:"tweetal",stap:nr,stapNaam:naam,kop:"In tweetallen",
  intro:"Zoek een collega. Kies één van je kwadranten. Praat over de allergie. Noem geen namen.",
  fases:[
   {wie:"Persoon A vertelt",min:3,tekst:"Vertel over je kwadrant, vooral over je allergie. Wat doet iemand dat jou irriteert?"},
   {wie:"Persoon B zoekt de kwaliteit",min:3,tekst:"Welke kwaliteit zit hierachter? Wat kan de ander hier goed in?"},
   {wie:"Persoon B vertelt",min:3,tekst:"Nu andersom. Vertel over je kwadrant en je allergie."},
   {wie:"Persoon A zoekt de kwaliteit",min:3,tekst:"Welke kwaliteit zit hierachter? Wat kan de ander hier goed in?"},
   {wie:"Samen",min:1,tekst:"Wat nemen jullie mee uit dit gesprek?"}],
  tip:"Loop even rond. Hoor je een naam of een verwijt? Zeg zacht: wat doet iemand dan precies? Gebruik de knop Volgende fase als een tweetal klaar is."};}
function talentenTweetal(nr,naam,min){return {t:"tweetal",stap:nr,stapNaam:naam,kop:"In tweetallen",kenmerkKiezer:true,
  intro:"Zoek een collega. Kies samen één kenmerk. Deel alleen wat je wilt.",
  fases:[
   {wie:"Persoon A vertelt",min:4,tekst:"Wat herken je bij dit kenmerk? Persoon B luistert en stelt vragen."},
   {wie:"Persoon B vertelt",min:4,tekst:"Nu andersom. Wat herken jij bij dit kenmerk?"},
   {wie:"Samen",min:2,tekst:"Wat valt jullie op? Wat vullen jullie bij elkaar aan?"}],
  tip:"Laat het team zelf een kenmerk kiezen, of druk op Kies voor ons. De vragen verschijnen op het scherm."};}
function rondje(nr,naam,min,kop,zinnen){return {t:"rondje",stap:nr,stapNaam:naam,min:min,kop:kop,
  intro:"Iedereen vertelt één ding. Eén persoon tegelijk. Begin met de zin op het scherm.",zinnen:zinnen,
  regels:["De anderen luisteren. Niet reageren.","Zeg na elke persoon alleen: bedankt.","Passen mag."],
  tip:"Begin zelf. Houd het kort. Reken ongeveer een minuut per persoon. Het scherm toont de tijd."};}
function vragenSlide(nr,naam,min,kop,vragen,tip){return {t:"vragen",stap:nr,stapNaam:naam,min:min,kop:kop,intro:"Praat samen. Kies een vraag.",vragen:vragen,tip:tip||"Laat het gesprek vrij lopen. Vraag door met: kun je een voorbeeld geven? Gebruik Andere vraag als het stilvalt."};}

var TALENTEN=[
  titel("Talentengesprek","Hoe werken wij graag, en hoe vullen we elkaar aan?",45),
  {t:"uitleg",stap:1,stapNaam:"Welkom en spelregels",min:2,kop:"Waarom zijn we hier?",
   punten:["We willen elkaars manier van werken beter begrijpen.","We gebruiken onze talentenprofielen als start van het gesprek.","Het gaat niet om goed of fout. Het gaat om verschillen."],
   tip:"Zeg in je eigen woorden waarom dit gesprek voor jou belangrijk is. Dat maakt het echter."},
  spelregels(3),
  {t:"stap",stap:2,stapNaam:"Eerst alleen",min:5,kop:"Eerst alleen",
   instructie:"Open je eigen uitslag. Lees hem rustig door. Schrijf van elk iets op.",punten:["Wat herken ik?","Wat verrast me?","Wat klopt niet?"],
   tip:"Het is stil in de ruimte. Je hoeft straks niets te delen van wat je opschrijft. Wie geen uitslag bij zich heeft, kan de test nu doen."},
  talentenTweetal(3,"In tweetallen",10),
  rondje(4,"Met het hele team",10,"Rondje: één ding",["Hier ben ik goed in: …","Hier heb ik jullie voor nodig: …"]),
  vragenSlide(4,"Met het hele team",5,"Samen verder",["Hoe kunnen we elkaars verschillen gebruiken?","Wat kunnen we van elkaar leren?","Wat gaat al goed in ons team, juist door onze verschillen?"]),
  afspraken(5,10,["Wie graag rustig nadenkt, krijgt de vergaderstukken van tevoren.","We beginnen elke vergadering met een korte ronde: hoe gaat het?","Wie een besluit wil, zegt dat. Wie meer tijd wil, zegt dat ook."],"Kies één of twee afspraken voor de komende weken."),
  einde()
];

var KWADRANTEN=[
  titel("Kwadrantengesprek","Wat zijn onze kwaliteiten, valkuilen en allergieën?",45),
  {t:"uitleg",stap:1,stapNaam:"Welkom en spelregels",min:3,kop:"Wat is een kernkwadrant?",kwVoorbeeld:true,
   punten:["Elke kwaliteit heeft een keerzijde.","Te veel van je kwaliteit is je valkuil.","Je allergie is gedrag van anderen dat je irriteert."],
   tip:"Leg het voorbeeld uit: besluitvaardig kan drammerig worden. Wat je kunt leren is geduld. En iemand die niet kan kiezen irriteert je."},
  spelregels(2),
  {t:"stap",stap:2,stapNaam:"Eerst alleen",min:5,kop:"Eerst alleen",
   instructie:"Kies één van je drie kwadranten. Denk aan een moment waarop je je valkuil liet zien.",punten:["Wanneer zag ik mijn valkuil de laatste keer?","Wat gebeurde er? Wat deed ik?","Wat deed een ander?"],
   tip:"Wie zijn kwadranten niet bij zich heeft, kan ze op de telefoon maken. Dat kost ongeveer tien minuten, dus liever vooraf laten doen."},
  allergieUitleg(3,"Mijn allergie, jouw kwaliteit",2),
  allergieTweetal(3,"Mijn allergie, jouw kwaliteit",13),
  rondje(4,"Met het hele team",6,"Rondje: kwaliteit en valkuil",["Mijn kwaliteit is: …","Mijn valkuil is: …"]),
  vragenSlide(4,"Met het hele team",4,"Samen verder",["Hoe merken we dat je doorslaat?","Wat kunnen wij doen om je te helpen?","Welke kwaliteit van een ander helpt jou bij je uitdaging?"]),
  afspraken(5,10,["Als ik doorsla, mag je tegen mij zeggen: ‘Even pauze.’","Dit kun je aan mij vragen als het misgaat: ‘Wat heb je nodig?’","Ik vraag een collega met mijn uitdaging als kwaliteit om mee te denken."],"Elke persoon kiest één afspraak. Bijvoorbeeld: als ik doorsla, mag je dit tegen mij zeggen."),
  einde()
];

var COMBI=[
  titel("Gecombineerd gesprek","Talenten en kernkwadranten naast elkaar",75),
  {t:"uitleg",stap:1,stapNaam:"Welkom en spelregels",min:2,kop:"Waarom zijn we hier?",
   punten:["We leggen onze talenten naast onze kwadranten.","Past een valkuil bij een kenmerk uit je profiel?","Het gaat om verschillen en om elkaar aanvullen."],
   tip:"Vertel dat dit een langer gesprek is en dat er twee tweetalrondes zijn. Plan een korte pauze als de groep het nodig heeft."},
  spelregels(3),
  {t:"stap",stap:2,stapNaam:"Eerst alleen",min:10,kop:"Eerst alleen",
   instructie:"Leg je talentenprofiel en je kwadranten naast elkaar. Schrijf op wat je ziet.",punten:["Wat past bij elkaar?","Welk kenmerk uit mijn profiel hoort bij een valkuil?","Wat verrast me?"],
   voorbeeld:"Voorbeeld: je scoort hoog op ‘Plannen en afmaken’ en je valkuil is ‘te strak’.",
   tip:"Geef de tijd. Dit is het moment waarop mensen de twee naast elkaar leggen. Het mag stil zijn."},
  talentenTweetal(3,"In tweetallen: talenten",10),
  allergieUitleg(4,"In tweetallen: mijn allergie, jouw kwaliteit",2),
  allergieTweetal(4,"In tweetallen: mijn allergie, jouw kwaliteit",13),
  rondje(5,"Met het hele team",10,"Rondje: talent en valkuil",["Mijn talent is: …","Mijn valkuil is: …"]),
  vragenSlide(5,"Met het hele team",10,"Samen verder",["Hoe vullen we elkaar aan?","Hoe merken we dat iemand doorslaat?","Wat kunnen we van elkaar leren?"]),
  afspraken(6,15,["Wie graag rustig nadenkt, krijgt de vergaderstukken van tevoren.","Als ik doorsla, mag je tegen mij zeggen: ‘Even pauze.’","We beginnen elke vergadering met een korte ronde: hoe gaat het?"],"Schrijf een paar afspraken op voor de komende weken. Bijvoorbeeld voor vergaderingen, feedback en verdeling van taken."),
  einde()
];

window.GESPREK={
  volgorde:["talenten","kwadranten","combi"],
  gesprekken:{
   talenten:{naam:"Talentengesprek",min:45,voor:"Teams die de talententest deden.",doel:"Hoe werken wij graag, en hoe vullen we elkaar aan?",
     nodig:["Iedereen heeft zijn eigen talentenprofiel bij zich, op de telefoon of uitgeprint. Laat het team de test van tevoren doen.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","45 minuten zonder onderbrekingen."],slides:TALENTEN},
   kwadranten:{naam:"Kwadrantengesprek",min:45,voor:"Teams die kernkwadranten maakten.",doel:"Wat zijn onze kwaliteiten, valkuilen en allergieën?",
     nodig:["Iedereen heeft zijn drie kernkwadranten bij zich, op de telefoon of uitgeprint. Laat het team ze van tevoren maken.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","45 minuten zonder onderbrekingen."],slides:KWADRANTEN},
   combi:{naam:"Gecombineerd gesprek",min:75,voor:"Teams die allebei deden.",doel:"Talenten en kernkwadranten naast elkaar.",
     nodig:["Iedereen heeft zijn talentenprofiel én zijn drie kernkwadranten bij zich. Laat het team beide van tevoren doen.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","75 minuten, eventueel met een korte pauze."],slides:COMBI}
  }
};
})();
