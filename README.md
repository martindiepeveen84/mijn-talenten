# Mijn talenten

Korte talententest (30 stellingen, ongeveer 5 minuten) voor teamgesprekken, gebaseerd op het Big Five-model. Statische website: alles draait in de browser van de gebruiker.

## Pagina's
| Bestand | Inhoud |
|---|---|
| `index.html` | Landingspagina: uitleg, werking, privacy, veelgestelde vragen |
| `test.html` | De vragenlijst, één stelling per scherm |
| `uitslag.html` | Uitslag met spinnenweb, uitleg per kenmerk, Word/afbeelding/print/mail/link |
| `kwadrant.html` | Kernkwadranten (naar Daniel Ofman): kies 3 kwaliteiten, vul valkuil, uitdaging en allergie in met suggesties, exporteer |
| `meedoen.html` | De pagina waar deelnemers met hun telefoon live anoniem antwoorden (via QR-code) |
| `uitleg.html` | Het Big Five-model, de kernkwadranten, beperkingen, privacy, hoe de site is gemaakt, bronnen |
| `gesprek.html` | Teamgesprek als geleide, schermvullende presentatie: talentengesprek (60 min), kwadrantengesprek (60 min) of gecombineerd (90 min), met agenda, uitleg, voorbeeld, rolkaarten voor tweegesprekken, timers, rondjes, vragen en ruimte voor afspraken |
| `assets/` | `style.css`, `data.js` (stellingen en teksten), `kwadrant-data.js` (40 kwaliteiten met suggesties), `kwadrant.js`, `common.js`, `pdf.js` (eigen PDF-schrijver), `test.js`, `uitslag.js`, `uitleg.js`, `gesprek-data.js` (de stappen van de gesprekken), `gesprek.js` (de gespreksleider), `favicon.svg` |

## Op GitHub zetten
1. Maak een repository (bijvoorbeeld `mijn-talenten`).
2. Upload alle bestanden en de map `assets` (de map `.claude` en dit bestand mogen weg).
3. **Settings → Pages**: *Deploy from a branch*, branch `main`, map `/ (root)`.
4. Na een minuut staat de site op `https://<jouw-naam>.github.io/mijn-talenten/`.

Lokaal bekijken: `python -m http.server 8765` in deze map en open `http://localhost:8765`.

## Privacy
- Geen server, database, cookies, localStorage, analytics of externe bestanden. Elke pagina heeft een Content-Security-Policy die verbindingen naar buiten blokkeert.
- De uitslag zit in het deel van het adres achter `#` (bijvoorbeeld `uitslag.html#r=E3.8-A4.2-C2.5-S3.0-O4.5`). Dat deel gaat nooit naar een server. Er zit geen naam in.
- Er is geen teamoverzicht. Delen gaat alleen via Word-bestand, afbeelding, mail of link, en de gebruiker beslist zelf.
- De webhost (GitHub) ziet, zoals bij elke site, wel dat een pagina wordt opgevraagd, maar niet de antwoorden of scores.

## Wetenschappelijke basis en beperkingen
- Stellingen: International Personality Item Pool (IPIP, publiek domein). 20 stellingen uit de Mini-IPIP (Donnellan e.a., 2006), 10 uit de IPIP Big Five-markeerders.
- 15 positief en 15 omgekeerd geformuleerde stellingen (tegen jasagen); stellingen in willekeurige volgorde, afwisselend per kenmerk.
- Controle op sociaal wenselijk of eentonig antwoorden: alleen een vriendelijke opmerking, geen blokkade. Bewust geen "forced choice": dat levert scores op die alleen binnen één persoon vergelijkbaar zijn.
- **De Nederlandse vertaling is een eigen vertaling en niet apart gevalideerd.** Er is geen Nederlandse normgroep, dus geen percentielen maar "lager / midden / hoger" op de schaal 1 tot 5 (grenzen 2,6 en 3,4).
- Niet geschikt voor selectie, beoordeling of promotie. Dit is geen TMA of vervanging daarvan.
- Controleer de bronvermeldingen op `uitleg.html` voordat je de site deelt.

## Aanpassen
- Teksten en stellingen: `assets/data.js` (`ITEMS`, `DOMEINEN`).
- Kleuren: `:root` in `assets/style.css` (lichtblauw `#66d1ff`, geel `#fff04f`, geen logo's).

## Kernkwadranten
- Eigen lijst van 40 kwaliteiten in 8 groepen, met eigen suggesties. Alle suggesties zijn vooraf geschreven. Er is bewust geen live AI: die zou de tekst van de gebruiker naar een externe dienst sturen.
- Suggesties staan standaard ingeklapt, niets is voorgekozen en elke suggestie kan worden weggeklikt (tegen sturing door suggesties).
- De allergie gaat over gedrag van anderen, niet over personen. De pagina vraagt om geen namen te noemen.
- Het kwadrant zit in de link (`kwadrant.html#k=...`). Dat bevat de gekozen kwaliteiten en de antwoorden van de gebruiker, geen naam.
- Het kernkwadrant is een coachmodel. Er is geen onderzoek naar de werking gevonden, en dat staat ook op de pagina.

## Teamgesprek als gespreksleider
- Kies een gesprek, klik op Start en projecteer het scherm. De site gaat stap voor stap door het gesprek, met een timer per stap, tweetalrondes met fases, rondjes, gespreksvragen en een scherm voor afspraken.
- Toetsen: pijl rechts of spatie = volgende, pijl links = vorige, F = volledig scherm, N = tips voor de gespreksleider, T = timer start/pauze.
- De stand staat in het adres (`gesprek.html#g=talenten&s=4`). Zo kan een gespreksleider dezelfde stap op een tweede apparaat openen om de tips te lezen. De apparaten lopen niet automatisch synchroon.
- Het scherm blijft aan (waar de browser dat toestaat). De bedieningsknoppen verdwijnen na enkele seconden, zodat ze niet op het scherm staan.
- Er wordt niets opgeslagen. De afspraken staan alleen op het scherm en kunnen worden gedownload, gekopieerd of geprint.
- Toetsen S en K tonen de spelregels van het team en de naslag (de vijf kenmerken of het kwadrant).
- Elk scherm legt uit wat we doen, waarom, wat jouw rol is, wat je doet als het niet lukt en wat daarna komt. De gespreksleider ziet met N tips en antwoorden op vragen die deelnemers kunnen stellen.
- De stappen staan in `assets/gesprek-data.js` en zijn eenvoudig aan te passen.

## Live meedoen (optioneel)
- De gespreksleider zet bij de start live meedoen aan. Op het scherm staat een QR-code en een code van 8 tekens. Deelnemers antwoorden anoniem op `meedoen.html`; de antwoorden verschijnen op het scherm.
- Het kan een eigen vraagtype per scherm zijn: schaal (1-5), keuze of tekst. De vragen staan in `assets/gesprek-data.js` (`live:{...}`). Tekstantwoorden kunnen met een klik naar de afspraken.
- Verbinding: [Trystero](https://github.com/dmotz/trystero) 0.26 (MIT), samen met `qrcode-generator` (MIT) gebundeld in `assets/vendor/live-lib.js`. Licenties staan in `assets/vendor/LICENSES.txt`.
- Rechtstreekse verbindingen (WebRTC) tussen telefoon en scherm. Alleen het opzetten loopt via openbare Nostr-servers (wss) en STUN-servers van Google en Cloudflare. De verbindingsgegevens zijn versleuteld met de code.
- De Content-Security-Policy van `gesprek.html` en `meedoen.html` staat daarom `connect-src wss:` toe. Alle andere pagina's blijven volledig dicht.
- Opnieuw bouwen van `live-lib.js`: `npm i trystero qrcode-generator esbuild` en bundel een bestand dat `joinRoom`, `selfId` en een `maakQR`-functie exporteert.
- Rechtstreekse verbindingen werken niet op elk netwerk. Probeer het vooraf met een telefoon.

## Schermen die altijd passen
- In de gespreksleider (`gesprek.css`, `gesprek.js`) zijn alle maten in `em`. Per scherm zoekt `pasOp()` de grootste lettergrootte (`--fs`) waarbij alles zonder scrollen past, bij elke resolutie en beeldverhouding. Dat gebeurt opnieuw bij een andere schermgrootte en als de inhoud verandert (live antwoorden, fases, vragen).
- Getest op 800x600, 1024x768, 1280x720, 1366x768, 1920x1080, 2560x1080, 3840x2160, 768x1024 (staand) en 390x844 (telefoon): alle schermen van de drie gesprekken pasten zonder scrollen. Op 800x600 en op een telefoon wordt de tekst op de drukste schermen klein (rond 10 px). Alleen als het echt niet past, mag het scherm scrollen.

## Koppelscherm en iPad
- Met live meedoen aan begint het gesprek met een koppelscherm: QR-code, code en een teller. Iedereen scant en tikt op 'Ik ben er'. Het scherm toont hoeveel telefoons gekoppeld zijn. Daarna begint het gesprek met 'Begin het gesprek'. De telefoonpagina probeert het scherm aan te houden.
- De gespreksleider meet de echte zichtbare hoogte (visualViewport) in plaats van 100vh, omdat op iPad en telefoon de werkbalken van de browser een deel van het scherm innemen. Na het schalen controleert `controleerPast()` altijd nog of er echt niets wegvalt en verkleint zo nodig verder.
