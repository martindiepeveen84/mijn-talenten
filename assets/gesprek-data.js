/* Teamgesprek: de stappen van de drie gesprekken. Alleen tekst, geen opslag, geen verbinding.
   Elke stap (slide) heeft een type (t), een kop en eventueel een timer (min).
   stap/stapNaam: nummer en naam van de stap in het gesprek. tip + vragen: alleen voor de gespreksleider.
   Elke stap beantwoordt vooraf de vragen van deelnemers: wat doen we, waarom, wat is mijn rol,
   wat als het niet lukt, en wat komt hierna. */
(function(){
"use strict";

var T=window.TALENT;
var REGELS=[
  "Iedereen draagt bij, op zijn eigen manier. Je mag passen op delen.",
  "Geen oordeel. Er is geen beste uitslag.",
  "Een uitslag is je eigen kijk. Een collega ziet je misschien anders.",
  "We praten over gedrag, niet over mensen. Geen namen.",
  "Wat hier gezegd wordt, blijft hier."
];
var BIJDRAGEN=[
  "Iets over jezelf vertellen",
  "Een vraag stellen aan een collega",
  "Iets noemen wat je waardeert in het team",
  "Zeggen wat je nodig hebt in samenwerking",
  "Goed luisteren en samenvatten"
];

// Korte vragen bij de vijf kenmerken, voor het bord
var KORT={
  E:"Laad je op in een rustige omgeving, of juist op een druk feestje?",
  A:"Zeg je liever eerlijk wat je vindt, of zorg je dat iedereen zich fijn voelt?",
  C:"Maak je graag een plan en rond je alles af, of werk je liever op gevoel?",
  S:"Blijf je rustig als het spannend wordt, of voel je snel wat er mis kan gaan?",
  O:"Kies je liever voor wat al werkt, of probeer je graag iets nieuws?"
};

function titel(kop,sub,duur){return {t:"titel",kop:kop,sub:sub,duur:duur,
  tip:"Wacht tot iedereen zit en het scherm goed te zien is. Klik op Start of druk op de pijl naar rechts om te beginnen."};}
function einde(){return {t:"einde",kop:"Bedankt!",tip:"Bedank iedereen. Plan nu meteen een korte check-in, bijvoorbeeld over vier weken."};}

/* ---- Stap 1: welkom, spelregels en veiligheid ---- */
function agenda(g){return {t:"agenda",stap:1,stapNaam:"Welkom en spelregels",min:2,kop:"Dit gaan we doen",g:g,
  intro:"We willen elkaars manier van werken beter begrijpen. Niet om te beoordelen, maar om beter samen te werken.",
  waarom:"Zo weet iedereen wat er komt en hoe lang het duurt.",
  tip:"Loop de agenda kort langs. Zeg erbij dat er veel in tweetallen gebeurt en dat niemand voor de groep hoeft te presteren.",
  faq:[["Moet ik mijn uitslag laten zien?","Nee. Je laat alleen zien wat je zelf wilt."],["Hoe lang duurt het?","De tijd per stap staat hier en op elk scherm."]]};}
function spelregels(){return {t:"spelregels",stap:1,stapNaam:"Welkom en spelregels",min:3,kop:"Spelregels",regels:REGELS,bijdragen:BIJDRAGEN,vraag:"Is iedereen akkoord?",
  waarom:"Zo weet iedereen waar hij aan toe is.",
  tip:"Lees de regels hardop voor. Vraag echt om een ja van iedereen. Benadruk: meedoen is niet hetzelfde als iets over jezelf vertellen.",
  faq:[["Moet ik iets over mezelf vertellen?","Nee. Een vraag stellen, iets waarderends zeggen of goed luisteren is ook meedoen."],["Wat als ik mijn uitslag niet herken?","Prima. Zeg dat. Dat is ook een bijdrage."]]};}
function veiligheid(){return {t:"afspraken",veld:"veilig",liveRegel:"Typ op je telefoon één afspraak die voor jou helpt. Het is anoniem. De gespreksleider zet de afspraken op de lijst.",live:{soort:"tekst",vraag:"Wat heb je nodig om veilig genoeg mee te doen?",hint:"Schrijf één ding. Het is anoniem. Je mag ook passen.",max:2,neemOver:"veilig"},stap:1,stapNaam:"Welkom en spelregels",min:3,kop:"Wat heb je nodig om veilig genoeg mee te doen?",
  intro:"Denk even na. Noem één afspraak die voor jou helpt. De gespreksleider schrijft ze op.",
  voorbeelden:["We onderbreken elkaar niet.","Je mag altijd passen.","Niemand geeft ongevraagd advies.","We stoppen even als iemand dat nodig heeft.","Geen namen van mensen die er niet bij zijn."],
  waarom:"Wat voor de één veilig voelt, voelt voor de ander misschien niet zo. Samen maken we het veilig genoeg.",
  tip:"Vraag het rond en schrijf mee. Met live meedoen verschijnen voorstellen van de telefoons hieronder: neem ze over met Naar afspraken. Dring niet aan: wie niets noemt, is ook goed. Je kunt de lijst later bekijken met de knop Spelregels (S).",
  faq:[["Wat als niemand iets zegt?","Noem zelf één voorbeeld uit de lijst en vraag of iedereen daar mee kan leven."],["Mag ik het later nog aanvullen?","Ja. Zeg het gerust tijdens het gesprek."]]};}

/* ---- Theorie en eigen uitslag, talenten ---- */
var TH_TALENT=[
  {t:"uitleg",stap:2,stapNaam:"Theorie en je eigen uitslag",min:2,kop:"Het Big Five-model",
   alinea:["Het Big Five-model beschrijft hoe mensen verschillen in hoe ze denken, voelen en doen. Onderzoekers over de hele wereld gebruiken het al tientallen jaren.",
           "Het model kijkt naar vijf lijnen. Op elke lijn zit je ergens tussen twee kanten. Bij de meeste lijnen zit je ergens in het midden.",
           "Geen kant is beter. Wie links zit, heeft andere talenten dan wie rechts zit. Een team heeft beide nodig.",
           "Je uitslag is jouw eigen kijk op jezelf, nu. Collega's zien je soms anders. Dat maakt het gesprek interessant."],
   waarom:"Zo weet iedereen waar de uitslag over gaat voordat we er over praten.",
   tip:"Vertel dit in je eigen woorden. De vijf lijnen komen op het volgende scherm. Zeg dat de test geen oordeel is.",
   faq:[["Is dit wetenschappelijk?","Het Big Five-model is het meest onderzochte model voor persoonlijkheid. De korte test hier is een hulpmiddel voor een gesprek, geen meting."],["Is mijn uitslag een vast etiket?","Nee. Het is een momentopname en jouw eigen kijk."]]},
  {t:"bord",stap:2,stapNaam:"Theorie en je eigen uitslag",min:2,kop:"De vijf lijnen",modus:"uitleg",
   intro:"Dit zijn de vijf kenmerken. Bij elk kenmerk zit je ergens tussen twee kanten.",
   waarom:"Zo kun je straks zeggen waar jij op zit.",
   tip:"Loop de vijf kenmerken kort langs. Laat mensen zien dat beide kanten een talent zijn.",
   faq:[["Wat betekent ‘emotionele stabiliteit’?","Dat is hier ‘omgaan met spanning’. Hoger is kalm blijven, lager is gevoelig en alert."]]},
  {t:"stap",stap:2,stapNaam:"Theorie en je eigen uitslag",min:3,kop:"Jouw uitslag",liveRegel:"Kies daarna op je telefoon welk kenmerk bij jou het meest opvalt.",live:{soort:"keuze",vraag:"Welk kenmerk valt bij jou het meest op?",opties:T.VOLGORDE.map(function(d){return T.DOMEINEN[d].naam;})},
   instructie:"Open je eigen uitslag. Zoek het kenmerk waar je het verst van het midden zit.",
   punten:["Open je uitslag op je telefoon of kijk op papier.","Zoek het kenmerk waar je het hoogst of laagst scoort.","Bedenk één voorbeeld uit je leven waarin je dat merkt. Het mag ook buiten je werk zijn.","Je hoeft dit straks niet te delen."],
   waarom:"Zo heb je zo meteen een voorbeeld om over te praten.",
   tip:"Het is stil in de ruimte. Wie geen uitslag heeft, kan de test nu doen of meekijken met een buur.",
   faq:[["Ik zit overal in het midden, wat nu?","Kies het kenmerk waar je het meest aarzelt. Of kies een kenmerk waarover je graag wilt praten."],["Ik herken mijn uitslag niet.","Dan kun je dat zeggen. Dat is een goed gespreksonderwerp."]]},
  {t:"vragen",stap:2,stapNaam:"Theorie en je eigen uitslag",min:3,kop:"Herken je dit?",liveRegel:"Geef op je telefoon een cijfer van 1 tot 5.",live:{soort:"schaal",vraag:"Herken je jouw uitslag?",labels:["Helemaal niet","Helemaal wel"]},
   intro:"Even in de groep. Eén vraag tegelijk.",
   vragen:["Herken je je uitslag? Steek je duim op, opzij of omlaag.","Wie wil een voorbeeld delen waarin je dat kenmerk merkt? Het mag ook uit je vrije tijd.","Wat verraste je?"],
   hulp:"Wil niemand beginnen? De gespreksleider begint. Passen mag.",
   waarom:"Zo horen we hoe het eruitziet in het echte leven, voordat we in tweetallen gaan.",
   tip:"Peil met duimen. Deel zelf als eerste een kort voorbeeld. Dring niet aan als niemand wil."}
];

/* ---- Theorie en je eigen uitslag, kwadranten ---- */
function thKwadrant(stap,naam){return [
  {t:"kwBouw",stap:stap,stapNaam:naam,min:3,kop:"Wat is een kernkwadrant?",
   fases:[
    {titel:"Kernkwaliteit",tekst:"Wat je goed kunt. Bijvoorbeeld: besluitvaardig. Je kiest en gaat door.",klasse:"kw-kern"},
    {titel:"Valkuil",tekst:"Als je er te veel van doet. Je wordt drammerig en luistert te weinig.",klasse:"kw-valkuil"},
    {titel:"Uitdaging",tekst:"Wat je kunt leren. Het tegenovergestelde, maar dan positief: geduld.",klasse:"kw-uitdaging"},
    {titel:"Allergie",tekst:"Gedrag van een ander dat je irriteert. Iemand die niet kan kiezen. Dat is een te sterke versie van jouw uitdaging.",klasse:"kw-allergie"}],
   waarom:"Zo snappen we waar we het straks over hebben.",
   tip:"Klik het voorbeeld vak voor vak open met de knop op het scherm. Vraag bij elk vak of het te volgen is.",
   faq:[["Is dit een test?","Nee. Het is een model uit de coaching om na te denken over jezelf."],["Wat is het verschil tussen valkuil en allergie?","Een valkuil is wat jij doet als je doorschiet. Een allergie is wat een ander doet dat jou irriteert."]]},
  {t:"uitleg",stap:stap,stapNaam:naam,min:2,kop:"Het slimme van de allergie",
   alinea:["Je allergie is gedrag van een ander. Het is vaak een kwaliteit die jij zelf minder hebt.",
           "Voorbeeld: iemand die snel beslist, ergert zich aan mensen die blijven twijfelen. Maar twijfelen kan ook zorgvuldig zijn.",
           "Dus: wat jou irriteert, laat zien wat een ander goed kan. En wat jij zelf nog kunt leren."],
   waarom:"Daarom praten we straks over je allergie, zonder namen.",
   tip:"Laat dit even bezinken. Het is de kern van het kwadrant. Benadruk: het gaat over gedrag, niet over personen.",
   faq:[["Moet ik een collega noemen?","Nee. Noem het gedrag. Geen namen."],["Wat als ik me nergens aan irriteer?","Denk aan een situatie buiten werk, of aan iets dat je soms stoort."]]},
  {t:"stap",stap:stap,stapNaam:naam,min:3,kop:"Jouw kwadrant",
   instructie:"Open je kwadranten. Kies er één waar je iets bij voelt.",
   punten:["Open je kwadranten op je telefoon of kijk op papier.","Kies één kwadrant waar je iets bij voelt.","Bedenk één moment waarop je je valkuil liet zien. Het mag ook buiten je werk zijn.","Je hoeft dit straks niet te delen."],
   waarom:"Zo heb je zo meteen een voorbeeld om over te praten.",
   tip:"Wie zijn kwadranten niet bij zich heeft, kan ze op de telefoon maken. Dat kost ongeveer tien minuten, dus liever vooraf laten doen.",
   faq:[["Mijn kwadrant past niet goed.","Dat kan. Pas het in je hoofd aan of vertel waar het niet klopt."]]},
  {t:"vragen",stap:stap,stapNaam:naam,min:2,kop:"Herken je dit?",liveRegel:"Geef op je telefoon een cijfer van 1 tot 5.",live:{soort:"schaal",vraag:"Herken je dit uit je eigen werk of leven?",labels:["Helemaal niet","Helemaal wel"]},
   intro:"Even in de groep. Eén vraag tegelijk.",
   vragen:["Herken je dit? Steek je duim op, opzij of omlaag.","Wie wil een voorbeeld delen van een valkuil of een allergie? Het mag ook uit je vrije tijd.","Wat verraste je?"],
   hulp:"Wil niemand beginnen? De gespreksleider begint. Passen mag.",
   waarom:"Zo horen we hoe het eruitziet in het echte leven, voordat we in tweetallen gaan.",
   tip:"Peil met duimen. Deel zelf als eerste een kort voorbeeld, bijvoorbeeld een valkuil die je zelf herkent."}
];}

/* ---- Zo werkt een tweegesprek ---- */
function rollenTalent(stap,naam,min){return {t:"uitleg",stap:stap,stapNaam:naam,min:min,kop:"Zo werkt een tweegesprek",
  intro:"Straks praten jullie in tweetallen. Eerst vertelt de een en luistert de ander. Daarna wisselen jullie.",
  kolommen:[
   {kop:"Spreker",klasse:"kw-kern",punten:["Kies een kenmerk waar je iets bij herkent.","Vertel een voorbeeld uit je leven. Werk of privé.","Zeg wat je daarbij voelt of nodig hebt."]},
   {kop:"Luisteraar: luister naar drie dingen",klasse:"kw-uitdaging",punten:["1. Een concreet voorbeeld: wat gebeurde er?","2. Wat geeft de ander energie, of kost het energie?","3. Wat heeft de ander nodig van collega's?","Hoogstens één vraag: ‘Kun je een voorbeeld geven?’","Geen advies. Geen oordeel."]}],
  voorbeeld:"Na het verhaal vat de luisteraar samen: ‘Ik hoorde dat jij … en dat je … nodig hebt. Klopt dat?’",
  waarom:"Als je weet waar je op moet letten, luister je beter. Daarom leg ik dit nu uit, voordat je begint.",
  tip:"Neem de tijd voor dit scherm. Het is de belangrijkste uitleg. Wijs op de drie dingen waar de luisteraar op let en op de samenvatting.",
  faq:[["Mag de luisteraar advies geven?","Nee. Alleen luisteren, hoogstens één vraag en samenvatten."],["Wat als ik niets kan bedenken?","Begin met: ‘Een voorbeeld is …’ Of kies een situatie buiten werk."],["Hoe lang duurt dit?","Vier minuten per persoon, plus een minuut samenvatten."]]};}
function rollenKwadrant(stap,naam,min){return {t:"uitleg",stap:stap,stapNaam:naam,min:min,kop:"Zo werkt een tweegesprek",
  intro:"Straks praten jullie in tweetallen over je allergie. Eerst vertelt de een en luistert de ander. Dan zoeken jullie samen de kwaliteit erachter.",
  kolommen:[
   {kop:"Spreker",klasse:"kw-kern",punten:["Kies één van je kwadranten.","Vertel over je allergie: wat doet iemand precies? Gedrag, geen naam.","Zeg wat het met jou doet."]},
   {kop:"Luisteraar: luister naar drie dingen",klasse:"kw-uitdaging",punten:["1. Het gedrag: wat doet de ander precies?","2. Wat het met de spreker doet: wat voelt of denkt die?","3. Een aanwijzing voor de kwaliteit erachter: wat kan die ander hier goed in?","Noteer woorden die je hoort.","Geen advies. Geen oordeel."]}],
  voorbeeld:"Daarna helpt de luisteraar 2 minuten zoeken: ‘Welke kwaliteit zou hierachter kunnen zitten bij die ander?’",
  waarom:"Als je weet waar je op moet letten, luister je beter. Daarom leg ik dit nu uit, voordat je begint.",
  tip:"Neem de tijd voor dit scherm. Benadruk dat de luisteraar tijdens het verhaal al let op een aanwijzing voor de kwaliteit. Zo kan hij daarna helpen zoeken.",
  faq:[["Moet ik een collega noemen?","Nee. Geen namen. Beschrijf alleen wat iemand doet."],["Wat als ik de kwaliteit niet vind?","Vraag: wat kan die persoon hier goed in? Wat vindt die persoon belangrijk?"]]};}
function voordoen(stap,naam,min,type){
  var talent=type==="talent";
  return {t:"stap",stap:stap,stapNaam:naam,min:min,kop:"Eerst een voorbeeld",
  instructie:"De gespreksleider doet het voor met een vrijwilliger. Drie minuten.",
  kolommen:[
   {kop:"Gespreksleider (spreker)",klasse:"kw-kern",punten:talent?["Kiest een kenmerk.","Vertelt een voorbeeld van ongeveer 2 minuten."]:["Kiest een kwadrant.","Vertelt over een allergie, zonder namen, ongeveer 2 minuten."]},
   {kop:"Vrijwilliger (luisteraar)",klasse:"kw-uitdaging",punten:talent?["Luistert naar de drie dingen.","Vat samen in één zin."]:["Luistert naar gedrag, gevoel en een aanwijzing voor de kwaliteit.","Vat samen en zoekt de kwaliteit."]},
   {kop:"De rest van het team",klasse:"kw-allergie",punten:["Kijk goed naar de luisteraar.","Wat doet die goed? Schrijf er één ding van op."]}],
  voorbeeld:"Daarna, 2 minuten, plenair: Wat deed de luisteraar goed?",
  waarom:"Zien doen helpt meer dan uitleg. Zo weet iedereen hoe een goed gesprek eruitziet.",
  tip:"Vraag vooraf een vrijwilliger die zich veilig voelt. Kies een voorbeeld dat niet te zwaar is. Houd het kort. Na afloop vraag je het team wat de luisteraar goed deed.",
  faq:[["Wat als niemand zich meldt?","Vraag een collega vooraf. Of doe het voor met iemand die het vaak doet."],["Moet ik echt iets persoonlijks delen?","Kies een licht voorbeeld. Het gaat om de werkwijze, niet om de inhoud."]]};}

/* ---- Tweegesprekken ---- */
var HULP_TALENT="Lukt het even niet? Begin met: ‘Een voorbeeld is …’ of ‘Ik merk dat ik …’. Vind je niets? Kies een ander kenmerk, of een situatie buiten werk.";
var HULP_KW="Lukt het even niet? Begin met: ‘Ik irriteer me als iemand …’. Noem het gedrag, niet de persoon. Je mag ook een voorbeeld buiten werk kiezen.";
function fase(wie,min,sprekerKop,spreker,luisterKop,luister,extra){return {wie:wie,min:min,sprekerKop:sprekerKop,spreker:spreker,luisterKop:luisterKop,luister:luister,extra:extra};}
function tweeTalent(stap,naam){return {t:"tweetal",stap:stap,stapNaam:naam,kop:"In tweetallen",
  fases:[
   {wie:"Kies samen een kenmerk",min:1,bord:true,tekst:"Kies samen één kenmerk. Dubbel kiezen mag. Bepaal wie A is en wie B."},
   fase("Ronde 1: A vertelt, B luistert",4,"A vertelt","Vertel een voorbeeld bij jullie kenmerk. Wat gebeurde er? Werk of privé.","B luistert","Luister naar: het voorbeeld, wat energie geeft of kost, en wat A nodig heeft. Hoogstens één vraag. Geen advies."),
   fase("B vat samen",1,"A reageert","Klopt het? Vul aan of corrigeer.","B vat samen","‘Ik hoorde dat jij … en dat je … nodig hebt. Klopt dat?’"),
   fase("Ronde 2: B vertelt, A luistert",4,"B vertelt","Vertel een voorbeeld bij jullie kenmerk. Wat gebeurde er? Werk of privé.","A luistert","Luister naar: het voorbeeld, wat energie geeft of kost, en wat B nodig heeft. Hoogstens één vraag. Geen advies."),
   fase("A vat samen",1,"B reageert","Klopt het? Vul aan of corrigeer.","A vat samen","‘Ik hoorde dat jij … en dat je … nodig hebt. Klopt dat?’"),
   {wie:"Samen",min:3,tekst:"Wat valt jullie op? Hoe vullen jullie elkaar aan? Wat willen jullie straks met het team delen?"}],
  hulp:HULP_TALENT,
  tip:"Loop rond en luister mee op afstand. Hoor je een advies? Zeg zacht: alleen luisteren. Het scherm toont elke fase. Gebruik Volgende fase als de tijd om is, of wacht op de timer.",
  faq:[["Wie is A en wie is B?","Jullie kiezen zelf. A begint met vertellen."],["Wat als we klaar zijn voor de tijd?","Ga door met de volgende fase, of praat vrij verder."],["Wat als ik niets kan bedenken?","Kies een ander kenmerk of een voorbeeld buiten werk."]]};}
function tweeKwadrant(stap,naam){return {t:"tweetal",stap:stap,stapNaam:naam,kop:"In tweetallen",
  fases:[
   {wie:"Kies samen wie begint",min:1,tekst:"Bepaal wie A is en wie B. Kies één van je kwadranten om mee te beginnen."},
   fase("Ronde 1: A vertelt, B luistert",4,"A vertelt","Vertel over je allergie. Wat doet iemand precies? Gedrag, geen naam. Wat doet dat met jou?","B luistert","Luister naar: het gedrag, wat het met A doet, en een aanwijzing voor de kwaliteit erachter. Noteer woorden. Geen advies."),
   fase("B zoekt de kwaliteit",2,"A denkt mee","Wat klopt? Wat niet? Wat vind je zelf?","B helpt zoeken","Vraag: Welke kwaliteit zou hierachter kunnen zitten bij die ander? Wat kan die persoon hier goed in? Wat vindt die persoon belangrijk?"),
   fase("Ronde 2: B vertelt, A luistert",4,"B vertelt","Vertel over je allergie. Wat doet iemand precies? Gedrag, geen naam. Wat doet dat met jou?","A luistert","Luister naar: het gedrag, wat het met B doet, en een aanwijzing voor de kwaliteit erachter. Noteer woorden. Geen advies."),
   fase("A zoekt de kwaliteit",2,"B denkt mee","Wat klopt? Wat niet? Wat vind je zelf?","A helpt zoeken","Vraag: Welke kwaliteit zou hierachter kunnen zitten bij die ander? Wat kan die persoon hier goed in? Wat vindt die persoon belangrijk?"),
   {wie:"Samen",min:1,tekst:"Wat neem je mee? Wat leerde je over je eigen allergie?"}],
  hulp:HULP_KW,
  tip:"Loop rond en luister mee op afstand. Hoor je een naam of een verwijt? Zeg zacht: wat doet iemand precies? Gebruik Volgende fase als de tijd om is, of wacht op de timer.",
  faq:[["Moet ik een collega noemen?","Nee. Geen namen. Beschrijf alleen het gedrag."],["Wat als ik me nergens aan irriteer?","Kies een situatie buiten werk, of iets dat je soms stoort."],["Wie is A?","Jullie kiezen zelf. A begint."]]};}

/* ---- Met het hele team ---- */
function rondje(stap,naam,min,kop,zinnen){return {t:"rondje",stap:stap,stapNaam:naam,min:min,kop:kop,liveRegel:"Typ je zin op je telefoon. Het is anoniem en je mag ook passen. De gespreksleider leest de antwoorden voor.",live:{soort:"tekst",vraag:"Kies een zin en maak hem af",hint:zinnen.join("   ·   ")+"  (Anoniem. De gespreksleider leest voor. Passen mag.)",max:2},
  intro:"Iedereen draagt één ding bij. Eén persoon tegelijk. Kies een zin op het scherm, of kies een andere bijdrage.",zinnen:zinnen,
  menu:["Ik pas.","Ik stel een vraag aan het team.","Ik noem iets wat ik waardeer in ons team."],
  regels:["De anderen luisteren. Niet reageren.","Zeg na elke persoon alleen: bedankt."],
  waarom:"Zo hoort iedereen iets van elkaar, zonder discussie.",
  tip:"Begin zelf. Houd het kort. Reken ongeveer een minuut per persoon. Het scherm toont de tijd. Wie past, past. Dat is ook een bijdrage. Met live meedoen lees je de antwoorden van de telefoons voor.",
  faq:[["Moet ik iets over mezelf zeggen?","Nee. Je mag ook passen, een vraag stellen of iets waarderends zeggen."],["Mag ik reageren op een ander?","Nu nog niet. Zeg alleen bedankt. Reageren kan straks."]]};}
function vragenSlide(stap,naam,min,kop,vragen){return {t:"vragen",stap:stap,stapNaam:naam,min:min,kop:kop,intro:"Praat samen. Kies een vraag.",vragen:vragen,liveRegel:"Kies op je telefoon welke vraag je het eerst wilt bespreken.",live:{soort:"keuze",vraag:"Welke vraag wil je het eerst bespreken?",opties:vragen},
  waarom:"Zo gebruiken we wat we net hoorden.",tip:"Laat het gesprek vrij lopen. Vraag door met: kun je een voorbeeld geven? Gebruik Andere vraag als het stilvalt.",
  hulp:"Stilte mag. Wacht even voordat je een nieuwe vraag kiest."};}
function afspraken(stap,min,voorbeelden,intro){return {t:"afspraken",veld:"team",liveRegel:"Stel op je telefoon een afspraak voor. De gespreksleider zet de afspraken die passen in de lijst.",live:{soort:"tekst",vraag:"Welke afspraak stel jij voor?",hint:"Kort en klein. Het team kiest straks. Anoniem.",max:2,neemOver:"team"},stap:stap,stapNaam:"Afspraken",min:min,kop:"Afspraken",intro:intro,voorbeelden:voorbeelden,
  waarom:"Een gesprek helpt pas als er iets verandert. Kleine afspraken werken het best.",
  tip:"Houd het klein: één of twee afspraken die morgen kunnen beginnen. Typ ze hier in, of neem voorstellen van de telefoons over met Naar afspraken. Download ze voor je afsluit.",
  faq:[["Moet iedereen een eigen afspraak hebben?","Nee. Eén of twee afspraken voor het team is genoeg."],["Wat als we het niet eens zijn?","Kies de afspraak waar iedereen mee kan leven. Kleiner is beter."]]};}
function pauze(stap){return {t:"pauze",stap:stap,stapNaam:"Pauze",min:5,kop:"Pauze",
  tekst:"Pak iets te drinken. Loop even rond. Straks gaan we verder met de kernkwadranten.",
  tip:"Laat de timer lopen. Start precies op tijd weer."};}

/* ---- Samenstellen ---- */
var TALENTEN=[
  titel("Talentengesprek","Hoe werken wij graag, en hoe vullen we elkaar aan?",60),
  agenda("talenten"),spelregels(),veiligheid()
].concat(TH_TALENT,[
  rollenTalent(3,"Zo werkt een tweegesprek",3),
  voordoen(3,"Zo werkt een tweegesprek",5,"talent"),
  tweeTalent(4,"Tweegesprekken"),
  rondje(5,"Met het hele team",6,"Rondje: één bijdrage",["Hier ben ik goed in: …","Hier heb ik jullie voor nodig: …","Dit leerde ik van mijn gesprekspartner: …"]),
  vragenSlide(5,"Met het hele team",6,"Samen verder",["Hoe kunnen we elkaars verschillen gebruiken?","Wat kunnen we van elkaar leren?","Wat gaat al goed in ons team, juist door onze verschillen?"]),
  afspraken(6,8,["Wie graag rustig nadenkt, krijgt de vergaderstukken van tevoren.","We beginnen elke vergadering met een korte ronde: hoe gaat het?","Wie een besluit wil, zegt dat. Wie meer tijd wil, zegt dat ook."],"Kies één of twee afspraken voor de komende weken."),
  einde()
]);

var KWADRANTEN=[
  titel("Kwadrantengesprek","Wat zijn onze kwaliteiten, valkuilen en allergieën?",60),
  agenda("kwadranten"),spelregels(),veiligheid()
].concat(thKwadrant(2,"Theorie en je eigen kwadrant"),[
  rollenKwadrant(3,"Zo werkt een tweegesprek",3),
  voordoen(3,"Zo werkt een tweegesprek",5,"kwadrant"),
  tweeKwadrant(4,"Tweegesprekken"),
  rondje(5,"Met het hele team",6,"Rondje: één bijdrage",["Mijn kwaliteit is: …","Mijn valkuil is: …","Dit leerde ik over mijn allergie: …"]),
  vragenSlide(5,"Met het hele team",6,"Samen verder",["Hoe merken we dat je doorslaat?","Wat kunnen wij doen om je te helpen?","Welke kwaliteit van een ander helpt jou bij je uitdaging?"]),
  afspraken(6,8,["Als ik doorsla, mag je tegen mij zeggen: ‘Even pauze.’","Dit kun je aan mij vragen als het misgaat: ‘Wat heb je nodig?’","Ik vraag een collega met mijn uitdaging als kwaliteit om mee te denken."],"Elke persoon kiest één afspraak. Bijvoorbeeld: als ik doorsla, mag je dit tegen mij zeggen."),
  einde()
]);

var COMBI=[
  titel("Gecombineerd gesprek","Talenten en kernkwadranten naast elkaar",90),
  agenda("combi"),spelregels(),veiligheid()
].concat(TH_TALENT,[
  rollenTalent(3,"Zo werkt een tweegesprek",3),
  voordoen(3,"Zo werkt een tweegesprek",5,"talent"),
  tweeTalent(4,"Tweegesprek: talenten"),
  pauze(5)
],thKwadrant(6,"Theorie en je eigen kwadrant"),[
  rollenKwadrant(7,"Tweegesprek: allergie",2),
  tweeKwadrant(7,"Tweegesprek: allergie"),
  rondje(8,"Met het hele team",5,"Rondje: één bijdrage",["Mijn talent is: …","Mijn valkuil is: …","Dit leerde ik van mijn gesprekspartner: …"]),
  vragenSlide(8,"Met het hele team",5,"Samen verder",["Hoe vullen we elkaar aan?","Hoe merken we dat iemand doorslaat?","Wat kunnen we van elkaar leren?"]),
  afspraken(9,9,["Wie graag rustig nadenkt, krijgt de vergaderstukken van tevoren.","Als ik doorsla, mag je tegen mij zeggen: ‘Even pauze.’","We beginnen elke vergadering met een korte ronde: hoe gaat het?"],"Schrijf een paar afspraken op voor de komende weken. Bijvoorbeeld voor vergaderingen, feedback en verdeling van taken."),
  einde()
]);

var KOPPEL={t:"koppelen",kop:"Koppel je telefoon",
  intro:"Doe dit nu, dan hoeft het straks niet meer tijdens het gesprek.",
  waarom:"Zo weten we dat iedereen kan meedoen voordat we beginnen.",
  stappen:["Scan de QR-code met de camera van je telefoon.","Tik op ‘Ik ben er’.","Laat je telefoon aan en de pagina open. De vragen verschijnen vanzelf."],
  hulp:"Lukt het niet? Ga naar de website op het scherm en typ de code. Geen verbinding? Probeer mobiel internet. Of doe straks op papier mee.",
  live:{soort:"aanwezig",vraag:"Tik op de knop zodat we weten dat het werkt"},
  tip:"Wacht tot iedereen gekoppeld is, of tot het niet meer lukt. Wie niet kan koppelen, kan op papier meedoen. Klik daarna op Begin het gesprek."};

window.GESPREK={
  koppel:KOPPEL,
  volgorde:["talenten","kwadranten","combi"],
  regels:REGELS, kort:KORT,
  gesprekken:{
   talenten:{naam:"Talentengesprek",min:60,voor:"Teams die de talententest deden.",doel:"Hoe werken wij graag, en hoe vullen we elkaar aan?",
     nodig:["Iedereen heeft zijn eigen talentenprofiel bij zich, op de telefoon of uitgeprint. Laat het team de test van tevoren doen.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","60 minuten zonder onderbrekingen.","Een vrijwilliger voor het voorbeeld in stap 3. Vraag die vooraf."],
     bij:["Je eigen uitslag, op je telefoon of op papier.","Pen en papier."],slides:TALENTEN},
   kwadranten:{naam:"Kwadrantengesprek",min:60,voor:"Teams die kernkwadranten maakten.",doel:"Wat zijn onze kwaliteiten, valkuilen en allergieën?",
     nodig:["Iedereen heeft zijn drie kernkwadranten bij zich, op de telefoon of uitgeprint. Laat het team ze van tevoren maken.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","60 minuten zonder onderbrekingen.","Een vrijwilliger voor het voorbeeld in stap 3. Vraag die vooraf."],
     bij:["Je eigen kwadranten, op je telefoon of op papier.","Pen en papier."],slides:KWADRANTEN},
   combi:{naam:"Gecombineerd gesprek",min:90,voor:"Teams die allebei deden.",doel:"Talenten en kernkwadranten naast elkaar.",
     nodig:["Iedereen heeft zijn talentenprofiel én zijn drie kernkwadranten bij zich. Laat het team beide van tevoren doen.","Een scherm of beamer en een rustige ruimte.","Pen en papier, of een flip-over.","90 minuten, met een pauze van 5 minuten in het midden.","Een vrijwilliger voor het voorbeeld in stap 3. Vraag die vooraf."],
     bij:["Je talentenprofiel en je kwadranten, op je telefoon of op papier.","Pen en papier."],slides:COMBI}
  }
};
})();
