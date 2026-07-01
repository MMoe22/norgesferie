# Norgesferie 2026 🚗🏔️

En liten webapp som hjelper med å planlegge en ukes bilferie i Norge fra Kongsberg (6.–12. juli 2026).

## Åpne appen

Dobbeltklikk på **`index.html`** — den åpnes i nettleseren. Alt fungerer offline bortsett fra kartrutene og reisemål-bildene, som lastes fra internett.

## Innhold

| Fil | Hva det er |
|-----|------------|
| `index.html` | Reiseplanleggeren: **personlig rute** fra det dere har swipet, interaktivt kart, ruteforslag dag-for-dag, severdigheter, spektakulær overnatting, praktisk info og sjekkliste. |
| `swipe.html` | **Reise-Tinder** — swipe deg gjennom 219 norske reisemål (fjorder, fjelltopper, fosser, breer, strender, byer, stavkirker …). Hvert kort har flere bilder, Norgeskart (hvor i landet), avstand fra bilvei, turlengde og evt. ferje-/billettpris. |
| `styles.css` / `swipe.css` | Utseende. |
| `app.js` / `swipe.js` | Logikk (kart, filtre, swipe, favoritter, personlig rute). |
| `places.js` | Autogenerert data om de 219 stedene, med ekte foto fra Wikimedia Commons. **Rediger ikke for hånd.** |
| `norway-map.js` | Autogenerert SVG-omriss av Norge (brukt til mini-kartene). |
| `scripts/fetch-images.mjs` | Henter bildene + metadata og lager `places.js`. |
| `scripts/build-norway-map.mjs` | Lager `norway-map.js` fra åpen GeoJSON. |

## Slik henger det sammen

1. Swipe reisemål i **`swipe.html`** — dra mot ❤️ på det dere vil se. Favorittene lagres i nettleseren (`localStorage`). Stokken **hopper automatisk over** alt dere allerede har tatt stilling til, så dere fortsetter der dere slapp (en liten linje øverst viser hvor mange som gjenstår). Når alt er vurdert kan dere velge en full runde på nytt.
2. Gå tilbake til **`index.html`** — «Deres rute» bygges automatisk fra favorittene: kart med nummererte stopp i en fornuftig kjørerekkefølge fra Kongsberg. Ruten deles opp i **dagsetapper** (~8 aktive timer per dag) med kjøretid og tid på stedene per dag, **overnattingsforslag etter hver dag** – og egen hjemreisedag hvis siste etappe er lang. Hvert stopp har en **🧭 Kart**-lenke (åpner stedet i Google Maps – kjekt i bilen) og et **stort bilde** – trykk på det for **fullskjerm** og bla gjennom alle bildene av stedet (‹ ›, piltaster eller trykk på bildet). Øverst får dere et samlet **tidsestimat** så dere ser hva som får plass innenfor uka.

Rekkefølgen og kjøreavstanden beregnes langs **ekte hovedveier** via den frie tjenesten **OSRM** (`/trip`), som lager en optimert rundtur fra Kongsberg uten unødig fram-og-tilbake, og tegner ruten langs veiene på kartet. Uten nett (eller ved svært mange stopp) faller den pent tilbake til et grovt **luftlinje × 1,25**-anslag – et lite merke i totalraden viser hvilken modus som er aktiv (🛣️ langs vei / 📏 luftlinje), og i luftlinje-modus kan dere trykke på merket for å **prøve veirute på nytt**.
3. **Fjern et sted rett fra ruten:** klikk på kartnåla og velg **✕ Fjern fra ruten**, eller bruk ✕-knappen i listen. Kartet, rekkefølgen og totalene regnes ut på nytt umiddelbart – med en **Angre**-knapp hvis dere ombestemmer dere.
4. **Ingenting forsvinner:** alt dere swiper **nei** på eller fjerner fra ruten samles i **🗂️ Bortvalgte steder** nederst i «Deres rute». Det gjelder også ✕ i ønskelisten og **«Tøm listen»** (som nå spør først) – alt flyttes til Bortvalgte i stedet for å slettes. Ett klikk på **❤️ Ta med likevel** legger stedet tilbake i ruten – eller trykk **🔄 Swipe disse på nytt** for å sende hele bunken tilbake til Reise-Tinder og swipe gjennom dem på nytt. Angre-knappen ↩ i Reise-Tinder gjenoppretter alltid nøyaktig forrige tilstand.
5. **Alt lagres automatisk** på maskinen (nettleserens `localStorage`) og er der igjen etter at PC-en har vært avslått. Viktig: åpne appen på **samme måte hver gang** (samme snarvei/fane) og ikke i privat/inkognito-vindu – lagringen er knyttet til hvordan siden åpnes. Trykk **🗑️ Start på nytt** for å nullstille alle valg.

## Oppdatere reisemål / bilder

Stedene (navn, lokasjon, avstand fra bilvei, turlengde, pris osv.) ligger i `PLACES`-arrayet øverst i `scripts/fetch-images.mjs`. `COST` gir priser til eksisterende steder, og `REFINE` finjusterer bildesøk for tvetydige navn (unngå/krev-ord). Legg til / endre, og kjør:

```bash
node scripts/fetch-images.mjs      # henter bilder → places.js (tar vare på framgang, kan kjøres på nytt)
node scripts/build-norway-map.mjs  # (sjelden) regenererer Norge-omrisset → norway-map.js
```

Scriptet søker på Wikimedia Commons med `intitle:` for treffsikkerhet, og filtrerer bort feil motiv/navnesøsken. Vil du hente ett sted på nytt: slett det fra `places.js` og kjør scriptet igjen.

## Priser

Ferje-, bom-, gondol- og billettpriser er **omtrentlige anslag** (NOK, 2025-nivå) og vises med 💰. Sjekk alltid aktuell pris hos operatøren før dere reiser.

---

*God tur! 🇳🇴*
