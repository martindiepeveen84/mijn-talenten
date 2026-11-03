# Mijn talenten

Korte talententest (30 stellingen, ongeveer 5 minuten) voor teamgesprekken, gebaseerd op het Big Five-model. Statische website: alles draait in de browser van de gebruiker.

## Pagina's
| Bestand | Inhoud |
|---|---|
| `index.html` | Landingspagina: uitleg, werking, privacy, veelgestelde vragen |
| `test.html` | De vragenlijst, één stelling per scherm |
| `uitslag.html` | Uitslag met spinnenweb, uitleg per kenmerk, Word/afbeelding/print/mail/link |
| `uitleg.html` | Het Big Five-model, hoe de test is gemaakt, beperkingen, privacy, bronnen |
| `gesprek.html` | Stappenplan voor een teamgesprek van 45 minuten met gespreksvragen |
| `assets/` | `style.css`, `data.js` (stellingen en teksten), `common.js`, `pdf.js` (eigen PDF-schrijver), `test.js`, `uitslag.js`, `uitleg.js`, `gesprek.js`, `favicon.svg` |

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
