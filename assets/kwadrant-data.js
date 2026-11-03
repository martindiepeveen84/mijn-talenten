/* Kernkwadranten: kwaliteiten met suggesties. Eigen lijst, eigen teksten.
   Per kwaliteit: naam, uitleg, valkuil (te veel van de kwaliteit), uitdaging (positieve tegenpool),
   allergie (gedrag van anderen: te veel van de uitdaging). Alles is suggestie; gebruikers kiezen of schrijven zelf. */
(function(){
"use strict";

var G=[
 {naam:"Samenwerken", tekst:"Hoe ga je om met anderen in een team?", k:[
  ["Behulpzaam","Je helpt anderen graag.",["Je zegt te snel ja","Je vergeet jezelf"],["Nee zeggen","Ook voor jezelf zorgen"],["Iemand die alleen aan zichzelf denkt","Iemand die hulp weigert"]],
  ["Meelevend","Je voelt mee met anderen.",["Je neemt de problemen van anderen over","Je wordt er zelf moe van"],["Wat afstand houden","Rustig blijven bij verdriet"],["Iemand die kil reageert","Iemand die zegt: stel je niet aan"]],
  ["Loyaal","Je staat achter je team.",["Je ziet fouten van anderen niet","Je blijft te lang trouw aan iets dat niet werkt"],["Kritisch durven zijn","Eerlijk zeggen dat het niet goed gaat"],["Iemand die achter je rug om klaagt","Iemand die snel van mening verandert"]],
  ["Open","Je zegt wat je denkt en voelt.",["Je zegt te veel","Je vertelt dingen die een ander niet wil horen"],["Voorzichtig zijn met woorden","Eerst luisteren"],["Iemand die niets loslaat","Iemand die alles voor zich houdt"]],
  ["Diplomatiek","Je zoekt een goede toon.",["Je zegt niet wat je echt vindt","Je draait om de zaak heen"],["Direct zijn","Een lastige boodschap geven"],["Iemand die bot is","Iemand die zonder omwegen kritiek geeft"]]
 ]},
 {naam:"Leiding nemen", tekst:"Hoe pak je de leiding en neem je besluiten?", k:[
  ["Daadkrachtig","Je pakt dingen snel aan.",["Je gaat te snel en overvalt anderen","Je luistert te weinig"],["Geduld hebben","Anderen laten meedenken"],["Iemand die blijft aarzelen","Iemand die eindeloos wil overleggen"]],
  ["Overtuigend","Je kunt anderen enthousiast maken.",["Je duwt je mening door","Je overstemt anderen"],["Echt luisteren","Twijfel toelaten"],["Iemand die alles aanneemt","Iemand die nergens iets van vindt"]],
  ["Verantwoordelijk","Je neemt je taak serieus.",["Je neemt te veel op je schouders","Je kunt niet loslaten"],["Taken uit handen geven","Vertrouwen op anderen"],["Iemand die dingen laat liggen","Iemand die de verantwoordelijkheid ontloopt"]],
  ["Besluitvaardig","Je kiest en gaat door.",["Je beslist voordat alle feiten er zijn","Je wordt drammerig"],["Geduld hebben","Eerst alle kanten bekijken"],["Iemand die niet kan kiezen","Iemand die steeds opnieuw over een keuze begint"]],
  ["Vooruitkijkend","Je ziet waar het naartoe kan.",["Je verliest de details uit het oog","Je plannen zijn te groot"],["Praktisch zijn","Stap voor stap werken"],["Iemand die alleen kleine problemen ziet","Iemand die zegt: dat kan niet"]]
 ]},
 {naam:"Doorzetten", tekst:"Hoe houd je vol en kom je vooruit?", k:[
  ["Zelfstandig","Je werkt op eigen kracht.",["Je vraagt te weinig hulp","Je trekt alles naar je toe"],["Samenwerken","Hulp vragen"],["Iemand die steeds om hulp vraagt","Iemand die alles wil overleggen"]],
  ["Volhardend","Je houdt vol tot het af is.",["Je gaat door, ook als het niet meer werkt","Je bent koppig"],["Loslaten","Bijsturen"],["Iemand die snel opgeeft","Iemand die steeds iets nieuws begint"]],
  ["Ambitieus","Je wilt vooruit.",["Je wilt te veel tegelijk","Je kijkt niet naar wat je al hebt"],["Tevreden zijn","Rust nemen"],["Iemand die niets wil bereiken","Iemand die tevreden is met het minste"]],
  ["Gedreven","Je hebt veel energie voor wat je belangrijk vindt.",["Je vergeet te rusten","Je verwacht dat anderen even gedreven zijn"],["Ontspannen","Grenzen aan je werk stellen"],["Iemand die zich nergens druk om maakt","Iemand die stopt zodra het werk om vijf uur klaar is"]],
  ["Flexibel","Je past je makkelijk aan.",["Je gaat overal in mee","Je weet niet meer wat je zelf wilt"],["Een standpunt innemen","Je aan afspraken houden"],["Iemand die star vasthoudt aan zijn plan","Iemand die niet wil bewegen"]]
 ]},
 {naam:"Zorgvuldig en betrouwbaar", tekst:"Hoe zorg je voor kwaliteit en overzicht?", k:[
  ["Nauwkeurig","Je let op details.",["Je blijft te lang aan details werken","Je kunt moeilijk loslaten"],["Goed genoeg vinden","Sneller beslissen"],["Iemand die slordig werkt","Iemand die details overslaat"]],
  ["Georganiseerd","Je zorgt voor orde en overzicht.",["Je bent te strak","Je wilt alles vastleggen"],["Improviseren","Ruimte laten"],["Iemand die chaotisch werkt","Iemand die zonder plan begint"]],
  ["Betrouwbaar","Je doet wat je zegt.",["Je zegt te snel ja","Je durft niet te zeggen dat iets niet lukt"],["Nee zeggen","Hulp vragen"],["Iemand die geen toezeggingen wil doen","Iemand die altijd nee zegt"]],
  ["Realistisch","Je ziet wat er echt kan.",["Je bent te voorzichtig","Je laat kansen liggen"],["Durven dromen","Iets nieuws proberen"],["Iemand die in luchtkastelen leeft","Iemand die begint zonder na te denken"]],
  ["Kalm","Je blijft rustig als het druk is.",["Je lijkt niet betrokken","Je laat weinig zien wat je voelt"],["Laten merken wat je voelt","Enthousiast zijn"],["Iemand die snel opgewonden raakt","Iemand die zijn gevoel overal laat zien"]]
 ]},
 {naam:"Creatief en ondernemend", tekst:"Hoe bedenk je nieuwe dingen en pak je kansen?", k:[
  ["Creatief","Je bedenkt nieuwe dingen.",["Je maakt dingen niet af","Je verandert steeds van idee"],["Afmaken","Kiezen"],["Iemand die elk idee meteen vastlegt","Iemand die alleen vaste stappen volgt"]],
  ["Nieuwsgierig","Je wilt weten hoe dingen werken.",["Je raakt afgeleid","Je stelt te veel vragen"],["Je concentreren","Bij één onderwerp blijven"],["Iemand die nergens naar vraagt","Iemand die alleen over zijn eigen onderwerp praat"]],
  ["Enthousiast","Je steekt anderen aan met je energie.",["Je overstemt de zorgen van anderen","Je belooft te veel"],["Nuchter blijven","Eerst nadenken"],["Iemand die alles negatief ziet","Iemand die nooit blij lijkt"]],
  ["Ondernemend","Je grijpt kansen.",["Je begint zonder plan","Je neemt risico's zonder dat je het merkt"],["Voorzichtig zijn","Plannen maken"],["Iemand die eindeloos wil afwegen","Iemand die bang is voor elk risico"]],
  ["Speels","Je brengt humor en lichtheid.",["Je neemt dingen niet serieus genoeg","Je grapjes komen verkeerd over"],["Serieus zijn","Aandacht voor het onderwerp"],["Iemand die alles zwaar opneemt","Iemand die nooit lacht"]]
 ]},
 {naam:"Denken en oordelen", tekst:"Hoe kijk je naar feiten en meningen?", k:[
  ["Analytisch","Je zoekt uit hoe het zit.",["Je denkt te lang na","Je mist het gevoel in de groep"],["Op je gevoel afgaan","Sneller beslissen"],["Iemand die alleen op gevoel beslist","Iemand die iets vindt zonder feiten"]],
  ["Kritisch","Je stelt vragen bij dingen.",["Je ziet alleen wat niet goed is","Je maakt anderen onzeker"],["Waardering geven","Het goede zien"],["Iemand die alles geweldig vindt","Iemand die nooit kritisch is"]],
  ["Leergierig","Je wilt steeds meer leren.",["Je blijft leren in plaats van doen","Je voelt je nooit klaar"],["Aan de slag gaan","Toepassen wat je weet"],["Iemand die niet wil leren","Iemand die zonder voorbereiding begint"]],
  ["Eerlijk","Je zegt hoe het is.",["Je bent te direct","Je kwetst anderen"],["Tact","Eerst vragen of de ander het wil horen"],["Iemand die om de waarheid heen draait","Iemand die zegt wat je wilt horen"]],
  ["Objectief","Je kijkt naar de feiten.",["Je lijkt koud","Je negeert gevoelens"],["Meevoelen","Persoonlijk contact maken"],["Iemand die alles persoonlijk neemt","Iemand die vooral op gevoel afgaat"]]
 ]},
 {naam:"Contact maken", tekst:"Hoe ga je om met mensen en aandacht?", k:[
  ["Sociaal","Je vindt het fijn om met mensen te zijn.",["Je praat veel","Je vindt alleen werken moeilijk"],["Alleen kunnen zijn","Je concentreren"],["Iemand die zich afsluit","Iemand die liever alleen werkt"]],
  ["Rustig","Je geeft anderen ruimte.",["Je houdt je op de achtergrond","Je laat je mening niet horen"],["Je laten zien","Het woord nemen"],["Iemand die de aandacht naar zich toe trekt","Iemand die veel en luid praat"]],
  ["Goed luisteren","Je luistert echt naar anderen.",["Je vertelt zelf te weinig","Je neemt geen standpunt in"],["Je mening geven","Zelf het woord nemen"],["Iemand die alleen zelf aan het woord is","Iemand die elke mening meteen inbrengt"]],
  ["Warm","Je maakt mensen op hun gemak.",["Je bent te zacht","Je vermijdt lastige gesprekken"],["Duidelijk zijn","Grenzen aangeven"],["Iemand die hard en afstandelijk is","Iemand die bot zijn mening geeft"]],
  ["Zelfverzekerd","Je durft voor jezelf op te komen.",["Je komt arrogant over","Je vraagt weinig om feedback"],["Twijfel toelaten","Bescheiden zijn"],["Iemand die steeds aan zichzelf twijfelt","Iemand die zich klein maakt"]]
 ]},
 {naam:"Rust en balans", tekst:"Hoe houd je overzicht en rust?", k:[
  ["Geduldig","Je geeft dingen de tijd.",["Je wacht te lang","Je grijpt niet in"],["Doorpakken","Een deadline stellen"],["Iemand die alles snel wil","Iemand die altijd haast heeft"]],
  ["Bescheiden","Je hoeft niet in de schijnwerpers.",["Je laat niet zien wat je kunt","Anderen nemen de eer"],["Trots durven zijn","Laten zien wat je kunt"],["Iemand die opschept","Iemand die zichzelf steeds op de voorgrond zet"]],
  ["Evenwichtig","Je blijft in balans.",["Je kiest geen kant","Je komt vlak over"],["Een kant kiezen","Je passie laten zien"],["Iemand die vol in de emotie zit","Iemand die zich heel fel opstelt"]],
  ["Positief","Je ziet de goede kant.",["Je ziet problemen over het hoofd","Je neemt zorgen niet serieus"],["Zorgen serieus nemen","Het ongemakkelijke bekijken"],["Iemand die alleen problemen ziet","Iemand die altijd zeurt"]],
  ["Bedachtzaam","Je denkt na voor je iets doet.",["Je beslist laat","Je blijft twijfelen"],["Op je gevoel vertrouwen","Sneller kiezen"],["Iemand die zonder nadenken handelt","Iemand die te snel beslist"]]
 ]}
];

// Platte lijst met een vaste id (positie)
var LIJST=[], i=0;
G.forEach(function(g,gi){
  g.k.forEach(function(k){
    LIJST.push({id:i++,groep:gi,naam:k[0],uitleg:k[1],valkuil:k[2],uitdaging:k[3],allergie:k[4]});
  });
});

var VAKKEN={
  valkuil:{titel:"Valkuil",vraag:"Wat gebeurt er als je hier te veel van doet?",cap:"Als je er te veel van hebt",hulp:"Denk aan een moment waarop je dit teveel deed. Wat deed je dan?"},
  uitdaging:{titel:"Uitdaging",vraag:"Welke eigenschap helpt je om in balans te blijven?",cap:"Wat je kunt leren",hulp:"Dit is bijna het tegenovergestelde van je kwaliteit, maar dan in een positieve vorm."},
  allergie:{titel:"Allergie",vraag:"Wat doet iemand waar jij je aan irriteert?",cap:"Gedrag van anderen dat je irriteert",hulp:"Beschrijf gedrag, geen persoon. Noem geen namen. Dit is wat je ziet als iemand te ver doorslaat in jouw uitdaging."}
};

var GESPREKSVRAGEN=[
  "Waar kunnen collega's op mij rekenen?",
  "Wanneer slaat mijn kwaliteit door naar mijn valkuil? Hoe merk ik dat zelf?",
  "Wat kunnen collega's tegen me zeggen als ze merken dat ik doorsla?",
  "Welke collega heeft juist mijn uitdaging als kwaliteit? Wat kan ik van die persoon leren?",
  "Waar irriteer ik me aan? En welke kwaliteit zit daar misschien achter bij de ander?"
];

window.KWADRANT={GROEPEN:G,LIJST:LIJST,VAKKEN:VAKKEN,GESPREKSVRAGEN:GESPREKSVRAGEN};
})();
