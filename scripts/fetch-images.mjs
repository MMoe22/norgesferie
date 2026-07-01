/* =========================================================================
   Henter flere ekte bilder pr. reisemål fra Wikimedia Commons
   og skriver places.js (window.PLACES = [...]).
   Kjør:  node scripts/fetch-images.mjs
   ========================================================================= */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "places.js");

/* ---- Reisemål over hele Norge (metadata skrevet for hånd) ---- */
const PLACES = [
  // --- Sør / Øst (nær Kongsberg) ---
  { id:"gaustatoppen", name:"Gaustatoppen", region:"Rjukan, Telemark", cat:"Fjelltopp", lat:59.8506, lng:8.6553, fromRoad:"Parkering ved Stavsro", hike:"3–4 t t/r – eller Gaustabanen inne i fjellet", diff:"Moderat", blurb:"1883 moh. På klarværsdager ser du 1/6 av Norge – helt til svenskegrensa og havet.", q:"Gaustatoppen" },
  { id:"heddal", name:"Heddal stavkyrkje", region:"Notodden, Telemark", cat:"Stavkirke", lat:59.5786, lng:9.1969, fromRoad:"Rett ved vei, parkering", hike:"Ingen gange", diff:"Ingen", blurb:"Norges største stavkirke, reist rundt 1250 – et mørkt, ruvende trebyggverk.", q:"Heddal stave church" },
  { id:"rjukan", name:"Rjukan & Krossobanen", region:"Rjukan, Telemark", cat:"Kultur", lat:59.8783, lng:8.5936, fromRoad:"Bilvei til sentrum", hike:"Kort til gondol/Vemork", diff:"Enkelt", blurb:"Tungtvannsbyen (UNESCO) i bunnen av en trang dal, med Nord-Europas første gondol.", q:"Rjukan" },
  { id:"rondane", name:"Rondane nasjonalpark", region:"Innlandet", cat:"Vandring", lat:61.9167, lng:9.8000, fromRoad:"Kjør til Spranghaugen", hike:"Dagsturer 4–8 t", diff:"Moderat", blurb:"Norges første nasjonalpark – myke, lyse fjell og reinlav så langt øyet rekker.", q:"Rondane" },
  { id:"besseggen", name:"Besseggen", region:"Vågå, Jotunheimen", cat:"Vandring", lat:61.4986, lng:8.7167, fromRoad:"Båt Gjendesheim–Memurubu", hike:"6–8 t, 14 km", diff:"Krevende", blurb:"Den berømte eggen mellom smaragdgrønne Gjende og dypblå Bessvatnet.", q:"Besseggen" },
  { id:"galdhopiggen", name:"Galdhøpiggen", region:"Lom, Jotunheimen", cat:"Fjelltopp", lat:61.6363, lng:8.3126, fromRoad:"Parkering Juvasshytta", hike:"5–6 t t/r m/ breføring", diff:"Krevende", blurb:"Nordens tak, 2469 moh – over en isbre til toppen av Norge.", q:"Galdhøpiggen" },
  { id:"sognefjellet", name:"Sognefjellsvegen", region:"Lom / Luster", cat:"Kjøretur", lat:61.5670, lng:8.0400, fromRoad:"Kjør helt fram", hike:"Stopp langs veien", diff:"Ingen", blurb:"Nord-Europas høyeste fjellovergang, 1434 moh – snøkanter selv midtsommers.", q:"Sognefjellet" },
  { id:"lom", name:"Lom stavkyrkje", region:"Lom, Innlandet", cat:"Stavkirke", lat:61.8386, lng:8.5669, fromRoad:"Bilvei", hike:"Ingen", diff:"Ingen", blurb:"Praktfull stavkirke fra 1100-tallet ved elva – stopp på det landskjente bakeriet.", q:"Lom stave church" },
  { id:"vettisfossen", name:"Vettisfossen", region:"Utladalen, Årdal", cat:"Foss", lat:61.3667, lng:7.9833, fromRoad:"Parkering Hjelle", hike:"2–3 t t/r fra Vetti", diff:"Moderat", blurb:"Norges høyeste uregulerte fossefall, 275 m i ett fritt fall.", q:"Vettisfossen" },

  // --- Vestlandet: Hardanger / Sogn ---
  { id:"trolltunga", name:"Trolltunga", region:"Odda, Ullensvang", cat:"Vandring", lat:60.1241, lng:6.7399, fromRoad:"Parkering Skjeggedal / P2", hike:"10–12 t t/r, 28 km", diff:"Krevende", blurb:"Den ikoniske klippehylla som stikker 700 m rett ut over Ringedalsvatnet.", q:"Trolltunga" },
  { id:"voringsfossen", name:"Vøringsfossen", region:"Eidfjord, Hardanger", cat:"Foss", lat:60.4262, lng:7.2530, fromRoad:"Parkering ved RV7", hike:"Kort – ny gangbru, 99 trinn", diff:"Enkelt", blurb:"182 m fossefall i Måbødalen, med svimlende gangbru rett over stupet.", q:"Vøringsfossen" },
  { id:"latefossen", name:"Låtefossen", region:"Odda, Hardanger", cat:"Foss", lat:59.9636, lng:6.5850, fromRoad:"Rett ved E134", hike:"Ingen", diff:"Ingen", blurb:"To brusende fossestrømmer som møtes under en gammel steinhvelvsbru.", q:"Låtefossen" },
  { id:"steinsdalsfossen", name:"Steinsdalsfossen", region:"Norheimsund", cat:"Foss", lat:60.3789, lng:6.1400, fromRoad:"Parkering, kort sti", hike:"5 min – gå bak fossen", diff:"Enkelt", blurb:"Den sjeldne fossen du kan gå tørrskodd bak.", q:"Steinsdalsfossen" },
  { id:"buarbreen", name:"Buarbreen", region:"Odda, Folgefonna", cat:"Bre", lat:60.0783, lng:6.6167, fromRoad:"Parkering Buar", hike:"2–3 t t/r", diff:"Moderat", blurb:"Blå bretunge fra Folgefonna som velter ned mot dalen.", q:"Buarbreen" },
  { id:"hardangervidda", name:"Hardangervidda", region:"RV7 over vidda", cat:"Kjøretur", lat:60.4020, lng:7.4500, fromRoad:"RV7 tvers over", hike:"Turer fra veien", diff:"Enkelt", blurb:"Nord-Europas største høyfjellsvidde – et månelandskap av vann og villrein.", q:"Hardangervidda" },
  { id:"naeroyfjord", name:"Nærøyfjorden", region:"Aurland / Vik", cat:"Fjord", lat:60.8760, lng:6.8420, fromRoad:"Cruise Flåm–Gudvangen", hike:"Cruise ca. 2 t", diff:"Enkelt", blurb:"UNESCO-fjord og en av verdens smaleste – bare 250 m på det trangeste.", q:"Nærøyfjord" },
  { id:"flamsbana", name:"Flåmsbana", region:"Flåm, Aurland", cat:"Kultur", lat:60.8631, lng:7.1134, fromRoad:"Tog fra Flåm", hike:"1 t togtur", diff:"Ingen", blurb:"En av verdens vakreste togturer – bratt ned forbi den fossende Kjosfossen.", q:"Flåmsbana" },
  { id:"stegastein", name:"Stegastein", region:"Aurland, Sogn", cat:"Utsikt", lat:60.9033, lng:7.2270, fromRoad:"Kjør fram, parkering", hike:"Kort", diff:"Ingen", blurb:"Prisbelønt plattform 650 m over Aurlandsfjorden – stikker 30 m rett ut i lufta.", q:"Stegastein" },
  { id:"borgund", name:"Borgund stavkyrkje", region:"Lærdal, Sogn", cat:"Stavkirke", lat:61.0472, lng:7.8125, fromRoad:"Bilvei", hike:"Ingen", diff:"Ingen", blurb:"Norges best bevarte stavkirke, ca. 1180 – dragehoder mot himmelen.", q:"Borgund stave church" },
  { id:"urnes", name:"Urnes stavkyrkje", region:"Luster, Sogn", cat:"Stavkirke", lat:61.2978, lng:7.3225, fromRoad:"Ferje fra Solvorn", hike:"Kort opp fra kaia", diff:"Enkelt", blurb:"Norges eldste stavkirke (UNESCO), med berømte utskjæringer fra 1100-tallet.", q:"Urnes stave church" },
  { id:"nigardsbreen", name:"Nigardsbreen", region:"Luster, Jostedalen", cat:"Bre", lat:61.6833, lng:7.2333, fromRoad:"Parkering + liten båt", hike:"Kort, evt. breføring", diff:"Moderat", blurb:"Fotogen blå bretunge fra Jostedalsbreen, ned i et grønt vann.", q:"Nigardsbreen" },
  { id:"fjaerland", name:"Fjærland", region:"Sogndal", cat:"Fjord", lat:61.4030, lng:6.7550, fromRoad:"Bilvei", hike:"Kort til bretunger", diff:"Enkelt", blurb:"Bokbyen mellom fjorden og to bretunger fra Jostedalsbreen.", q:"Fjærland" },

  // --- Nordfjord / Sunnmøre / Romsdal ---
  { id:"briksdalsbreen", name:"Briksdalsbreen", region:"Stryn, Nordfjord", cat:"Bre", lat:61.6650, lng:6.9200, fromRoad:"Parkering + sti/trolltog", hike:"45 min hver vei", diff:"Moderat", blurb:"Blå bretunge omgitt av fosser og bratte fjell i Briksdalen.", q:"Briksdalsbreen" },
  { id:"loen", name:"Loen Skylift / Hoven", region:"Loen, Nordfjord", cat:"Utsikt", lat:61.8700, lng:6.8450, fromRoad:"Gondol fra Loen", hike:"5 min gondol til 1011 moh", diff:"Enkelt", blurb:"Fra fjord til fjelltopp på minutter – ørnereir-utsikt over Nordfjord.", q:"Loen Skylift" },
  { id:"geirangerfjord", name:"Geirangerfjorden", region:"Stranda, Sunnmøre", cat:"Fjord", lat:62.1010, lng:7.2060, fromRoad:"Bilvei / ferje / cruise", hike:"Cruise 1–2 t", diff:"Enkelt", blurb:"Selveste postkortfjorden (UNESCO) med fossen De syv søstre.", q:"Geirangerfjord" },
  { id:"dalsnibba", name:"Dalsnibba", region:"Geiranger", cat:"Utsikt", lat:62.0430, lng:7.2770, fromRoad:"Bomvei helt opp", hike:"Ingen", diff:"Ingen", blurb:"Utsiktsplatå 1500 moh med panorama rett ned på Geirangerfjorden.", q:"Dalsnibba" },
  { id:"flydalsjuvet", name:"Flydalsjuvet", region:"Geiranger", cat:"Utsikt", lat:62.0870, lng:7.1900, fromRoad:"Parkering ved fv63", hike:"Kort", diff:"Enkelt", blurb:"Den klassiske utstikkeren med fjord og cruiseskip langt der nede.", q:"Flydalsjuvet" },
  { id:"trollstigen", name:"Trollstigen", region:"Rauma, Romsdal", cat:"Kjøretur", lat:62.4574, lng:7.6710, fromRoad:"Kjør fram (åpen 2026)", hike:"Kort til plattformene", diff:"Enkelt", blurb:"Dramatisk serpentinvei med 11 hårnålssvinger opp den bratte fjellsiden.", q:"Trollstigen" },
  { id:"trollveggen", name:"Trollveggen", region:"Rauma, Romsdal", cat:"Fjelltopp", lat:62.4967, lng:7.7500, fromRoad:"Rasteplass ved E136", hike:"Ingen – se nedenfra", diff:"Ingen", blurb:"Europas høyeste loddrette fjellvegg, over 1000 m rett opp.", q:"Trollveggen" },
  { id:"romsdalseggen", name:"Romsdalseggen", region:"Åndalsnes", cat:"Vandring", lat:62.5560, lng:7.7500, fromRoad:"Buss til start", hike:"6–8 t, 10 km", diff:"Krevende", blurb:"En av Norges vakreste fjellturer – knivsegg over hele Romsdalen.", q:"Romsdalseggen" },
  { id:"rampestreken", name:"Rampestreken / Nesaksla", region:"Åndalsnes", cat:"Utsikt", lat:62.5620, lng:7.6980, fromRoad:"Romsdalsgondolen", hike:"Gondol, eller 2 t opp", diff:"Moderat", blurb:"Utstikkende plattform høyt over Åndalsnes og fjorden.", q:"Rampestreken" },
  { id:"alesund", name:"Ålesund", region:"Sunnmøre", cat:"By", lat:62.4722, lng:6.1495, fromRoad:"Bilvei", hike:"Fjellstua: 418 trinn", diff:"Enkelt", blurb:"Jugendstilbyen mellom holmer og fjell – best sett fra Aksla-utsikten.", q:"Ålesund" },
  { id:"atlanterhavsvegen", name:"Atlanterhavsvegen", region:"Averøy / Hustadvika", cat:"Kjøretur", lat:63.0130, lng:7.3550, fromRoad:"Kjør fram", hike:"Stopp underveis", diff:"Ingen", blurb:"Ikonisk vei som svinger mellom skjær og bruer der havet slår inn.", q:"Atlantic Ocean Road" },
  { id:"runde", name:"Runde fugleøy", region:"Herøy, Sunnmøre", cat:"Kyst", lat:62.4000, lng:5.6300, fromRoad:"Bilvei + sti", hike:"1–2 t til fuglefjellet", diff:"Moderat", blurb:"Titusener sjøfugl – og lundefugl – på et stup mot Atlanterhavet.", q:"Runde" },
  { id:"hjorundfjord", name:"Hjørundfjorden", region:"Ørsta, Sunnmøre", cat:"Fjord", lat:62.2000, lng:6.6000, fromRoad:"Bilvei / ferje", hike:"Turer i Sunnmørsalpene", diff:"Moderat", blurb:"Ville alpetopper som stuper rett i fjorden – Norges vakreste, sier mange.", q:"Hjørundfjorden" },

  // --- Bergen / Hordaland ---
  { id:"bryggen", name:"Bryggen i Bergen", region:"Bergen", cat:"By", lat:60.3975, lng:5.3222, fromRoad:"Bilvei / parkering", hike:"Rusle rundt", diff:"Ingen", blurb:"Fargerike hansaboder på UNESCO-lista langs den gamle havna.", q:"Bryggen Bergen" },
  { id:"floyen", name:"Fløyen", region:"Bergen", cat:"Utsikt", lat:60.3944, lng:5.3389, fromRoad:"Fløibanen fra sentrum", hike:"8 min bane", diff:"Enkelt", blurb:"Byfjellet med utsikt over hele Bergen og fjordene rundt.", q:"Fløyen" },
  { id:"tvindefossen", name:"Tvindefossen", region:"Voss", cat:"Foss", lat:60.7217, lng:6.4283, fromRoad:"Rett ved E16", hike:"Ingen", diff:"Ingen", blurb:"Bred, vifteformet foss – et enkelt og fotogent stopp på veien.", q:"Tvindefossen" },

  // --- Rogaland / Sørvest ---
  { id:"preikestolen", name:"Preikestolen", region:"Strand, Ryfylke", cat:"Vandring", lat:58.9864, lng:6.1904, fromRoad:"Parkering fjellstue", hike:"4 t t/r, 8 km", diff:"Moderat", blurb:"604 m loddrett stup – den mest berømte klippen over Lysefjorden.", q:"Preikestolen" },
  { id:"kjerag", name:"Kjeragbolten", region:"Lysefjorden", cat:"Vandring", lat:59.0342, lng:6.5906, fromRoad:"Parkering Øygardstøl", hike:"5–6 t t/r", diff:"Krevende", blurb:"Steinblokka kilt fast over 1000 m luft – for de modige.", q:"Kjerag" },
  { id:"lysefjord", name:"Lysefjorden", region:"Ryfylke", cat:"Fjord", lat:59.0400, lng:6.4000, fromRoad:"Cruise fra Lauvvik/Stavanger", hike:"Cruise 2–3 t", diff:"Enkelt", blurb:"Dyp, dramatisk fjord under både Preikestolen og Kjerag.", q:"Lysefjorden" },
  { id:"florli", name:"Flørli 4444", region:"Lysefjorden", cat:"Vandring", lat:59.0000, lng:6.5000, fromRoad:"Passasjerbåt til Flørli", hike:"Verdens lengste tretrapp: 4444 trinn", diff:"Krevende", blurb:"Rett opp fjellsiden langs den gamle rørgata – 4444 trinn.", q:"Flørli" },
  { id:"gamlestavanger", name:"Gamle Stavanger", region:"Stavanger", cat:"By", lat:58.9700, lng:5.7250, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Trange brostensgater med 170 hvite trehus fra 1700-tallet.", q:"Gamle Stavanger" },
  { id:"lindesnes", name:"Lindesnes fyr", region:"Agder", cat:"Kyst", lat:57.9825, lng:7.0480, fromRoad:"Bilvei", hike:"Kort", diff:"Ingen", blurb:"Norges sørligste punkt – og undervannsrestauranten «Under» like ved.", q:"Lindesnes Fyr" },

  // --- Midt-Norge / Trøndelag / Helgeland ---
  { id:"nidaros", name:"Nidarosdomen", region:"Trondheim", cat:"Kultur", lat:63.4269, lng:10.3969, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Nordens største middelalderkatedral, reist over Olav den helliges grav.", q:"Nidaros Cathedral" },
  { id:"torghatten", name:"Torghatten", region:"Brønnøy, Helgeland", cat:"Fjelltopp", lat:65.4000, lng:12.0983, fromRoad:"Parkering, sti", hike:"1,5 t t/r til hullet", diff:"Moderat", blurb:"Fjellet med et hull tvers gjennom – du kan gå rett igjennom det.", q:"Torghatten" },
  { id:"svartisen", name:"Svartisen", region:"Meløy, Nordland", cat:"Bre", lat:66.6500, lng:13.7500, fromRoad:"Båt over fjorden + sti", hike:"2–3 t t/r", diff:"Moderat", blurb:"Norges nest største isbre, som kryper nesten helt ned til fjorden.", q:"Svartisen" },
  { id:"saltstraumen", name:"Saltstraumen", region:"Bodø, Nordland", cat:"Kyst", lat:67.2333, lng:14.6167, fromRoad:"Bilvei / bru", hike:"Se fra land", diff:"Ingen", blurb:"Verdens sterkeste tidevannsstrøm – digre malstrømmer fire ganger i døgnet.", q:"Saltstraumen" },

  // --- Nord-Norge / Lofoten / Finnmark ---
  { id:"reinebringen", name:"Reinebringen", region:"Lofoten, Moskenes", cat:"Vandring", lat:67.9300, lng:13.0900, fromRoad:"Sherpatrapp fra Reine", hike:"2–3 t t/r, ~1500 trinn", diff:"Krevende", blurb:"Den ultimate Lofoten-utsikten – rett ned på Reine og de spisse tindene.", q:"Reinebringen" },
  { id:"reine", name:"Reine", region:"Lofoten", cat:"Kyst", lat:67.9333, lng:13.0900, fromRoad:"Bilvei (E10)", hike:"Rusle", diff:"Ingen", blurb:"Røde rorbuer under dramatiske tinder – selve Lofoten-postkortet.", q:"Reine Lofoten" },
  { id:"henningsvaer", name:"Henningsvær", region:"Lofoten", cat:"Kyst", lat:68.1533, lng:14.2050, fromRoad:"Bilvei", hike:"Rusle, se fotballbanen", diff:"Ingen", blurb:"Fiskeværet spredt på holmer – med verdens vakreste fotballbane.", q:"Henningsvær" },
  { id:"kvalvika", name:"Kvalvika & Ryten", region:"Lofoten", cat:"Vandring", lat:68.0900, lng:13.2500, fromRoad:"Parkering Fredvang", hike:"3–4 t t/r", diff:"Moderat", blurb:"Skjult sandstrand og et stup som henger over havet.", q:"Kvalvika" },
  { id:"segla", name:"Segla", region:"Senja, Troms", cat:"Fjelltopp", lat:69.5100, lng:17.3400, fromRoad:"Fra Fjordgård", hike:"3–4 t t/r", diff:"Krevende", blurb:"Det dramatiske «seilet» som reiser seg 640 m rett opp av havet.", q:"Segla Senja" },
  { id:"tromso", name:"Tromsø & Fjellheisen", region:"Troms", cat:"By", lat:69.6496, lng:18.9560, fromRoad:"Fjellheisen fra byen", hike:"4 min bane", diff:"Enkelt", blurb:"Ishavsbyen med Ishavskatedralen, nordlys om vinteren og midnattssol nå.", q:"Tromsø" },
  { id:"nordkapp", name:"Nordkapp", region:"Magerøya, Finnmark", cat:"Kyst", lat:71.1694, lng:25.7833, fromRoad:"Kjør helt fram", hike:"Ingen", diff:"Ingen", blurb:"Europas nordligste punkt – klippen mot Barentshavet og midnattssola.", q:"Nordkapp" },

  // === UTVIDELSE: 30 flere steder ===
  // --- Østlandet / Sørlandet / Telemark ---
  { id:"aurlandsdalen", name:"Aurlandsdalen", region:"Aurland, Sogn", cat:"Vandring", lat:60.90, lng:7.35, fromRoad:"Buss/bil til Østerbø", hike:"4–6 t, ~20 km nedover", diff:"Moderat", blurb:"Norges «Grand Canyon» – frodig vandring gjennom et dramatisk juv.", q:"Aurlandsdalen" },
  { id:"aurlandsfjellet", name:"Aurlandsfjellet – Snøvegen", region:"Aurland, Sogn", cat:"Kjøretur", lat:60.85, lng:7.45, fromRoad:"Kjør fram (sommeråpen)", hike:"Stopp underveis", diff:"Ingen", blurb:"Villmarksvei over fjellet mellom Aurland og Lærdal – snø hele sommeren.", q:"Aurlandsfjellet" },
  { id:"telemarkskanalen", name:"Telemarkskanalen", region:"Telemark", cat:"Kultur", lat:59.40, lng:9.06, fromRoad:"Kanalbåt fra Skien/Notodden", hike:"Båttur 2–11 t", diff:"Ingen", blurb:"Historisk kanal med håndbetjente sluser – «det åttende underverk».", q:"Telemark Canal", cost:"Kanalbåt fra ca. 300 kr" },
  { id:"roros", name:"Røros bergstad", region:"Trøndelag", cat:"Kultur", lat:62.577, lng:11.385, fromRoad:"Bilvei", hike:"Rusle i gatene", diff:"Ingen", blurb:"Trehusby og gammelt gruvesamfunn på UNESCO-lista – et levende museum.", q:"Røros" },
  { id:"fredrikstad", name:"Gamlebyen Fredrikstad", region:"Østfold", cat:"Kultur", lat:59.203, lng:10.955, fromRoad:"Bilvei / gratis ferge", hike:"Rusle", diff:"Ingen", blurb:"Nord-Europas best bevarte festningsby, innenfor voller og vollgraver.", q:"Fredrikstad" },
  { id:"kristiansand", name:"Kristiansand", region:"Agder", cat:"By", lat:58.146, lng:7.998, fromRoad:"Bilvei", hike:"Rusle i Posebyen", diff:"Ingen", blurb:"Sørlandshovedstaden med bystrand, kvadratur og hvite trehus.", q:"Kristiansand" },
  { id:"lyngor", name:"Lyngør", region:"Tvedestrand, Agder", cat:"Kyst", lat:58.63, lng:9.15, fromRoad:"Skyssbåt (bilfritt)", hike:"Rusle", diff:"Ingen", blurb:"Bilfritt idyllsamfunn i skjærgården – kåret til Europas best bevarte tettsted.", q:"Lyngør", cost:"Skyssbåt ca. 100 kr" },
  { id:"manafossen", name:"Månafossen", region:"Gjesdal, Ryfylke", cat:"Foss", lat:58.94, lng:6.42, fromRoad:"Parkering, bratt sti m/kjetting", hike:"20 min bratt opp", diff:"Moderat", blurb:"Rogalands høyeste foss, 92 m – kort men bratt tur med kjettinggrep.", q:"Månafossen" },

  // --- Oslo ---
  { id:"vigeland", name:"Vigelandsparken", region:"Oslo", cat:"Kultur", lat:59.927, lng:10.700, fromRoad:"Bilvei / T-bane", hike:"Rusle", diff:"Ingen", blurb:"Verdens største skulpturpark av én kunstner – 200+ figurer i bronse og granitt.", q:"Vigeland Park" },
  { id:"holmenkollen", name:"Holmenkollen", region:"Oslo", cat:"Kultur", lat:59.964, lng:10.667, fromRoad:"Bilvei / T-bane", hike:"Rusle / hoppheis", diff:"Enkelt", blurb:"Verdens mest kjente hoppbakke, med utsikt over Oslo og fjorden.", q:"Holmenkollen", cost:"Skimuseet + tårn ca. 200 kr" },
  { id:"operahuset", name:"Operahuset", region:"Oslo", cat:"By", lat:59.907, lng:10.753, fromRoad:"Bilvei / sentrum", hike:"Gå på taket", diff:"Ingen", blurb:"Det hvite operataket stiger opp av fjorden – gå helt til topps.", q:"Oslo Opera House" },

  // --- Hardanger / Folgefonna ---
  { id:"kjeasen", name:"Kjeåsen fjellgard", region:"Eidfjord, Hardanger", cat:"Utsikt", lat:60.47, lng:7.13, fromRoad:"Bratt vei/tunnel – eller sti", hike:"Bil, eller 1,5 t bratt sti", diff:"Moderat", blurb:"Dramatisk fjellgard som klamrer seg til fjellet over Simadalsfjorden.", q:"Kjeåsen" },
  { id:"bondhus", name:"Bondhusvatnet", region:"Kvinnherad, Folgefonna", cat:"Vandring", lat:60.02, lng:6.31, fromRoad:"Parkering Sunndal", hike:"1 t inn til vatnet", diff:"Enkelt", blurb:"Grønt brevann speiler Bondhusbreen – en lett og magisk tur.", q:"Bondhusvatnet" },

  // --- Sogn / Nordfjord ---
  { id:"jostedalsbreen", name:"Jostedalsbreen", region:"Sogn / Nordfjord", cat:"Bre", lat:61.67, lng:7.00, fromRoad:"Fra Nigardsbreen/Briksdalen", hike:"Guidet breføring", diff:"Krevende", blurb:"Fastlands-Europas største isbre – 60 km lang av evig is.", q:"Jostedalsbreen", cost:"Breføring fra ca. 800 kr" },

  // --- Møre / Trollheimen / Dovre ---
  { id:"molde", name:"Molde panorama (Varden)", region:"Møre og Romsdal", cat:"Utsikt", lat:62.75, lng:7.14, fromRoad:"Bilvei opp til Varden", hike:"Kort", diff:"Enkelt", blurb:"«Byen med de 222 tindene» – hele Romsdalsalpene i ett blikk.", q:"Molde" },
  { id:"innerdalen", name:"Innerdalen", region:"Sunndal, Trollheimen", cat:"Vandring", lat:62.72, lng:8.75, fromRoad:"Parkering Nerdalen", hike:"1 t inn til dalen", diff:"Enkelt", blurb:"Kalt Norges vakreste fjelldal, kranset av spisse tinder.", q:"Innerdalen" },
  { id:"dovrefjell", name:"Dovrefjell & moskus", region:"Oppdal / Dovre", cat:"Vandring", lat:62.30, lng:9.55, fromRoad:"Parkering Kongsvoll/Hjerkinn", hike:"Moskussafari 5–6 t", diff:"Moderat", blurb:"Møt raggete moskus på den karrige vidda under Snøhetta.", q:"Dovrefjell", cost:"Guidet moskussafari ca. 450 kr" },
  { id:"snohetta", name:"Snøhetta", region:"Dovrefjell", cat:"Fjelltopp", lat:62.323, lng:9.267, fromRoad:"Fra Snøheim (skyttelbuss)", hike:"8–10 t t/r", diff:"Krevende", blurb:"Dovrefjells majestetiske tak, 2 286 moh, speilt i klare fjellvann.", q:"Snøhetta" },

  // --- Bergen ---
  { id:"ulriken", name:"Ulriken 643", region:"Bergen", cat:"Utsikt", lat:60.377, lng:5.393, fromRoad:"Ulriksbanen fra byen", hike:"7 min gondol", diff:"Enkelt", blurb:"Bergens høyeste byfjell med svimlende utsikt over de sju fjell.", q:"Ulriken", cost:"Ulriksbanen ca. 385 kr t/r" },

  // --- Lofoten / Vesterålen / Senja ---
  { id:"nusfjord", name:"Nusfjord", region:"Lofoten", cat:"Kyst", lat:68.03, lng:13.36, fromRoad:"Bilvei, parkering", hike:"Rusle", diff:"Ingen", blurb:"Et av Norges eldste og best bevarte fiskevær, i en lun vik.", q:"Nusfjord" },
  { id:"haukland", name:"Hauklandstranda & Uttakleiv", region:"Lofoten", cat:"Kyst", lat:68.14, lng:13.55, fromRoad:"Bilvei, parkering", hike:"Kort til stranda", diff:"Enkelt", blurb:"Hvit sand og turkist hav mellom Lofot-tindene – en arktisk drøm.", q:"Haukland" },
  { id:"svolvaer", name:"Svolvær", region:"Lofoten", cat:"By", lat:68.234, lng:14.567, fromRoad:"Bilvei (E10)", hike:"Rusle / Svolværgeita", diff:"Enkelt", blurb:"Lofotens hovedstad under de takkete Vågakaillan-tindene.", q:"Svolvær" },
  { id:"trollfjord", name:"Trollfjorden", region:"Lofoten / Vesterålen", cat:"Fjord", lat:68.36, lng:14.95, fromRoad:"Kun med båt", hike:"Cruise 2–3 t", diff:"Enkelt", blurb:"Bare 100 m bred fjord med loddrette vegger – dramatisk fra sjøen.", q:"Trollfjorden", cost:"Cruise ca. 700 kr" },
  { id:"lofotr", name:"Lofotr vikingmuseum", region:"Borg, Lofoten", cat:"Kultur", lat:68.23, lng:13.79, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Gjenreist 83 m langt høvdinghus fra vikingtida, med levende formidling.", q:"Lofotr", cost:"Inngang ca. 250 kr" },
  { id:"andoya", name:"Andøya hvalsafari", region:"Vesterålen", cat:"Kyst", lat:69.31, lng:16.13, fromRoad:"Bilvei til Andenes", hike:"Båt 3–4 t", diff:"Moderat", blurb:"Dyphavet rett utenfor gir nesten sikker sjanse for hval.", q:"Andenes", cost:"Hvalsafari ca. 1 290 kr" },
  { id:"tungeneset", name:"Tungeneset", region:"Senja, Troms", cat:"Utsikt", lat:69.49, lng:17.31, fromRoad:"Rasteplass ved fv862", hike:"Kort gangbru", diff:"Enkelt", blurb:"Tregangbru ut mot havet og de takkete «Djevletennene».", q:"Tungeneset" },

  // --- Nordland / Finnmark ---
  { id:"kjerringoy", name:"Kjerringøy handelssted", region:"Bodø, Nordland", cat:"Kultur", lat:67.80, lng:14.79, fromRoad:"Bilvei + ferje fra Bodø", hike:"Rusle", diff:"Ingen", blurb:"Vakkert bevart gammelt handelssted – kulisse for mange filmer.", q:"Kjerringøy", cost:"Ferje bil ca. 150 kr" },
  { id:"narvik", name:"Narvikfjellet", region:"Narvik, Nordland", cat:"Utsikt", lat:68.44, lng:17.43, fromRoad:"Gondol fra Narvik", hike:"Gondol til 656 moh", diff:"Enkelt", blurb:"Gondol opp over Ofotfjorden – midnattssol og krigshistorie.", q:"Narvik", cost:"Gondol ca. 320 kr t/r" },
  { id:"alta", name:"Alta – helleristningene", region:"Finnmark", cat:"Kultur", lat:69.949, lng:23.185, fromRoad:"Bilvei", hike:"Rusle på svabergene", diff:"Enkelt", blurb:"Verdensarv-helleristninger og den moderne Nordlyskatedralen.", q:"Alta rock art", cost:"Museum ca. 140 kr" },
  { id:"vardo", name:"Vardø & Vardøhus", region:"Finnmark", cat:"Kyst", lat:70.37, lng:31.11, fromRoad:"Bilvei (undersjøisk tunnel)", hike:"Rusle", diff:"Ingen", blurb:"Norges østligste by, med festning, pomorhistorie og Steilneset minnested.", q:"Vardø" },

  // === UTVIDELSE 2: mange flere reisemål – natur, vandring, kyst, kultur ===
  // --- Vandring & fjelltopper ---
  { id:"skala", name:"Skåla", region:"Loen, Nordfjord", cat:"Fjelltopp", lat:61.87, lng:6.88, fromRoad:"Parkering Tjugen", hike:"8–10 t t/r", diff:"Krevende", blurb:"Bratt klatring til steintårnet Skålatårnet på 1848 moh over Nordfjord.", q:"Skåla Loen" },
  { id:"slogen", name:"Slogen", region:"Øye, Sunnmøre", cat:"Fjelltopp", lat:62.18, lng:6.83, fromRoad:"Fra Øye/Urke", hike:"8–10 t t/r", diff:"Krevende", blurb:"En av Sunnmørsalpenes mest majestetiske topper, rett opp av Norangsfjorden.", q:"Slogen" },
  { id:"glittertind", name:"Glittertind", region:"Jotunheimen", cat:"Fjelltopp", lat:61.651, lng:8.554, fromRoad:"Fra Glitterheim", hike:"7–9 t t/r", diff:"Krevende", blurb:"Jotunheimens nest høyeste, 2452 moh, med evig is på toppen.", q:"Glittertind" },
  { id:"fanaraken", name:"Fannaråken", region:"Jotunheimen", cat:"Fjelltopp", lat:61.526, lng:7.905, fromRoad:"Fra Turtagrø", hike:"6–8 t t/r", diff:"Krevende", blurb:"Norges høyestliggende turisthytte, 2068 moh, over Hurrungane.", q:"Fannaråken" },
  { id:"bitihorn", name:"Bitihorn", region:"Valdres / Jotunheimen", cat:"Fjelltopp", lat:61.30, lng:8.78, fromRoad:"Fra Bygdin", hike:"3–4 t t/r", diff:"Moderat", blurb:"Spiss, lett tilgjengelig topp med storslått utsikt over Bygdin.", q:"Bitihorn" },
  { id:"husedalen", name:"Husedalen", region:"Kinsarvik, Hardanger", cat:"Vandring", lat:60.38, lng:6.72, fromRoad:"Parkering Kinsarvik", hike:"5–6 t t/r", diff:"Moderat", blurb:"Frodig dal med fire mektige fossefall opp mot Hardangervidda.", q:"Husedalen" },
  { id:"rondeslottet", name:"Rondeslottet", region:"Rondane", cat:"Fjelltopp", lat:61.90, lng:9.79, fromRoad:"Fra Rondvassbu", hike:"7–9 t t/r", diff:"Krevende", blurb:"Rondanes høyeste topp, 2178 moh, midt i den eldste nasjonalparken.", q:"Rondeslottet" },

  // --- Fosser ---
  { id:"langfoss", name:"Langfoss", region:"Åkrafjorden, Etne", cat:"Foss", lat:59.78, lng:6.30, fromRoad:"Rasteplass ved E134", hike:"Se fra veien / bratt sti", diff:"Enkelt", blurb:"612 m fossefall rett ned i fjorden – kåret blant verdens vakreste.", q:"Langfoss" },
  { id:"mardalsfossen", name:"Mardalsfossen", region:"Eikesdalen, Molde", cat:"Foss", lat:62.52, lng:8.14, fromRoad:"Parkering + sti", hike:"1,5 t t/r", diff:"Moderat", blurb:"Et av Nord-Europas høyeste fossefall, hele 705 m.", q:"Mardalsfossen" },
  { id:"feigefossen", name:"Feigefossen", region:"Luster, Sogn", cat:"Foss", lat:61.42, lng:7.30, fromRoad:"Kort sti fra Feigum", hike:"45 min t/r", diff:"Enkelt", blurb:"218 m fritt fall ned mot Lustrafjorden.", q:"Feigefossen" },
  { id:"skjervsfossen", name:"Skjervsfossen", region:"Granvin, Hardanger", cat:"Foss", lat:60.53, lng:6.70, fromRoad:"Rett ved fylkesvegen", hike:"Kort", diff:"Enkelt", blurb:"Foss med arkitekttegnet rasteplass på den gamle Vossavegen.", q:"Skjervsfossen" },
  { id:"storseterfossen", name:"Storseterfossen", region:"Geiranger", cat:"Foss", lat:62.12, lng:7.15, fromRoad:"Parkering Vesterås", hike:"1,5 t t/r – gå bak fossen", diff:"Moderat", blurb:"Foss du kan gå bak, med Geirangerfjorden langt der nede.", q:"Storseterfossen" },
  { id:"gudbrandsjuvet", name:"Gudbrandsjuvet", region:"Valldal, Sunnmøre", cat:"Foss", lat:62.30, lng:7.30, fromRoad:"Rett ved fv63", hike:"Gangbruer over juvet", diff:"Enkelt", blurb:"Trangt, brusende juv med arkitekttegnede gangbruer.", q:"Gudbrandsjuvet" },

  // --- Isbreer & brevann ---
  { id:"kjenndalsbreen", name:"Kjenndalsbreen", region:"Loen, Nordfjord", cat:"Bre", lat:61.73, lng:6.95, fromRoad:"Bomvei + kort sti", hike:"1 t t/r", diff:"Enkelt", blurb:"Blågrønn bretunge innerst i Lodalen ved Lovatnet.", q:"Kjenndalsbreen", cost:"Bomvei ca. 100 kr" },
  { id:"boyabreen", name:"Bøyabreen", region:"Fjærland, Sogn", cat:"Bre", lat:61.47, lng:6.75, fromRoad:"Kort fra parkering", hike:"15 min", diff:"Enkelt", blurb:"Bretunge fra Jostedalsbreen du nesten kan kjøre helt fram til.", q:"Bøyabreen" },
  { id:"hardangerjokulen", name:"Hardangerjøkulen", region:"Finse", cat:"Bre", lat:60.55, lng:7.20, fromRoad:"Tog til Finse + sti", hike:"6–7 t t/r m/ guide", diff:"Krevende", blurb:"Isbreen som var planeten Hoth i Star Wars, høyt over Finse.", q:"Hardangerjøkulen", cost:"Guidet bretur fra ca. 900 kr" },
  { id:"folgefonna", name:"Folgefonna", region:"Hardanger", cat:"Bre", lat:60.03, lng:6.35, fromRoad:"Fonna sommerskisenter", hike:"Guidet bre / ski", diff:"Krevende", blurb:"Norges tredje største isbre – med sommerski på Fonna.", q:"Folgefonna", cost:"Guidet bretur fra ca. 800 kr" },

  // --- Fjorder & innsjøer ---
  { id:"sognefjord", name:"Sognefjorden", region:"Vestland", cat:"Fjord", lat:61.10, lng:6.70, fromRoad:"Bilvei / cruise", hike:"Cruise / kjøring", diff:"Enkelt", blurb:"Norges lengste og dypeste fjord – 204 km inn i landet.", q:"Sognefjorden" },
  { id:"hardangerfjord", name:"Hardangerfjorden", region:"Vestland", cat:"Fjord", lat:60.30, lng:6.40, fromRoad:"Bilvei / cruise", hike:"Cruise / kjøring", diff:"Enkelt", blurb:"Fjord kranset av frukthager, breer og fossefall.", q:"Hardangerfjord" },
  { id:"lovatnet", name:"Lovatnet", region:"Loen, Nordfjord", cat:"Fjord", lat:61.85, lng:6.90, fromRoad:"Bilvei langs vatnet", hike:"Kjør / rusle", diff:"Enkelt", blurb:"Uvirkelig turkist brevann under bratte fjell.", q:"Lovatnet" },
  { id:"femunden", name:"Femunden", region:"Røros / Engerdal", cat:"Fjord", lat:62.10, lng:11.85, fromRoad:"Bilvei / veteranbåt", hike:"Rusle / båttur", diff:"Enkelt", blurb:"Norges tredje største innsjø, i villmarka ved Femundsmarka.", q:"Femunden" },
  { id:"hellesylt", name:"Hellesylt", region:"Stranda, Sunnmøre", cat:"Fjord", lat:62.08, lng:6.87, fromRoad:"Bilvei / ferje", hike:"Foss i sentrum", diff:"Enkelt", blurb:"Fossen midt i bygda og fergeport inn Geirangerfjorden.", q:"Hellesylt" },
  { id:"undredal", name:"Undredal", region:"Aurland, Sogn", cat:"Fjord", lat:60.93, lng:7.10, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Bittelite fjordbygd kjent for geitost og landets minste stavkirke.", q:"Undredal" },

  // --- Kjøreturer & fjelloverganger ---
  { id:"gaularfjellet", name:"Gaularfjellet (Utsikten)", region:"Sunnfjord, Sogn", cat:"Kjøretur", lat:61.30, lng:6.30, fromRoad:"Kjør fram", hike:"Kort til platå", diff:"Ingen", blurb:"Svingete turistveg med utsiktsplatå over fossene.", q:"Gaularfjellet" },
  { id:"strynefjellsvegen", name:"Gamle Strynefjellsvegen", region:"Stryn / Skjåk", cat:"Kjøretur", lat:62.03, lng:7.55, fromRoad:"Kjør fram (sommeråpen)", hike:"Stopp underveis", diff:"Ingen", blurb:"Historisk fjellovergang med steinmurer, fossefall og bre.", q:"Gamle Strynefjellsvegen" },
  { id:"rallarvegen", name:"Rallarvegen", region:"Finse – Flåm", cat:"Kjøretur", lat:60.60, lng:7.30, fromRoad:"Kun tog / sykkel", hike:"Sykle 1–2 dager", diff:"Moderat", blurb:"En av verdens vakreste sykkelveier, langs Bergensbanen.", q:"Rallarvegen", cost:"Sykkelutleie fra ca. 400 kr" },

  // --- Kyst, strender & øyer ---
  { id:"bleik", name:"Bleik & Bleiksøya", region:"Andøya, Vesterålen", cat:"Kyst", lat:69.28, lng:15.95, fromRoad:"Bilvei", hike:"Rusle / strand", diff:"Ingen", blurb:"Kilometerlang hvit strand med utsikt til lundefugløya Bleiksøya.", q:"Bleik" },
  { id:"ersfjord_senja", name:"Ersfjordstranda", region:"Senja, Troms", cat:"Kyst", lat:69.52, lng:17.32, fromRoad:"Bilvei", hike:"Kort", diff:"Ingen", blurb:"Idyllisk sandstrand omkranset av bratte Senja-tinder.", q:"Ersfjordstranda Senja" },
  { id:"hamnoy", name:"Hamnøy", region:"Lofoten", cat:"Kyst", lat:67.94, lng:13.13, fromRoad:"Bilvei (E10)", hike:"Rusle / foto", diff:"Ingen", blurb:"Lofotens mest fotograferte rorbuer, under Festhæltinden.", q:"Hamnøy" },
  { id:"sakrisoy", name:"Sakrisøy", region:"Lofoten", cat:"Kyst", lat:67.93, lng:13.11, fromRoad:"Bilvei (E10)", hike:"Rusle", diff:"Ingen", blurb:"Okergule rorbuer på en holme mellom Hamnøy og Reine.", q:"Sakrisøy" },
  { id:"unstad", name:"Unstad", region:"Lofoten", cat:"Kyst", lat:68.23, lng:13.55, fromRoad:"Bilvei", hike:"Rusle / surf", diff:"Enkelt", blurb:"Arktisk surfeparadis med bølger året rundt.", q:"Unstad Lofoten" },
  { id:"kannesteinen", name:"Kannesteinen", region:"Vågsøy, Nordfjord", cat:"Kyst", lat:61.96, lng:4.95, fromRoad:"Kort sti", hike:"10 min", diff:"Enkelt", blurb:"Bølgeformet steinskulptur meislet av havet gjennom årtusener.", q:"Kannesteinen" },
  { id:"refviksanden", name:"Refviksanden", region:"Vågsøy, Nordfjord", cat:"Kyst", lat:62.02, lng:4.98, fromRoad:"Bilvei", hike:"Kort", diff:"Enkelt", blurb:"Kilometerlang, kritthvit strand kåret blant Norges vakreste.", q:"Refviksanden" },
  { id:"vestkapp", name:"Vestkapp", region:"Stad", cat:"Utsikt", lat:62.05, lng:5.12, fromRoad:"Bilvei nesten helt opp", hike:"Kort", diff:"Enkelt", blurb:"Dramatisk platå 496 m rett over storhavet på Stadlandet.", q:"Vestkapp" },
  { id:"sommaroy", name:"Sommarøy", region:"Troms", cat:"Kyst", lat:69.63, lng:18.00, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Hvite strender og turkist hav i havgapet vest for Tromsø.", q:"Sommarøy" },
  { id:"orrestranda", name:"Orrestranda", region:"Jæren, Rogaland", cat:"Kyst", lat:58.75, lng:5.52, fromRoad:"Bilvei", hike:"Rusle langs stranda", diff:"Enkelt", blurb:"Del av de milelange Jærstrendene – bølger og surf.", q:"Orrestranda" },
  { id:"bergsbotn", name:"Bergsbotn", region:"Senja, Troms", cat:"Utsikt", lat:69.44, lng:17.40, fromRoad:"Plattform ved fv862", hike:"Kort", diff:"Ingen", blurb:"44 m lang utsiktsplattform over den vakre Bergsfjorden.", q:"Bergsbotn" },
  { id:"lyngenalpene", name:"Lyngenalpene", region:"Troms", cat:"Fjelltopp", lat:69.55, lng:20.20, fromRoad:"Bilvei / ferje / ski", hike:"Toppturer", diff:"Krevende", blurb:"Alpine tinder og breer rett opp av Lyngenfjorden – skiparadis.", q:"Lyngen Alps" },

  // --- Stavkirker & kultur ---
  { id:"hopperstad", name:"Hopperstad stavkyrkje", region:"Vik, Sogn", cat:"Stavkirke", lat:61.08, lng:6.58, fromRoad:"Bilvei", hike:"Ingen", diff:"Ingen", blurb:"Vakkert restaurert stavkirke fra ca. 1130.", q:"Hopperstad stave church", cost:"Inngang ca. 90 kr" },
  { id:"ringebu", name:"Ringebu stavkyrkje", region:"Gudbrandsdalen", cat:"Stavkirke", lat:61.53, lng:10.14, fromRoad:"Bilvei", hike:"Ingen", diff:"Ingen", blurb:"Rødtårnet stavkirke fra 1200-tallet i Gudbrandsdalen.", q:"Ringebu stave church", cost:"Inngang ca. 90 kr" },
  { id:"eidsborg", name:"Eidsborg stavkyrkje", region:"Vest-Telemark", cat:"Stavkirke", lat:59.53, lng:8.10, fromRoad:"Bilvei", hike:"Ingen", diff:"Ingen", blurb:"Liten, sjarmerende stavkirke ved Vest-Telemark museet.", q:"Eidsborg stave church", cost:"Inngang ca. 90 kr" },
  { id:"fantoft", name:"Fantoft stavkirke", region:"Bergen", cat:"Stavkirke", lat:60.35, lng:5.33, fromRoad:"Bybane + kort sti", hike:"Kort", diff:"Enkelt", blurb:"Gjenreist stavkirke i skogen sør for Bergen sentrum.", q:"Fantoft", cost:"Inngang ca. 60 kr" },
  { id:"akershus", name:"Akershus festning", region:"Oslo", cat:"Kultur", lat:59.907, lng:10.736, fromRoad:"Bilvei / sentrum", hike:"Rusle", diff:"Ingen", blurb:"Middelalderfestning og slott som vokter Oslos havn.", q:"Akershus Fortress" },
  { id:"bakklandet", name:"Bakklandet & Gamle Bybro", region:"Trondheim", cat:"By", lat:63.43, lng:10.41, fromRoad:"Bilvei / gå", hike:"Rusle", diff:"Ingen", blurb:"Fargerike trehus og «Lykkens portal» ved Nidelva.", q:"Bakklandet Trondheim" },
  { id:"fargegata", name:"Fargegata (Øvre Holmegate)", region:"Stavanger", cat:"By", lat:58.97, lng:5.73, fromRoad:"Bilvei / gå", hike:"Rusle", diff:"Ingen", blurb:"Stavangers fargeeksplosjon av en gate, full av kafeer.", q:"Øvre Holmegate Stavanger" },
  { id:"ishavskatedralen", name:"Ishavskatedralen", region:"Tromsø", cat:"Kultur", lat:69.65, lng:18.99, fromRoad:"Bilvei", hike:"Kort", diff:"Ingen", blurb:"Tromsøs ikoniske, spisse kirke i betong og glass.", q:"Ishavskatedralen", cost:"Inngang ca. 75 kr" },
  { id:"bodo", name:"Bodø", region:"Nordland", cat:"By", lat:67.28, lng:14.40, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Europeisk kulturhovedstad 2024, port til Lofoten og midnattssol.", q:"Bodø" },
  { id:"kristiansund", name:"Kristiansund", region:"Nordmøre", cat:"By", lat:63.11, lng:7.73, fromRoad:"Bilvei / Sundbåten", hike:"Rusle", diff:"Ingen", blurb:"Klippfiskbyen på fire øyer, med verdens eldste bybåt i drift.", q:"Kristiansund", cost:"Sundbåten ca. 40 kr" },
  { id:"troldhaugen", name:"Troldhaugen", region:"Bergen", cat:"Kultur", lat:60.30, lng:5.33, fromRoad:"Bilvei", hike:"Rusle / konsert", diff:"Ingen", blurb:"Komponisten Edvard Griegs villa ved Nordåsvannet.", q:"Troldhaugen", cost:"Inngang ca. 150 kr" },
  { id:"rosendal", name:"Baroniet Rosendal", region:"Kvinnherad, Hardanger", cat:"Kultur", lat:59.99, lng:6.02, fromRoad:"Bilvei", hike:"Rusle i hagen", diff:"Ingen", blurb:"Norges eneste baroni, med prakthage under Folgefonna.", q:"Baroniet Rosendal", cost:"Inngang ca. 150 kr" },
  { id:"maihaugen", name:"Maihaugen", region:"Lillehammer", cat:"Kultur", lat:61.11, lng:10.47, fromRoad:"Bilvei", hike:"Rusle", diff:"Ingen", blurb:"Et av Europas største friluftsmuseer, med 200 historiske hus.", q:"Maihaugen", cost:"Inngang ca. 220 kr" },
  { id:"sohlbergplassen", name:"Sohlbergplassen", region:"Innlandet", cat:"Utsikt", lat:61.88, lng:10.18, fromRoad:"Rasteplass langs Fv27 ved Atnsjøen i Stor-Elvdal", hike:"", diff:"Enkelt", blurb:"Den prisbelønte utsiktsplattformen rammer inn nøyaktig Rondane-motivet Harald Sohlberg malte i «Vinternatt i Rondane».", q:"Sohlbergplassen Rondane viewpoint" },
  { id:"ureddplassen", name:"Ureddplassen", region:"Nordland", cat:"Kyst", lat:66.95, lng:13.63, fromRoad:"Ved Fv17 vest for Mevik i Gildeskål på Helgelandskysten", hike:"", diff:"Enkelt", blurb:"Prisbelønt rasteplass med storslått utsikt mot Lofotveggen ved havet.", q:"Ureddplassen rest area Norway" },
  { id:"stalheimskleiva", name:"Stalheimskleiva", region:"Vestland", cat:"Kjøretur", lat:60.84, lng:6.68, fromRoad:"Avkjøring fra E16 ved Stalheim til gamlevegen", hike:"", diff:"Moderat", blurb:"En av Nord-Europas brattaste vegar med 13 hårnålssvingar mellom fossene Sivle og Stalheim, med praktutsikt over Nærøydalen.", q:"Stalheimskleiva hairpin road Nærøydalen" },
  { id:"allmannajuvet", name:"Allmannajuvet", region:"Rogaland", cat:"Kultur", lat:59.65, lng:6.47, fromRoad:"Ved Fv520 mellom Sauda og Hellandsbygd", hike:"15 min", diff:"Moderat", blurb:"Peter Zumthors slående svarte paviljonger ved en gammel sinkgruve danner museum, kafé og rasteplass i det ville juvet.", q:"Allmannajuvet Zumthor zinc mine museum", cost:"Inngang/omvisning ca. 120 kr" },
  { id:"ornesvingen", name:"Ørnesvingen", region:"Møre og Romsdal", cat:"Fjord", lat:62.12, lng:7.18, fromRoad:"Øverste hårnålssving på Ørnevegen (Fv63) over Geiranger", hike:"", diff:"Enkelt", blurb:"Fra den øverste av de elleve svingene på Ørnevegen ser du rett ned på Geiranger, fjorden og De sju søstre-fossen.", q:"Ørnesvingen Ørnevegen Geiranger viewpoint" },
  { id:"steilneset", name:"Steilneset minnested", region:"Finnmark", cat:"Kultur", lat:70.37, lng:31.09, fromRoad:"Ved E75 i Vardø langs Nasjonal turistveg Varanger", hike:"", diff:"Enkelt", blurb:"Gripende minnesmerke over hekseprosessenes ofre, tegnet av Peter Zumthor og kunstneren Louise Bourgeois.", q:"Steilneset Memorial Vardo witch" },
  { id:"hamningberg", name:"Hamningberg", region:"Finnmark", cat:"Kyst", lat:70.54, lng:30.6, fromRoad:"Endepunkt for Nasjonal turistveg Varanger, vei fra Vardø (stengt om vinteren)", hike:"", diff:"", blurb:"Nesten forlatt fiskevær omgitt av et månelandskap av forvitrede, dramatiske klippeformasjoner.", q:"Hamningberg Varanger Finnmark" },
  { id:"valdresflye", name:"Valdresflye", region:"Innlandet", cat:"Kjøretur", lat:61.39, lng:8.81, fromRoad:"Kjør Fv51 over høyfjellsplatået mellom Valdres og Vågå; stengt om vinteren", hike:"", diff:"", blurb:"Norges nest høyeste fjellovergang tar deg opp i 1389 moh med panorama rett inn i det østlige Jotunheimen.", q:"Valdresflye mountain road Jotunheimen" },
  { id:"svandalsfossen", name:"Svandalsfossen", region:"Rogaland", cat:"Foss", lat:59.63, lng:6.29, fromRoad:"Ved Fv520, 6 km sør for Sauda", hike:"10 min", diff:"Moderat", blurb:"En 180 meter høy foss der 540 trappetrinn i rustent stål tar deg langs vannmassene opp til øvre fossefall.", q:"Svandalsfossen waterfall Sauda" },
  { id:"ekkeroy", name:"Ekkerøy", region:"Finnmark", cat:"Kyst", lat:70.07, lng:30.13, fromRoad:"Ved E75 øst for Vadsø langs Nasjonal turistveg Varanger", hike:"15 min", diff:"Enkelt", blurb:"Et av Finnmarks mest tilgjengelige fuglefjell med tusenvis av krykkjer i et naturreservat.", q:"Ekkeroy bird cliff Varanger" },
  { id:"bukkekjerka", name:"Bukkekjerka", region:"Nordland", cat:"Kyst", lat:69.1, lng:15.57, fromRoad:"Rasteplass ved Fv974 mellom Nøss og Nordmela på Andøya", hike:"", diff:"Enkelt", blurb:"Spektakulær rasteplass ved et gammelt samisk offersted, med gangbru ut i det dramatiske kystlandskapet.", q:"Bukkekjerka rest area Andoya" },
  { id:"kvassheim", name:"Kvassheim fyr", region:"Rogaland", cat:"Kyst", lat:58.54, lng:5.68, fromRoad:"Ved Fv44, avkjøring mot Kvassheim på Jæren", hike:"5 min", diff:"Enkelt", blurb:"Fredet fyrstasjon fra 1912 rett ved havet, i dag friluftsfyr og museum med kafé og fugleutstilling.", q:"Kvassheim fyr lighthouse Jæren" },
  { id:"likholefossen", name:"Likholefossen", region:"Vestland", cat:"Foss", lat:61.33, lng:6.27, fromRoad:"Ved Fv13 Gaularfjellet, ved Hov i Eldalsdalen", hike:"", diff:"Enkelt", blurb:"Kraftig foss i det verna Gaularvassdraget der ei fleksibel stålbru fører deg tett innpå naturkreftene.", q:"Likholefossen waterfall bridge Gaular" },
  { id:"havoysund", name:"Havøysund", region:"Finnmark", cat:"Kyst", lat:71, lng:24.66, fromRoad:"Endepunkt for Nasjonal turistveg Havøysund via Fv889 fra E6", hike:"", diff:"", blurb:"Et av landets nordligste fiskevær er endepunktet for den værharde turistvegen langs Fv889.", q:"Havoysund Finnmark Norway" },
  { id:"obrestad", name:"Obrestad fyr", region:"Rogaland", cat:"Kyst", lat:58.66, lng:5.55, fromRoad:"Ved Fv44 vest for Nærbø på Jæren", hike:"", diff:"Enkelt", blurb:"Norges vestligste fastlandsfyr, tent i 1873, troner på et nes med vid utsikt over Nordsjøen.", q:"Obrestad fyr lighthouse Nærbø" },
  { id:"fredriksten", name:"Fredriksten festning", region:"Østfold", cat:"Kultur", lat:59.12, lng:11.4, fromRoad:"E6 til Halden, skiltet vei opp til festningen med parkering innenfor portene", hike:"", diff:"", blurb:"Mektig grensefestning som ble beleiret seks ganger men aldri inntatt, der svenskekongen Karl XII falt i 1718.", q:"Fredriksten fortress" },
  { id:"slottsfjellet", name:"Slottsfjellet", region:"Vestfold", cat:"Kultur", lat:59.27, lng:10.4, fromRoad:"E18 til Tønsberg; parkering ved foten av fjellet og gangvei opp til tårnet", hike:"10 min", diff:"Enkelt", blurb:"Norges eldste by kroner seg med Slottsfjelltårnet fra 1888 og middelalderruinene etter Tunsberghus.", q:"Slottsfjellet Tønsberg" },
  { id:"eidsvollsbygningen", name:"Eidsvollsbygningen", region:"Akershus", cat:"Kultur", lat:60.3, lng:11.17, fromRoad:"Ved Eidsvoll Verk, like ved E6 ca. 45 min nord for Oslo; egen besøksparkering", hike:"", diff:"", blurb:"Det moderne Norges vugge, der Grunnloven ble skrevet og undertegnet 17. mai 1814.", q:"Eidsvollsbygningen" },
  { id:"oscarsborg", name:"Oscarsborg festning", region:"Akershus", cat:"Kultur", lat:59.67, lng:10.61, fromRoad:"Parker i Drøbak (avkjøring Rv23) og ta Oscarsborgfergen ca. 5 min ut til øya", hike:"", diff:"", blurb:"Øyfestningen som senket den tyske krysseren «Blücher» 9. april 1940 og ga kongefamilien tid til å flykte fra Oslo.", q:"Oscarsborg fortress", cost:"Ferge + omvisning ca. 200 kr" },
  { id:"kristiansten", name:"Kristiansten festning", region:"Trøndelag", cat:"Kultur", lat:63.428, lng:10.417, fromRoad:"På høyden øst for Midtbyen i Trondheim; kort kjøring fra sentrum, parkering i nærheten", hike:"", diff:"", blurb:"Festning fra 1680-årene som troner over Trondheim med praktfull utsikt over byen og Nidelva.", q:"Kristiansten festning" },
  { id:"karasjok", name:"Karasjok", region:"Finnmark", cat:"Kultur", lat:69.47, lng:25.52, fromRoad:"Ved E6 i indre Finnmark, ca. 18 mil fra Alta; god parkering ved Sametinget", hike:"", diff:"", blurb:"Hovedsetet for samisk kultur i Norge, med det arkitektoniske praktbygget Sametinget formet som en lavvo.", q:"Sametinget Karasjok" },
  { id:"risor", name:"Risør", region:"Agder", cat:"By", lat:58.72, lng:9.23, fromRoad:"E18 og av på Fv416 ut til kysten; parkering ved sentrum og havna", hike:"", diff:"", blurb:"«Den hvite by ved Skagerrak» med tette hvite trehus rundt den idylliske indre havna.", q:"Risør" },
  { id:"stiftsgarden", name:"Stiftsgården", region:"Trøndelag", cat:"Kultur", lat:63.43, lng:10.39, fromRoad:"Sentralt i Munkegata i Midtbyen i Trondheim; bruk parkeringshus i nærheten", hike:"", diff:"", blurb:"Nordens største trepalass og kongefamiliens offisielle residens i Trondheim.", q:"Stiftsgården Trondheim" },
  { id:"frammuseet", name:"Frammuseet", region:"Oslo", cat:"Kultur", lat:59.9, lng:10.7, fromRoad:"Kjør ut på Bygdøynes; parkering rett ved museet, ca. 15 min fra sentrum", hike:"", diff:"", blurb:"Her står det ekte polarskipet «Fram» som du kan gå ombord i, fra Nansen og Amundsens ekspedisjoner.", q:"Fram Museum Oslo", cost:"Inngang ca. 140 kr" },
  { id:"kongsberg_solvgruver", name:"Kongsberg Sølvgruver", region:"Buskerud", cat:"Kultur", lat:59.63, lng:9.6, fromRoad:"Besøksgruva ved Saggrenda, ca. 8 km sørvest for Kongsberg langs E134; egen parkering", hike:"", diff:"", blurb:"Et gruvetog frakter deg 2,3 km inn i fjellet i Norges historiske sølvverk, drevet 1623–1958.", q:"Kongsberg Silver Mines", cost:"Gruvetog ca. 210 kr" },
  { id:"domkirkeodden", name:"Domkirkeodden", region:"Innlandet", cat:"Kultur", lat:60.79, lng:11.04, fromRoad:"Ved Mjøsa vest i Hamar, ca. 10 min fra sentrum; museumsparkering på odden", hike:"", diff:"", blurb:"Middelalderens domkirkeruiner er vernet under en spektakulær glasshall ved bredden av Mjøsa.", q:"Hamar Cathedral ruins glass" },
  { id:"kvernesstavkyrkje", name:"Kvernes stavkyrkje", region:"Møre og Romsdal", cat:"Stavkirke", lat:63.01, lng:7.72, fromRoad:"Fv247 på Averøya, ca. 30 min fra Kristiansund; parkering ved kirken", hike:"", diff:"", blurb:"Vakker stavkirke på Averøya med kirkested nevnt allerede rundt 1430, staselig plassert ved fjorden.", q:"Kvernes stave church" },
  { id:"hammerfest", name:"Hammerfest", region:"Finnmark", cat:"By", lat:70.66, lng:23.68, fromRoad:"E6 og Fv94 inn til byen; kort kjøring til Meridianstøtten på Fuglenes", hike:"", diff:"", blurb:"En av verdens nordligste byer, med den UNESCO-listede Meridianstøtten fra Struves meridianbue.", q:"Hammerfest Meridian Column" },
  { id:"grimstad", name:"Grimstad", region:"Agder", cat:"By", lat:58.35, lng:8.54, fromRoad:"E18 og av mot sentrum; parkering nær havna og gågatene", hike:"", diff:"", blurb:"Hvitmalt sørlandsby med trange brosteinsgater der en ung Henrik Ibsen var apotekerlærling.", q:"Grimstad Agder town" },
  { id:"njardarheimr", name:"Njardarheimr", region:"Vestland", cat:"Kultur", lat:60.88, lng:6.84, fromRoad:"E16 gjennom Gudvangen; vikinglandsbyen ligger rett ved fergekaia med parkering", hike:"", diff:"", blurb:"En levende vikinglandsby innerst i Nærøyfjorden der du møter vikinger i full mundur.", q:"Njardarheimr Gudvangen viking", cost:"Inngang ca. 260 kr" },
  { id:"mandal", name:"Mandal", region:"Agder", cat:"By", lat:58.03, lng:7.45, fromRoad:"E39 og av mot sentrum; egen vei og parkering ved Sjøsanden badestrand", hike:"", diff:"", blurb:"Norges sørligste by med hvite trehus og Sjøsanden, en av landets vakreste sandstrender.", q:"Mandal Sjøsanden" },
  { id:"kaupangerstavkyrkje", name:"Kaupanger stavkyrkje", region:"Vestland", cat:"Stavkirke", lat:61.18, lng:7.23, fromRoad:"Rv5 til Kaupanger, ca. 10 km sørøst for Sogndal ved Sognefjorden", hike:"", diff:"", blurb:"Den største stavkirken i gamle Sogn og Fjordane, fra ca. 1140, med hele 22 staver.", q:"Kaupanger stave church" },
  { id:"kautokeino", name:"Kautokeino", region:"Finnmark", cat:"By", lat:69.01, lng:23.04, fromRoad:"Ved E45 på Finnmarksvidda, ca. 13 mil sør for Alta", hike:"", diff:"", blurb:"Det kulturelle hovedsetet for det nordsamiske området, kjent for reindrift og påskefestivalen.", q:"Kautokeino Sami" },
  { id:"roldalstavkyrkje", name:"Røldal stavkyrkje", region:"Vestland", cat:"Stavkirke", lat:59.83, lng:6.82, fromRoad:"Ved E134 i Røldal på Haukelifjell; parkering ved kirken", hike:"", diff:"", blurb:"Middelalderkirke med et undergjørende krusifiks, Norges viktigste pilegrimsmål etter Nidarosdomen.", q:"Roldal stave church" },
  { id:"reinlistavkyrkje", name:"Reinli stavkyrkje", region:"Innlandet", cat:"Stavkirke", lat:60.83, lng:9.49, fromRoad:"Kort, bratt vei opp fra Rv33 i Sør-Aurdal i Valdres; parkering ved kirken", hike:"", diff:"", blurb:"Fint bevart stavkirke fra 1300-tallet, vakkert plassert på en høyde over Valdres.", q:"Reinli stave church" },
  { id:"gamle_bergen", name:"Gamle Bergen", region:"Vestland", cat:"Kultur", lat:60.42, lng:5.31, fromRoad:"E39/Sandviksveien til Nyhavnsveien i Sandviken; parkering ved museet, ca. 5 min fra sentrum", hike:"", diff:"", blurb:"Sjarmerende friluftsmuseum med rundt 50 trehus fra 1700- og 1800-tallet i Sandviken.", q:"Gamle Bergen Museum" },
  { id:"vega", name:"Vegaøyan (Vega)", region:"Nordland", cat:"Kyst", lat:65.68, lng:11.96, fromRoad:"Ferje fra Horn (Brønnøysund) eller Tjøtta til Vega", hike:"", diff:"", blurb:"Vegaøyan er UNESCO-verdensarv kjent for tusenårig ærfugltradisjon og et vakkert øyrike på Helgelandskysten.", q:"Vega archipelago Nordland", cost:"Bilferje t/r ca. 250 kr" },
  { id:"syv_sostre_fjell", name:"De syv søstre (fjell)", region:"Nordland", cat:"Fjelltopp", lat:65.94, lng:12.56, fromRoad:"Bilvei til Sandnessjøen på Alsta, start ved fjellfoten", hike:"8-12 t (hele traversen)", diff:"Krevende", blurb:"En majestetisk fjellrekke med sju tinder som reiser seg rett opp fra havet ved Sandnessjøen.", q:"De syv søstre Alsten mountains Sandnessjøen" },
  { id:"aa_lofoten", name:"Å i Lofoten", region:"Nordland", cat:"Kyst", lat:67.88, lng:12.98, fromRoad:"E10 helt til veis ende i Å, Moskenes", hike:"", diff:"", blurb:"Det idylliske fiskeværet ved enden av E10, med rødt rorbumiljø og tørrfiskhistorie helt ytterst i Lofoten.", q:"Å i Lofoten fishing village" },
  { id:"hornelen", name:"Hornelen", region:"Vestland", cat:"Fjelltopp", lat:61.86, lng:5.25, fromRoad:"Ferje/bilvei til Bremangerlandet, start ved Berle", hike:"4-5 t", diff:"Krevende", blurb:"Nord-Europas høyeste sjøklippe stuper 860 meter rett ned i havet på Bremangerlandet.", q:"Hornelen sea cliff Bremanger" },
  { id:"nyksund", name:"Nyksund", region:"Nordland", cat:"Kyst", lat:69, lng:15.01, fromRoad:"Smal bilvei fra Myre i Vesterålen", hike:"", diff:"", blurb:"Et gjenoppvekket fiskevær i Vesterålen med fargerike sjøhus og den populære Dronningruta-turen.", q:"Nyksund Vesterålen village" },
  { id:"grip", name:"Grip", region:"Møre og Romsdal", cat:"Kyst", lat:63.23, lng:7.6, fromRoad:"Sommerferje fra Kristiansund", hike:"", diff:"", blurb:"Norges minste tidligere kommune, et fargerikt øyvær med stavkirke langt ute i havgapet utenfor Kristiansund.", q:"Grip island Kristiansund", cost:"Sommerferje t/r ca. 300 kr" },
  { id:"ona", name:"Ona fyr", region:"Møre og Romsdal", cat:"Kyst", lat:62.86, lng:6.54, fromRoad:"Ferje fra Småge til Ona", hike:"10 min", diff:"Enkelt", blurb:"Ona fyr troner på det værbitte øysamfunnet Ona og er et av Norges mest fotograferte fyr på Romsdalskysten.", q:"Ona fyr lighthouse" },
  { id:"vaeroy", name:"Værøy", region:"Nordland", cat:"Kyst", lat:67.67, lng:12.67, fromRoad:"Ferje fra Bodø eller Moskenes", hike:"", diff:"", blurb:"En dramatisk fjelløy ytterst i Lofoten med rikt fugleliv og storslåtte turer som Måstadfjellet.", q:"Værøy island Lofoten" },
  { id:"matinden", name:"Måtinden", region:"Nordland", cat:"Fjelltopp", lat:69.24, lng:15.87, fromRoad:"Bilvei til Baugtua mellom Stave og Bleik på Andøya", hike:"1,5-2 t", diff:"Moderat", blurb:"En av Vesterålens flotteste toppturer med utsikt over Bleiks lange hvite strand og havet.", q:"Måtind Andøya hike" },
  { id:"verdens_ende", name:"Verdens ende", region:"Vestfold", cat:"Utsikt", lat:59.06, lng:10.41, fromRoad:"Bilvei helt ut til Verdens ende på Tjøme", hike:"", diff:"", blurb:"Ytterst på Tjøme; kjent for glattskurte svaberg, vippefyret og vid utsikt mot Oslofjordens munning.", q:"Verdens Ende Tjøme" },
  { id:"jomfruland", name:"Jomfruland", region:"Telemark", cat:"Kyst", lat:58.87, lng:9.6, fromRoad:"Ferje fra Kragerø", hike:"", diff:"", blurb:"En flat, frodig idylløy utenfor Kragerø med to fyr, rullesteinstrand og nasjonalpark.", q:"Jomfruland island Kragerø" },
  { id:"ny_hellesund", name:"Ny-Hellesund", region:"Agder", cat:"Kyst", lat:58.05, lng:7.84, fromRoad:"Båt/ferje fra Høllen i Søgne", hike:"", diff:"", blurb:"Et sjarmerende gammelt uthavnsmiljø i skjærgården ved Søgne, rikt på kystkultur og kunstnerhistorie.", q:"Ny-Hellesund Søgne harbour" },
  { id:"krakenes", name:"Kråkenes fyr", region:"Vestland", cat:"Kyst", lat:62.03, lng:4.99, fromRoad:"Bilvei til Kråkenes på Vågsøy", hike:"", diff:"", blurb:"Ligger spektakulært på en klippe mot storhavet, kjent for ville bølger og overnatting i fyret.", q:"Kråkenes fyr lighthouse" },
  { id:"traena", name:"Træna", region:"Nordland", cat:"Kyst", lat:66.51, lng:12.03, fromRoad:"Hurtigbåt/ferje fra Sandnessjøen eller Stokkvågen", hike:"", diff:"", blurb:"Et eldgammelt øysamfunn på polarsirkelen der de spisse Trænstavan-fjellene stiger loddrett opp av havet.", q:"Træna island Trænstaven" },
  { id:"lovund", name:"Lovund", region:"Nordland", cat:"Kyst", lat:66.36, lng:12.34, fromRoad:"Hurtigbåt/ferje fra Stokkvågen", hike:"", diff:"", blurb:"En karakteristisk fjelløy på Helgeland der over 200 000 lundefugler vender tilbake hver 14. april.", q:"Lovund puffin island" },
  { id:"kjeungskjaer", name:"Kjeungskjær fyr", region:"Trøndelag", cat:"Kyst", lat:63.73, lng:9.53, fromRoad:"Båt fra Uthaug i Ørland", hike:"", diff:"", blurb:"Et sjeldent åttekantet rødt fyr som står helt alene på et skjær i havet utenfor Ørland.", q:"Kjeungskjær fyr lighthouse" },
  { id:"bulandet", name:"Bulandet", region:"Vestland", cat:"Kyst", lat:61.29, lng:4.64, fromRoad:"Ferje fra Askvoll, deretter bruforbindelser", hike:"", diff:"", blurb:"Et fargerikt øyrike ytterst mot havet i Askvoll, bundet sammen av broer mellom hundrevis av holmer.", q:"Bulandet island village" },
  { id:"syv_sostre_foss", name:"De syv søstre (foss)", region:"Møre og Romsdal", cat:"Foss", lat:62.1, lng:7.09, fromRoad:"Ses fra fjordcruise Geiranger–Hellesylt eller fra Ørnesvingen utsiktspunkt ved fv63", hike:"", diff:"", blurb:"Norges mest kjente fossefall stuper i sju atskilte stråler ned i Geirangerfjorden.", q:"Seven Sisters waterfall Geirangerfjord" },
  { id:"kjosfossen", name:"Kjosfossen", region:"Vestland", cat:"Foss", lat:60.75, lng:7.14, fromRoad:"Egen togstopp på Flåmsbana mellom Myrdal og Flåm", hike:"", diff:"", blurb:"225 meter høy foss der Flåmsbana stopper og Huldra danser på berget om sommeren.", q:"Kjosfossen Flamsbana waterfall" },
  { id:"vinnufossen", name:"Vinnufossen", region:"Møre og Romsdal", cat:"Foss", lat:62.66, lng:8.67, fromRoad:"Ses fra Rv70 ca. 6 km øst for Sunndalsøra", hike:"", diff:"", blurb:"Med 860 meter total fallhøyde er Vinnufossen Europas høyeste foss.", q:"Vinnufossen Sunndal waterfall" },
  { id:"friaren", name:"Friaren", region:"Møre og Romsdal", cat:"Foss", lat:62.1, lng:7.1, fromRoad:"Ses fra fjordcruise i Geirangerfjorden, rett overfor De syv søstre", hike:"", diff:"", blurb:"Fossen «Friaren» faller 440 meter og frir mot De syv søstre på motsatt fjordside.", q:"Friaren waterfall Geirangerfjord" },
  { id:"ringedalsvatnet", name:"Ringedalsvatnet", region:"Vestland", cat:"Fjord", lat:60.13, lng:6.7, fromRoad:"Bilvei til Skjeggedal/Mågelitopp fra Tyssedal; utgangspunkt for Trolltunga", hike:"", diff:"", blurb:"Den turkise demningssjøen ligger dramatisk under den berømte klippen Trolltunga.", q:"Ringedalsvatnet Trolltunga lake" },
  { id:"rjukanfossen", name:"Rjukanfossen", region:"Telemark", cat:"Foss", lat:59.87, lng:8.48, fromRoad:"Ses fra utsiktspunkt ved Rv37 vest for Rjukan", hike:"", diff:"", blurb:"Den mektige 104 meter høye fossen ga navn til byen Rjukan i Vestfjorddalen.", q:"Rjukanfossen waterfall Telemark" },
  { id:"skykkjedalsfossen", name:"Skykkjedalsfossen", region:"Vestland", cat:"Foss", lat:60.5, lng:7.25, fromRoad:"Ses fra smal fjellvei innerst i Simadalen ved Eidfjord", hike:"", diff:"", blurb:"En av Norges høyeste fosser stuper rundt 300 meter innerst i Simadalen.", q:"Skytjefossen Simadalen Eidfjord waterfall" },
  { id:"stigfossen", name:"Stigfossen", region:"Møre og Romsdal", cat:"Foss", lat:62.46, lng:7.67, fromRoad:"Ses fra svingene og bro på fv63 Trollstigen", hike:"", diff:"", blurb:"Fossen i elva Istra kaster seg 240 meter ned langs de berømte Trollstigsvingene.", q:"Stigfossen Trollstigen waterfall" },
  { id:"oscarshaug", name:"Nedre Oscarshaug", region:"Vestland", cat:"Utsikt", lat:61.51, lng:7.81, fromRoad:"Rasteplass langs fv55 Sognefjellsvegen ved Turtagrø", hike:"", diff:"", blurb:"Fra rasteplassen ser man gjennom en kikkert utover de ville tindene i Hurrungane.", q:"Nedre Oscarshaug Sognefjellet viewpoint Hurrungane" },
  { id:"eikesdalsvatnet", name:"Eikesdalsvatnet", region:"Møre og Romsdal", cat:"Fjord", lat:62.54, lng:8.17, fromRoad:"Bilvei fv191 langs vestsiden av vatnet fra Eresfjord", hike:"", diff:"", blurb:"Den dype innsjøen omkranses av bratte fjell og mates av den kjente Mardalsfossen.", q:"Eikesdalsvatnet lake Norway" },
  { id:"austerdalsbreen", name:"Austerdalsbreen", region:"Vestland", cat:"Bre", lat:61.6, lng:6.98, fromRoad:"Bilvei til Tungestølen i Veitastrond, deretter til fots", hike:"5 t hver vei", diff:"Krevende", blurb:"Brearmen med de mektige isfallene Odinsbreen og Torsbreen regnes som en av verdens vakreste.", q:"Austerdalsbreen glacier Jostedalsbreen" },
  { id:"engabreen", name:"Engabreen", region:"Nordland", cat:"Bre", lat:66.7, lng:13.75, fromRoad:"Båtskyss over Holandsfjorden fra Braset, deretter kort gange", hike:"45 min hver vei", diff:"Moderat", blurb:"Den blå brearmen av Vestre Svartisen faller nesten ned til fjorden ved Holandsfjorden.", q:"Engabreen Svartisen glacier" },
  { id:"oldevatnet", name:"Oldevatnet", region:"Vestland", cat:"Fjord", lat:61.73, lng:6.8, fromRoad:"Bilvei fv724 langs vatnet fra Olden mot Briksdal", hike:"", diff:"", blurb:"Det grønnblå brevatnet speiler fjellene på veien inn mot Briksdalsbreen.", q:"Oldevatnet lake Olden Norway" },
  { id:"bandak", name:"Bandak", region:"Telemark", cat:"Fjord", lat:59.4, lng:8.31, fromRoad:"Bilvei E134/fv38 langs vatnet ved Dalen", hike:"", diff:"", blurb:"Den lange, dype innsjøen er endepunktet for den historiske Telemarkskanalen.", q:"Bandak lake Telemarkskanalen Dalen" },
  { id:"stalheimsfossen", name:"Stalheimsfossen", region:"Vestland", cat:"Foss", lat:60.83, lng:6.69, fromRoad:"Ses fra Stalheim Hotel og gamle Stalheimskleiva ved fv13", hike:"", diff:"", blurb:"Fossen faller 126 meter i det dramatiske Nærøydalen ved Stalheimskleiva.", q:"Stalheimsfossen waterfall Naeroydalen" },
  { id:"stetind", name:"Stetind", region:"Tysfjord", cat:"Fjelltopp", lat:68.17, lng:16.59, fromRoad:"P-plass ved Storelvvatnet, E6 sør for Kjøpsvik", hike:"Krevende klatring / se fra veien", diff:"Krevende", blurb:"Kåret til Norges nasjonalfjell – en gigantisk granittambolt som reiser seg rett opp fra Stefjorden.", q:"Stetind mountain Norway" },
  { id:"store_skagastolstind", name:"Store Skagastølstind", region:"Hurrungane", cat:"Fjelltopp", lat:61.46, lng:7.87, fromRoad:"Ses fra Turtagrø ved Rv55 Sognefjellsvegen", hike:"Krevende klatring / se fra Turtagrø", diff:"Krevende", blurb:"«Storen» er Norges tredje høyeste fjell og selve symbolet på den ville tindeverdenen i Hurrungane.", q:"Store Skagastolstind Hurrungane" },
  { id:"melderskin", name:"Melderskin", region:"Rosendal", cat:"Fjelltopp", lat:60.01, lng:6.08, fromRoad:"Start ved Rosendal, avkjøring fra Fv500 mot Baroniet", hike:"6-8 t t/r", diff:"Krevende", blurb:"Et snødekt, pyramideformet fjell som reiser seg rett bak Baroniet i Rosendal.", q:"Melderskin Rosendal Kvinnherad" },
  { id:"snota", name:"Snota", region:"Trollheimen", cat:"Fjelltopp", lat:62.85, lng:9.09, fromRoad:"Start i Fossådalen/Todalen, avkjøring fra Fv6142", hike:"8-10 t t/r", diff:"Krevende", blurb:"Regnet som den vakreste toppen i Trollheimen med sin markante, elegante fjellform.", q:"Snota Trollheimen mountain" },
  { id:"storsylen", name:"Storsylen", region:"Sylan", cat:"Fjelltopp", lat:63.02, lng:12.2, fromRoad:"Start ved Nedalshytta, veg fra Stugudal", hike:"8-11 t t/r", diff:"Krevende", blurb:"Høyeste tind i Sylan-massivet, kneisende på grensa mellom Norge og Sverige.", q:"Storsylen Sylan Sylene" },
  { id:"keiservarden", name:"Keiservarden", region:"Bodø", cat:"Utsikt", lat:67.31, lng:14.48, fromRoad:"Parkering ved Løpsmarka i Bodø", hike:"1-2 t t/r", diff:"Enkelt", blurb:"Bodøs mest populære utsiktspunkt med panorama over by, hav og Lofotveggen.", q:"Keiservarden Bodo viewpoint" },
  { id:"store_blamann", name:"Store Blåmann", region:"Kvaløya", cat:"Fjelltopp", lat:69.74, lng:18.59, fromRoad:"Start ved Skulsfjord/Sjøtun på Kvaløya, Fv862", hike:"6-8 t t/r", diff:"Krevende", blurb:"Det høyeste og mest markante fjellet på Kvaløya rett utenfor Tromsø.", q:"Store Blamann Kvaloya Tromso" },
  { id:"femundsmarka", name:"Femundsmarka", region:"Engerdal", cat:"Vandring", lat:62.22, lng:12.12, fromRoad:"Innfallsport Elgå ved Femunden (Fv26), Engerdal", hike:"Dagsturer", diff:"Moderat", blurb:"Vill villmark med furuskog, blanke vann og frie moskus- og reinflokker øst for Femunden.", q:"Femundsmarka national park" },
  { id:"reinheimen", name:"Reinheimen", region:"Skjåk", cat:"Vandring", lat:62.17, lng:7.9, fromRoad:"Innfallsport Billingen i Skjåk", hike:"Dagsturer", diff:"Krevende", blurb:"Et av landets villeste og mest urørte fjellområder med storslåtte villreinfjell.", q:"Reinheimen national park Norway" },
  { id:"breheimen", name:"Breheimen", region:"Skjåk", cat:"Vandring", lat:61.8, lng:7.83, fromRoad:"Innfallsport Sota Sæter i Skjåk", hike:"Dagsturer", diff:"Krevende", blurb:"Dramatiske kontraster mellom breer, spisse tinder og dype grønne daler.", q:"Breheimen national park Norway" },
  { id:"rago", name:"Rago", region:"Sørfold", cat:"Vandring", lat:67.43, lng:15.98, fromRoad:"Start ved Lakshola i Sørfold, avkjøring fra E6", hike:"Dagsturer", diff:"Krevende", blurb:"En liten, ruvende villmark med brusende fossefall, kløfter og enorme steinblokker.", q:"Rago national park Sorfold" },
  { id:"borgefjell", name:"Børgefjell", region:"Nordland", cat:"Vandring", lat:65.18, lng:13.9, fromRoad:"Innfallsport Røyrvik eller Namsvatnet (Fv773)", hike:"Dagsturer", diff:"Krevende", blurb:"En stille, lite tilrettelagt villmark kjent for fjellrev og rike fiskevann.", q:"Borgefjell national park" },
  { id:"stabbursdalen", name:"Stabbursdalen", region:"Porsanger", cat:"Vandring", lat:69.98, lng:24.48, fromRoad:"Innfallsport Stabbursnes ved E6, Porsanger", hike:"Dagsturer", diff:"Moderat", blurb:"Rommer verdens nordligste furuskog langs en klar lakseelv i Finnmark.", q:"Stabbursdalen national park pine" },
  { id:"ovre_pasvik", name:"Øvre Pasvik", region:"Sør-Varanger", cat:"Vandring", lat:69.09, lng:28.95, fromRoad:"Innfallsport Vaggatem i Pasvikdalen (Fv885)", hike:"Dagsturer", diff:"Moderat", blurb:"En bit sibirsk taiga med urskog og bjørn helt i grensa mot Russland og Finland.", q:"Ovre Pasvik taiga national park" },
  { id:"fulufjellet", name:"Fulufjellet", region:"Trysil", cat:"Vandring", lat:61.4, lng:12.78, fromRoad:"Innfallsport Ljørdalen i Trysil, avkjøring fra Fv26", hike:"Dagsturer", diff:"Moderat", blurb:"Et rolig platåfjell på svenskegrensa med gammelskog og stille myrlandskap.", q:"Fulufjellet national park" },
];

/* ---- Verktøy ---- */
const stripHtml = (s = "") =>
  s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
   .replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();

const BAD = /(map|kart|diagram|logo|icon|coat[_ ]of[_ ]arms|flag|locator|sign|poster|chart|\bplan\b|panorama_of|schematic|profile|cross[_ ]section)/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* fetch med retry + backoff på rate-limit (429/503) */
async function apiGet(url, tries = 7) {
  let wait = 2000;
  for (let a = 0; a < tries; a++) {
    let res;
    try {
      res = await fetch(url, { headers: { "User-Agent": "NorgesferieTinder/1.0 (personal trip planner)" } });
    } catch (e) {
      await sleep(wait); wait = Math.min(wait * 2, 30000); continue;
    }
    if (res.status === 429 || res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
      const ra = parseInt(res.headers.get("retry-after") || "0", 10);
      await sleep(ra > 0 ? ra * 1000 : wait);
      wait = Math.min(wait * 2, 30000);
      continue;
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }
  throw new Error("gav opp etter gjentatte 429/503");
}

/* Nøkkelord som skal ligge i filnavnet for at bildet er relevant */
const GENERIC = new Set(["stave", "church", "cathedral", "skylift", "fyr", "lofoten", "senja", "gamle", "national", "park"]);
const KEY_OVERRIDE = { atlanterhavsvegen: "Atlanterhavsvegen", telemarkskanalen: "Telemarkskanalen", operahuset: "Operahuset" };

/* Priser på ferje / gondol / bom / billett (ca.-anslag, NOK) for eksisterende steder */
const COST = {
  besseggen: "Båt Gjendesheim–Memurubu ca. 260 kr",
  galdhopiggen: "Guidet breføring fra ca. 800 kr",
  trolltunga: "Parkering P2 ca. 300–600 kr",
  naeroyfjord: "Fjordcruise ca. 500 kr",
  flamsbana: "Tog ca. 650 kr én vei",
  geirangerfjord: "Bilferje/cruise ca. 350–550 kr",
  dalsnibba: "Bomvei ca. 350 kr/bil",
  briksdalsbreen: "Trollbil ca. 220 kr t/r (gratis å gå)",
  loen: "Loen Skylift ca. 640 kr t/r",
  nigardsbreen: "Båt ca. 80 kr + evt. breføring",
  urnes: "Ferje Solvorn–Urnes ca. 150 kr",
  floyen: "Fløibanen ca. 220 kr t/r",
  lysefjord: "Fjordcruise ca. 650 kr",
  florli: "Skyssbåt ca. 300 kr",
  preikestolen: "Parkering ca. 250 kr/bil",
  kjerag: "Parkering ca. 300 kr/bil",
  nordkapp: "Nordkapphallen ca. 385 kr/pers",
  svartisen: "Båt over fjorden ca. 200 kr t/r",
  gaustatoppen: "Gaustabanen ca. 320 kr t/r (gratis å gå)",
  runde: "Fuglesafari fra ca. 550 kr (gratis å gå)",
  hjorundfjord: "Ferje bil ca. 150 kr",
};

/* Finpuss for tvetydige navn: bedre søk + unngå/krev-ord (skanne mot feil motiv/navnesøsken) */
const REFINE = {
  snohetta:     { q: "Snøhetta Dovrefjell mountain", need: ["dovrefjell","fjell","mountain","viewpoint","snøheim","snoheim","peak","hytta","norway","reinheim"], avoid: /office|lascaux|studio|architect|interior|interiør|pavilion|building|firm|kontor|thorsen|kjetil|plaza|grounds|exterior|showing/i },
  runde:        { q: "Runde island Norway seabird", need: ["norway","norge","herøy","heroy","island","øy ","fyr","puffin","lunde","fugl","bird","seabird","cliff","runde,"], avoid: /grabstein|konsum|mitropa|veenpark|bargerveen|osterode|leder|umschlag|briefum|harz|wegweiser|weinzierl|leonfelden|österreich|austria/i },
  alta:         { q: "Alta Norway rock carvings Finnmark", need: ["norway","norge","finnmark","nordlys","helleristning","rock","carving","hjemmeluft","kåfjord","kafjord","bossekop","alta museum","altafjord"], avoid: /palma|tarragona|gracia|cruz|plaza|terra alta|suíno|suino|brasil|argentin|españa|espana|italia|bolivia|méxico|mexico|chile|perú|peru/i },
  reine:        { q: "Reine Lofoten Moskenes Norway", need: ["lofoten","moskenes","nordland","norway","norge","gravdal"], avoid: /chambéry|chambery|sainte-reine|bourg|élisabeth|elisabeth|france|paris|bièvre|bievre|québec|quebec/i },
  narvik:       { q: "Narvikfjellet Ofotfjord view", need: ["fjell","fjord","ofot","gondol","utsikt","view","panorama","mountain","narvikfjellet","skisenter","rombak","harbour","havn"], avoid: /kulturskole|teater|soldatenheim|1942|1948|2003|2004|damene|skole/i },
  kristiansand: { q: "Kristiansand Posebyen Norway", need: ["posebyen","kvadratur","markens","strand","gamle","torv","havn","harbour","street","fisketorv","otterdal","christiansand"], avoid: /fähre|faehre|ferry|hirtshals|1941|trafikkuhell/i },
  holmenkollen: { q: "Holmenkollbakken ski jump Oslo", key: "Holmenkoll", need: ["ski jump","hoppbakke","holmenkollbakken","stadion","stadium","arena","panorama","view","jump","2010","2011","2014","2015","2016","2018","2019","2022"], avoid: /1894|1896|1900|1905|1910|1914|1920|1923|1928|1931|1933|sportstue|kirche|kirke|chapel/i },
  molde:        { q: "Molde panorama Romsdalen Norway", need: ["panorama","romsdal","varden","utsikt","view","fjord","tinder","mountains","moldepanorama","reknes"], avoid: /cathedral|kirke|rådstue|radstue|1841|1872|1888|hotel|jazz|fähre|rådhus/i },
  lom:          { q: "Lom stave church Norway", need: ["stavkyrkje","stavkirke","stave","kommune","innlandet","norway","norge","bøverdalen","boverdalen","prestbrua"], avoid: /allt lom|quarry|geograph|wales|cymru|salom/i },
  fredrikstad:  { q: "Gamlebyen Fredrikstad fortress old town", need: ["gamlebyen","festning","vollgrav","old town","fortress","brygge","kongsten","provian","tøihus","toihus"], avoid: /1814|1915|friidrett|attacken|1973|\bbru\b/i },
  andoya:       { q: "Andenes Andøya Vesterålen Norway", need: ["norway","norge","andøy","andoy","vesterålen","vesteralen","hval","whale","fyr","andenes,","bleik","lighthouse","sea"], avoid: /orihuela|estación|estacion|españa|espana|alicante|renfe|kirke|kirche|church/i },

  // Utvidelse 2 – tvetydige navn
  skala:        { q: "Skåla Loen Nordfjord", key: "Skåla", need: ["loen","nordfjord","skåla","skålatårn","skalatarn","lodalen","norway","tind","hytte"], avoid: /balance|weigh|libra|recipe|zodiac|physics/i },
  slogen:       { q: "Slogen Sunnmøre Norway", need: ["sunnmøre","norang","øye","urke","hjørund","norway","tind","slogen"] },
  bleik:        { q: "Bleik Andøya Vesterålen", need: ["andøy","andoy","vesterålen","vesteralen","bleiksøy","nordland","norway","lofoten","strand"], avoid: /anemia|bleach/i },
  ersfjord_senja: { q: "Ersfjordstranda Senja beach", key: "Ersfjord", need: ["senja","mefjord","troms","norway","ersfjordstranda","strand","beach"], avoid: /toilet|toalett|\bwc\b|dass|hattholla/i },
  vestkapp:     { q: "Vestkapp Stad Norway", need: ["stad","kråkenes","krakenes","vågsøy","vagsoy","selje","måløy","maloy","norway","kjerringa"] },
  sommaroy:     { q: "Sommarøy Troms Norway", key: "Sommarøy", need: ["troms","tromsø","tromso","hillesøy","brensholmen","norway"] },
  orrestranda:  { q: "Orrestranda", key: "Orrestranda", avoid: /les orres|église|eglise|chapelle|embrun|hautes-alpes|france|paul/i },
  akershus:     { q: "Akershus Fortress Oslo", need: ["fortress","festning","castle","slott","oslo"], avoid: /fylke|county|universitetssykehus|\bahus\b|map|kart|lokomotiv|landeveis/i },
  fargegata:    { q: "Fargegata Øvre Holmegate Stavanger", key: "Holmegate", need: ["stavanger","fargegata","rogaland"], avoid: /geograph|farm|rural|gateway|\bfield\b|england|kingdom|yorkshire/i },
  rosendal:     { q: "Baroniet Rosendal Kvinnherad", need: ["baroniet","rosendal","kvinnherad","hardanger","folgefonna","norway"], avoid: /danmark|denmark|sverige|sweden|stockholm|djurgård/i },
  unstad:       { q: "Unstad Lofoten surf", need: ["lofoten","vestvågøy","vestvagoy","unstad","norway","surf","strand"] },
  kristiansund: { q: "Kristiansund Nordmøre Norway", need: ["kristiansund","nordmøre","nordmore","møre","norway","grip"], avoid: /kristiansand|agder|dyreparken/i },
  bodo:         { q: "Bodø Nordland Norway", need: ["bodø","bodo","nordland","norway","saltstraumen","rønvik","kjerringøy"], avoid: /glimt|fotball|football|aspmyra|håndball/i },
  lyngenalpene: { q: "Lyngen Alps Troms Norway", key: "Lyngen", need: ["lyngen","troms","norway","alps","alpene","fjord","tind"] },
  strynefjellsvegen: { q: "Gamle Strynefjellsvegen Norway", need: ["stryn","strynefjell","videseter","grotli","norway","turistveg","fjellovergang"] },
  hardangerfjord: { q: "Hardangerfjord Norway landscape", avoid: /tidemand|gude|brudeferd|bridal|procession|painting|maleri|holmlund|likferd|dahl|hesselberg|184\d|185\d|186\d/i },
  sognefjord:   { q: "Sognefjord Norway landscape", avoid: /tidemand|gude|holmlund|likferd|dahl|painting|maleri|motiv\s|184\d|185\d|186\d/i },
  rampestreken: { q: "Nesaksla Åndalsnes Romsdalsgondolen", key: "Nesaksla", need: ["nesaksla","rampestreken","romsdal","åndalsnes","andalsnes","trollstigen","rauma"], avoid: /garde|konsert|torg|havnegata|kollektiv|terminal/i },
  dovrefjell:   { q: "Dovrefjell moskus musk ox", avoid: /snøhetta|snohetta|cocoon|spinner|eriogaster|dwarf birch|\barmy\b|txu-pclmaps|oclc|\bmap\b|lokomotiv|dovrebanen|orenstein|jernbanemus|191\d/i },
  trollstigen:  { avoid: /nesaksla/i },   // unngå delt bilde med rampestreken-kortet
  jostedalsbreen: { avoid: /fannaråken|fanaraken|fannaraken/i }, // unngå delt bilde med fanaraken-kortet
  // --- Utvidelse 3: nye tvetydige/generiske navn ---
  grip: { q:"Grip Kristiansund fyr", key:"Grip", need:["kristiansund","nordmøre","nordmore","gripstua","gripværing","harbour","northside","fyr","lighthouse","stavkirke","fiskevær","power station","bebyggelse"], avoid:/handgrip|grip strength|clamp|tripod|gaffer|screenshot|\blogo\b|wrestling|climbing|guitar|firearm|yukon|1928|\bfilm\b|milk churn|geograph|finger grip|line grip|met vs|wales|cymru/i },
  ona: { q:"Ona fyr Sandøy", key:"Ona", need:["sandøy","sandoy","fyr","lighthouse","fyrtårn","møre","romsdal","nordøy","nordoy","betjentbolig","nordøyane","nordøyene"], avoid:/munson|gable|mediterrania|eilean|beshariq|uzbek|vechten|watling|torrent|llibreria|isla de ona|catalan|scotland|geograph|arizona|barcelona|girona|verona|corona/i },
  friaren: { q:"Friaren waterfall Geirangerfjord", key:"Friar", need:["friaren","geiranger","sunnylv","fjord","waterfall","foss","norway"], avoid:/monk|painting|maleri|chess|\btuck\b/i },
  rago: { q:"Rago national park Sørfold Nordland Norway", key:"Rago", need:["sørfold","sorfold","nordland","national park","nasjonalpark","storskogdal","litlverivass","lakshola","peaks","storefjell","norway","norge"], avoid:/\blogo\b|chicago|drago|virago|ragondin|pogrzeb|major|stefa|polski|poland|balangun|indonesia|luzon|philippines/i },
  vega: { q:"Vega Nordland Norway", key:"Vega", need:["nordland","helgeland","norway","norge","vegaøy","vegaoy","eidem","bremstein","brønnøy","bronnoy","tjøtta","gardsøy","ærfugl","verdensarv"], avoid:/las vegas|vega star|stephen rahn|astronom|aircraft|lockheed|suzuki|chevrolet|\bopel\b|facel|\bsega\b|vegan|sports car|lyra|liebana|felguera|surquillo|españa|espana|mercado|\bmarket\b/i },
  verdens_ende: { q:"Verdens Ende Tjøme Færder", key:"Verdens", need:["tjøme","tjome","færder","farder","verdens ende","vestfold","vippefyr","norway"], avoid:/game of thrones|jules verne|\bfilm\b|album|\bkart\b/i },
  karasjok: { q:"Sametinget Karasjok", key:"Sametinget", need:["karasjok","sametinget","sami parliament","norway"], avoid:/kiruna|sverige|sweden|svenska|finland|suomi|inari|östersund/i },
  frammuseet: { q:"Fram Museum polar ship Oslo", key:"Fram", need:["frammuseet","fram museum","polarship","polar ship","nansen","amundsen","bygdøy","bygdoy","gjøa","polarskip"], avoid:/\bframe\b|framework|instagram|wireframe|framing|timeframe|mainframe/i },
  gamle_bergen: { q:"Gamle Bergen Museum Sandviken", key:"Gamle Bergen", need:["gamle bergen","sandviken","friluftsmuseum","open air","wooden house"], avoid:/\bkart\b|\bmap\b/i },
  domkirkeodden: { q:"Hamar Cathedral ruins Domkirkeodden", key:"Hamar", need:["domkirkeodden","hamar cathedral","domkirke","katedral","ruin","vernebygg","glass","mjøsa"], avoid:/olympic|vikingskipet|amfi|stadion|ishall|storhamar/i },
  kongsberg_solvgruver: { q:"Kongensgruve Kongsberg sølvgruver bergverk", key:"Kongensgruve", need:["kongensgruve","kongsberg","gruve","sølvverk"], avoid:/flintoe|painting|maleri|national museum|nasjonalmus|mineral|calcite|harvard|specimen|crystal|krystall|kirke|church/i },
  stiftsgarden: { q:"Stiftsgården Trondheim", key:"Stiftsgården", need:["stiftsgården","stiftsgarden","trondheim","munkegata"], avoid:/oslo|molde|kristiansand/i },
  store_skagastolstind: { q:"Store Skagastolstind Hurrungane", key:"Skagast", need:["skagastøl","skagastol","storen","hurrungane","turtagrø","turtagro","norway","tind"], avoid:/hotel room|interior/i },
  store_blamann: { q:"Store Blamann Kvaloya Tromso", key:"Blåmann", need:["blåmann","blamann","kvaløy","kvaloy","tromsø","tromso","troms","norway"], avoid:/\bsau\b|sheep|interior/i },
  syv_sostre_foss: { q:"Seven Sisters waterfall Geirangerfjord", key:"Sisters", need:["geiranger","seven sisters","sju søstre","syv søstre","knivsflå","knivsfla","waterfall","fjord"], avoid:/oregon|washington|australia|katoomba|three sisters|sussex|\bengland\b|scotland|montana|glacier national/i },
  syv_sostre_fjell: { q:"De syv søstre Alsten Sandnessjøen", key:"søstre", need:["alsten","alstahaug","sandnessjøen","sandnessjoen","syv søstre","sju søstre","de syv","de sju","helgeland","mountain","fjell"], avoid:/waterfall|fossen|geiranger|\bengland\b|sussex|australia|oregon/i },
  oscarshaug: { q:"Nedre Oscarshaug Sognefjellet Hurrungane", key:"Oscarshaug", need:["oscarshaug","sognefjell","hurrungane","turtagrø","turtagro","utsikt","viewpoint"], avoid:/oslo|stockholm/i },
  matinden: { q:"Matinden Andoya Bleik", key:"Måtind", need:["måtind","matind","andøy","andoy","bleik","vesterålen","vesteralen","norway"], avoid:/matinee|matinée/i },
  ovre_pasvik: { q:"Øvre Pasvik national park taiga", key:"Pasvik", need:["pasvik","finnmark","taiga","national park","nasjonalpark","varanger","urskog"], avoid:/kola|russia|russland|murmansk/i },
  mandal: { q:"Mandal Vest-Agder", key:"Mandal", need:["vest-agder","agder","riksantikvaren","sjøsanden","sjosanden","lindesnes","skagestad","mandal kirke","risøbank","uleberg","norway"], avoid:/ovoo|mongol|gobi|pune|bharat|itihas|sanshodhak|\bindia\b|maharashtra|kesari|kolkata/i },
  aa_lofoten: { q:"Å i Lofoten Moskenes rorbuer", key:"Å i Lofoten", need:["å i lofoten","aa i lofoten","moskenes","lofoten","rorbu","tørrfisk","stockfish"], avoid:/reine|hamnøy|sakrisøy|nusfjord|henningsvær/i },
  // --- Utvidelse 3b: rettelser etter første henting ---
  ekkeroy: { q:"Ekkerøy Varanger Finnmark fuglefjell", key:"Ekkerøy", avoid:/butte|canyonlands|green river|utah|colorado|elaterite|evert|cornelis|geograph/i },
  geirangerfjord: { avoid:/ørnesving|ornesving/i },   // unngå delt bilde med ornesvingen-kortet
  svartisen: { avoid:/engabreen|\benga\b/i },          // unngå delt bilde med engabreen-kortet
  kaupangerstavkyrkje: { q:"Kaupanger stave church Sogn", key:"Kaupanger", need:["kaupanger","sogndal","sogn","stavkyrkje","stavkirke","stave"], avoid:/ringebu|jernbanegata|gudbrandsdal|hedmark|innlandet/i },
  ringebu: { q:"Ringebu stavkyrkje", key:"Ringebu", need:["ringebu","stavkyrkje","stavkirke","stave","gudbrandsdal"], avoid:/jernbanegata|kaupanger/i },
};
function titleKey(place) {
  if (KEY_OVERRIDE[place.id]) return KEY_OVERRIDE[place.id];
  const words = place.q.split(/\s+/).filter(w => !GENERIC.has(w.toLowerCase()));
  return words[0] || place.q;
}

async function searchFiles(gsrsearch) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query", format: "json", generator: "search",
    gsrsearch, gsrnamespace: "6", gsrlimit: "40",
    prop: "imageinfo", iiprop: "url|mime|size|extmetadata", iiurlwidth: "1200",
  });
  const data = await apiGet(url);
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  return pages;
}

function usable(pages, key, opts = {}) {
  const { requireKey = true, avoid = null, need = null } = opts;
  const pick = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (ii.mime !== "image/jpeg") continue;
    if ((ii.width || 0) < 900) continue;
    const title = p.title || "";
    const tl = title.toLowerCase();
    if (BAD.test(title)) continue;
    if (avoid && avoid.test(tl)) continue;                       // dropp uønskede motiver / navnesøsken
    if (requireKey && !tl.includes(key.toLowerCase())) continue; // navnet må stå i tittelen
    if (need && !need.some(t => tl.includes(t))) continue;       // minst ett «riktig-sted»-ord
    const meta = ii.extmetadata || {};
    pick.push({
      src: ii.thumburl || ii.url,
      credit: stripHtml(meta.Artist?.value || "").slice(0, 60) || "Wikimedia Commons",
      license: stripHtml(meta.LicenseShortName?.value || ""),
      landscape: (ii.width || 0) >= (ii.height || 1),
    });
  }
  return pick;
}

async function fetchImages(term, key, opts = {}) {
  const { limit = 8, avoid = null, need = null } = opts;
  const merge = (into, more) => {
    const seen = new Set(into.map(i => i.src));
    for (const m of more) if (!seen.has(m.src)) into.push(m);
    return into;
  };
  // 1) Presist: navnet i tittelen (+ evt. unngå/krev-filter)
  let pick = usable(await searchFiles("intitle:" + key), key, { requireKey: true, avoid, need });
  if (pick.length < limit) {
    const broad = await searchFiles(term);
    // 2) Bredt søk, fortsatt navn + filter
    merge(pick, usable(broad, key, { requireKey: true, avoid, need }));
    // 3) Slakk «krev»-ordet, men behold navn + unngå
    if (need && pick.length < limit) merge(pick, usable(broad, key, { requireKey: true, avoid, need: null }));
    // 4) Siste utvei: uten navnkrav, men fremdeles unngå-filter
    if (pick.length < 2) merge(pick, usable(broad, key, { requireKey: false, avoid, need: null }));
  }
  pick.sort((a, b) => (b.landscape ? 1 : 0) - (a.landscape ? 1 : 0)); // landskap først
  return pick.slice(0, limit);
}

/* ---- Gjenoppta fra eksisterende places.js ---- */
let out = [];
if (existsSync(OUT)) {
  try {
    const m = readFileSync(OUT, "utf8").match(/window\.PLACES\s*=\s*(\[[\s\S]*\]);/);
    if (m) out = JSON.parse(m[1]);
  } catch {}
}
const doneIds = new Set(out.map(d => d.id));
const order = new Map(PLACES.map((p, i) => [p.id, i]));

function save() {
  out.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  const banner = "/* Auto-generert av scripts/fetch-images.mjs – ikke rediger for hånd.\n" +
    `   ${out.length} reisemål, bilder fra Wikimedia Commons. */\n`;
  writeFileSync(OUT, banner + "window.PLACES = " + JSON.stringify(out, null, 2) + ";\n");
}

/* ---- Kjør ---- */
const warnings = [];
for (const place of PLACES) {
  if (doneIds.has(place.id)) { process.stdout.write(`· ${place.name} (finnes)\n`); continue; }
  let imgs = [];
  try {
    const refine = REFINE[place.id] || {};
    imgs = await fetchImages(refine.q || place.q, refine.key || titleKey(place), { limit: 8, avoid: refine.avoid || null, need: refine.need || null });
  } catch (e) {
    warnings.push(`${place.id}: FEIL ${e.message}`);
  }
  if (imgs.length === 0) { warnings.push(`${place.id}: ingen bilder – hoppet over`); continue; }
  if (imgs.length < 2) warnings.push(`${place.id}: bare ${imgs.length} bilde`);
  const { q, ...rest } = place;
  if (COST[place.id] && !rest.cost) rest.cost = COST[place.id];
  out.push({ ...rest, images: imgs });
  doneIds.add(place.id);
  save(); // lagre etter hvert sted, så vi aldri mister framgang
  process.stdout.write(`✓ ${place.name} (${imgs.length})\n`);
  await sleep(700); // roligere tempo mot API-et
}
save();

console.log(`\nSkrev ${out.length} steder til places.js`);
if (warnings.length) console.log("Merknader:\n - " + warnings.join("\n - "));
