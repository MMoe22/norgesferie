/* =========================================================================
   Norgesferie 2026 — data + interaktivitet
   ========================================================================= */

/* ---------- Farger pr. kategori (for kart + kort) ---------- */
const CAT = {
  Fjord:    { color: "#2a9d8f", icon: "🌊" },
  Utsikt:   { color: "#3a86ff", icon: "🏔" },
  Foss:     { color: "#48cae4", icon: "💧" },
  Kjøretur: { color: "#e76f51", icon: "🚗" },
  Vandring: { color: "#588157", icon: "🥾" },
  Kultur:   { color: "#9d4edd", icon: "🏛" },
  Mat:      { color: "#e7b34c", icon: "🍽" },
};

/* ---------- Severdigheter langs ruten ---------- */
const POIS = [
  { name: "Hardangervidda", cat: "Kjøretur", tags: ["Kjøretur", "Utsikt"], day: 1, lat: 60.402, lng: 7.45,
    desc: "Norges største fjellvidde. RV7 tar dere over et månelandskap av vann, snøflekker og villrein — en opplevelse i seg selv." },
  { name: "Vøringsfossen", cat: "Foss", tags: ["Foss", "Utsikt"], day: 1, lat: 60.4262, lng: 7.253,
    desc: "182 m høyt fossefall i Måbødalen. Gå ut på den nye gangbrua (99 trinn) rett over stupet — svimlende og trygt." },
  { name: "Eidfjord", cat: "Fjord", tags: ["Fjord"], day: 1, lat: 60.4676, lng: 7.0722,
    desc: "Koselig fjordbygd innerst i Hardangerfjorden — flott første overnatting etter viddeturen." },
  { name: "Lofthus & fruktbygdene", cat: "Mat", tags: ["Mat", "Fjord"], day: 2, lat: 60.3269, lng: 6.6608,
    desc: "Eple- og morellbygder langs Sørfjorden. Smak lokal sider på et gårdsutsalg — Hardanger er Norges frukthage." },
  { name: "Trolltunga", cat: "Vandring", tags: ["Vandring", "Utsikt"], day: 2, lat: 60.1241, lng: 6.7399,
    desc: "Norges mest ikoniske klippehylle, 700 m over Ringedalsvatnet. Krevende: 10–12 t t/r — start grytidlig, eller ta korttur." },
  { name: "Odda", cat: "Fjord", tags: ["Fjord"], day: 2, lat: 60.070, lng: 6.545,
    desc: "Industri- og fjordby innerst i Sørfjorden, portalen til Trolltunga og Folgefonna-breen." },
  { name: "Stegastein", cat: "Utsikt", tags: ["Utsikt", "Kjøretur"], day: 3, lat: 60.9033, lng: 7.227,
    desc: "Prisbelønt utsiktsplattform 650 m over Aurlandsfjorden — stikker 30 m rett ut i lufta. 20 min fra Flåm." },
  { name: "Flåmsbana", cat: "Kultur", tags: ["Kultur", "Kjøretur"], day: 3, lat: 60.8631, lng: 7.1134,
    desc: "En av verdens vakreste togturer — bratt ned fjellsiden forbi fossen Kjosfossen. Perfekt om dere vil hvile beina." },
  { name: "Nærøyfjorden", cat: "Fjord", tags: ["Fjord"], day: 3, lat: 60.876, lng: 6.842,
    desc: "UNESCO-fjord og en av verdens smaleste — bare 250 m på det trangeste. Ta cruise fra Flåm til Gudvangen." },
  { name: "Sognefjellet", cat: "Kjøretur", tags: ["Kjøretur", "Utsikt"], day: 4, lat: 61.567, lng: 8.04,
    desc: "Nord-Europas høyeste fjellovergang (1 434 moh). Snøkantene kan stå meterhøye selv i juli — magisk kjøretur." },
  { name: "Geirangerfjorden", cat: "Fjord", tags: ["Fjord", "Utsikt"], day: 5, lat: 62.101, lng: 7.206,
    desc: "Selveste postkort-fjorden (UNESCO), med fossene De syv søstre. Ta fjordcruise eller kjør Ørnevegen ned." },
  { name: "Dalsnibba", cat: "Utsikt", tags: ["Utsikt"], day: 5, lat: 62.043, lng: 7.277,
    desc: "Utsiktsplatå 1 500 moh med panorama rett ned på Geirangerfjorden. Bomvei helt opp — ingen fottur nødvendig." },
  { name: "Ørnevegen", cat: "Kjøretur", tags: ["Kjøretur"], day: 5, lat: 62.123, lng: 7.197,
    desc: "11 hårnålssvinger ned til Geiranger med stopp på Ørnesvingen — den klassiske fjordutsikten." },
  { name: "Trollstigen", cat: "Kjøretur", tags: ["Kjøretur", "Utsikt"], day: 5, lat: 62.4574, lng: 7.671,
    desc: "Dramatisk serpentinvei med 11 svinger opp fjellsiden. Åpnet igjen i 2026 — sjekk dagsstatus før dere kjører." },
  { name: "Lom stavkyrkje", cat: "Kultur", tags: ["Kultur"], day: 6, lat: 61.8386, lng: 8.5669,
    desc: "Praktfull middelalder-stavkirke fra 1100-tallet. Stopp gjerne på Bakeriet i Lom rett ved — landskjent." },
  { name: "Jotunheimen", cat: "Vandring", tags: ["Vandring", "Utsikt"], day: 6, lat: 61.636, lng: 8.313,
    desc: "«Jotnenes hjem» med Norges høyeste topper, bl.a. Galdhøpiggen (2 469 moh). Enkle dagsturer til krevende toppturer." },
  { name: "Rondane", cat: "Vandring", tags: ["Vandring"], day: 7, lat: 61.92, lng: 9.80,
    desc: "Norges første nasjonalpark — myke fjellrygger og lys reinlav. Fine, rolige turer på vei hjemover." },
];

/* ---------- Spektakulær overnatting ---------- */
const STAYS = [
  {
    name: "Juvet Landskapshotell", place: "Valldal / Gudbrandsjuvet", night: "Natt 4 · Sunnmøre",
    lat: 62.234, lng: 7.303,
    desc: "Frittstående glasshytter på stylter over et stryk, med prisvinnende arkitektur. Kjent fra filmen «Ex Machina» — natur og design i ett.",
    why: "Det mest arkitektoniske alternativet. Åpent feb–nov; i helg må hele fre–søn bookes.",
    price: "Design · book tidlig", url: "https://juvet.com/en",
  },
  {
    name: "Woodnest trehytter", place: "Odda · Hardangerfjord", night: "Natt 2 · Hardanger",
    lat: 60.095, lng: 6.56,
    desc: "Arkitekttegnede trehytter hengt 5–6 m opp i levende furutrær, med panoramavindu mot fjorden. 20 min gåtur opp gjennom skogen.",
    why: "Perfekt om dere vil sove i tretoppene tidlig i turen, ved Trolltunga-området.",
    price: "Unikt · to hytter", url: "https://www.roomandwild.com/room-trees-norway",
  },
  {
    name: "Kviknes Hotel", place: "Balestrand · Sognefjorden", night: "Natt 3 · Sogn",
    lat: 61.210, lng: 6.534,
    desc: "Et hvitt «treslott» i sveitserstil rett ved Sognefjorden, drevet av samme familie siden 1877. Nasjonalromantisk kunst og storslått spisesal.",
    why: "Historisk fjordperle midtveis — nyoppussede suiter fra våren 2026.",
    price: "Historisk · fjordutsikt", url: "https://en.kviknes.no/",
  },
  {
    name: "Walaker Hotell", place: "Solvorn · Sognefjorden", night: "Natt 3 · Sogn",
    lat: 61.298, lng: 7.056,
    desc: "Norges eldste hotell (fra 1640), lite og familiedrevet, rett ved vannkanten i idylliske Solvorn. Prisbelønt kjøkken og hage.",
    why: "Intimt og personlig — for dere som vil ha ro og god mat framfor stort hotell.",
    price: "Sjarm · få rom", url: "https://www.booking.com/searchresults.html?ss=Walaker%20Hotell%20Solvorn",
  },
  {
    name: "Hotel Union Øye", place: "Norangsfjord · Sunnmøre", night: "Natt 4 · Sunnmøre",
    lat: 62.234, lng: 6.798,
    desc: "Romantisk trehotell fra 1891 innerst i den ville Norangsfjorden, mellom Hjørundfjord og Geiranger. Antikke rom og sagnomsust stemning.",
    why: "Eventyrlig og avsides — for den store, romantiske natten.",
    price: "Historisk · romantisk", url: "https://www.booking.com/searchresults.html?ss=Hotel%20Union%20%C3%98ye",
  },
  {
    name: "Storfjord Hotel", place: "Ved Ålesund · Storfjorden", night: "Natt 4 · Sunnmøre",
    lat: 62.45, lng: 6.70,
    desc: "Eksklusivt håndlaftet tømmerhotell høyt over Storfjorden, med saueskinn, peis og panoramautsikt. Rolig luksus i landlige omgivelser.",
    why: "Lun luksus med utsikt — fin base om dere også vil innom Ålesund.",
    price: "Luksus · panorama", url: "https://www.booking.com/searchresults.html?ss=Storfjord%20Hotel%20%C3%85lesund",
  },
];

/* ---------- Dag-for-dag ---------- */
const DAYS = [
  { n: 1, date: "Man 6. juli", drive: "≈ 230 km · 3–4 t",
    title: "Kongsberg → Hardangervidda → Eidfjord",
    text: "Start tidlig og kjør RV7 opp på Hardangervidda. Stopp ved Vøringsfossen og gå ut på den nye gangbrua rett over det 182 m høye fossefallet, før dere ruller ned Måbødalen til fjorden.",
    stops: ["Hardangervidda", "Vøringsfossen", "Eidfjord"], sleep: "Eidfjord / Hardanger" },
  { n: 2, date: "Tir 7. juli", drive: "≈ 90 km + aktiviteter",
    title: "Hardangerfjorden — frukt, foss og Trolltunga",
    text: "Langs Sørfjorden gjennom fruktbygdene Lofthus og Ullensvang — smak lokal sider! Sprek? Trolltunga er en av Norges mest ikoniske vandringer (sett av 10–12 t, start grytidlig). Roligere dag: korte turer og fjordkos.",
    stops: ["Lofthus", "Odda", "Trolltunga (valgfritt)"], sleep: "Odda / Ullensvang — vurdér Woodnest trehytter" },
  { n: 3, date: "Ons 8. juli", drive: "≈ 200 km + ferje",
    title: "Over til Sognefjorden — Stegastein & Flåm",
    text: "Nordover mot Sognefjorden. Kjør opp til Stegastein, 650 m over Aurlandsfjorden. Ta Flåmsbana eller et cruise inn i Nærøyfjorden (UNESCO, verdens smaleste fjord).",
    stops: ["Stegastein", "Aurland", "Flåm", "Nærøyfjorden"], sleep: "Aurland / Balestrand / Solvorn — historiske fjordhoteller" },
  { n: 4, date: "Tor 9. juli", drive: "≈ 220 km + ferje", star: true,
    title: "★ Spektakulær natt i fjordriket",
    text: "Etappen tar dere mot Sunnmøre og Geiranger-regionen. Dette er natten dere unner dere noe helt spesielt — se de kuraterte overnattingsstedene under og book i god tid.",
    stops: ["Sognefjellet (valgfritt)", "Valldal / Norangsfjord"], sleep: "★ Juvet · Hotel Union Øye · Storfjord Hotel" },
  { n: 5, date: "Fre 10. juli", drive: "≈ 150 km",
    title: "Geirangerfjorden, Dalsnibba & Trollstigen",
    text: "Gulldagen: Ørnevegen ned til Geiranger, båttur forbi De syv søstre, og opp til Dalsnibba (1 500 moh). Kjør den nyåpnede Trollstigen med sine 11 hårnålssvinger ned til Åndalsnes.",
    stops: ["Geiranger", "Dalsnibba", "Trollstigen"], sleep: "Åndalsnes / Geiranger" },
  { n: 6, date: "Lør 11. juli", drive: "≈ 250 km",
    title: "Hjemover gjennom fjellheimen",
    text: "Sett kursen østover. Velg Sognefjellet (Nord-Europas høyeste fjellovergang) eller Gudbrandsdalen. Stopp ved Lom stavkyrkje og bakeriet. Jotunheimen og Rondane frister med fjellturer.",
    stops: ["Lom", "Jotunheimen", "Rondane"], sleep: "Lom / Otta / Rondane" },
  { n: 7, date: "Søn 12. juli", drive: "≈ 300 km",
    title: "Rondane / Gudbrandsdalen → Kongsberg",
    text: "Siste etappe hjem gjennom Gudbrandsdalen og Valdres. Ta en siste fjelltur eller et bad i en innsjø før dere ruller inn i Kongsberg — mette på inntrykk.",
    stops: ["Valdres", "Kongsberg"], sleep: "Hjemme igjen 🏡" },
];

/* ---------- Praktisk info ---------- */
const INFO = [
  { icon: "🚗", title: "Bom & ferje (AutoPASS)", text: "Registrér bilen og skaff AutoPASS-ferjekort før avreise — da går bom og ferje automatisk, ofte rimeligere. Flere fjordkryssinger på ruten." },
  { icon: "⛴", title: "Ferjekø i juli", text: "Juli er høysesong. Kom i god tid til ferjeleiet, særlig morgen og ettermiddag. Sjekk ruter på vegvesen.no eller Fjord1/Norled-appene." },
  { icon: "🌦", title: "Vær & klær", text: "Vestlandssommer svinger fra 12–22 °C. Ta med lag på lag, regntøy og gode sko. Følg yr.no — fjellet kan ha helt eget vær." },
  { icon: "🏔", title: "Fjelloverganger", text: "RV7, Sognefjellet og Trollstigen er åpne om sommeren, men kan ha snøkanter og kortvarige stengninger ved uvær. Sjekk status samme dag." },
  { icon: "🥾", title: "Vandring trygt", text: "Til Trolltunga: start før kl. 08, ta med mat, vann og varme klær, snu i tide. Sjekk værvarsel — turen er 10–12 timer tur/retur." },
  { icon: "🔌", title: "Elbil? Planlegg lading", text: "Ladere er tettere i byene enn på fjellet. Legg inn ladestopp (f.eks. Geilo, Odda, Lom) og lad før lange viddeetapper." },
  { icon: "🛏", title: "Book nå", text: "Juli fyller de fineste stedene raskt — særlig den spektakulære natten. Book overnatting så snart ruten er bestemt." },
  { icon: "💳", title: "Betaling", text: "Kort/Vipps går nesten overalt, men ha litt kontanter til små gårdsutsalg. Bompenger faktureres automatisk via skiltgjenkjenning." },
];

/* ---------- Sjekkliste ---------- */
const CHECKS = [
  { t: "Book den spektakulære overnattingen (natt 3–4)", s: "Juli er høysesong — gjør dette først" },
  { t: "Skaff AutoPASS-ferjekort og registrér bilen", s: "Billigere og køfri ferje/bom" },
  { t: "Service-sjekk bilen: dekk, olje, spylervæske, reservehjul", s: "Mye fjellkjøring i vente" },
  { t: "Last ned kart offline (Google Maps / Norgeskart)", s: "Dekning er ustabil i fjord og fjell" },
  { t: "Book eventuell Trolltunga-parkering / fjordcruise / Flåmsbana", s: "Populære aktiviteter selges ut" },
  { t: "Pakk lag på lag, regntøy og gode tursko", s: "Vær for alle årstider på én dag" },
  { t: "Book resten av overnattingene (natt 1, 2, 5, 6)", s: "Eidfjord, Odda, Åndalsnes, Lom" },
  { t: "Sjekk veimeldinger for fjellovergangene kvelden før", s: "vegvesen.no / 175" },
];

/* =========================================================================
   RENDER
   ========================================================================= */

/* ---- Nedtelling til 6. juli 2026 ---- */
(function countdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const dep = new Date(2026, 6, 6); // måned 6 = juli
  const now = new Date();
  const days = Math.ceil((dep - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  el.textContent = days > 0 ? days : (days === 0 ? "0" : "🚗");
})();

/* ---- Timeline ---- */
(function renderTimeline() {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = DAYS.map(d => `
    <div class="day ${d.star ? "day--star" : ""}">
      <div class="day__dot">${d.star ? "★" : d.n}</div>
      <div class="day__card">
        <div class="day__meta">
          <span class="day__date">${d.date}</span>
          <span class="day__drive">${d.drive}</span>
        </div>
        <h3>${d.title}</h3>
        <p>${d.text}</p>
        <div class="day__stops">${d.stops.map(s => `<span class="tag">${s}</span>`).join("")}</div>
        <div class="day__sleep">🛏 Overnatting: <b>${d.sleep}</b></div>
      </div>
    </div>`).join("");
})();

/* ---- Severdighet-kort ---- */
(function renderPOIs() {
  const wrap = document.getElementById("poi-cards");
  wrap.innerHTML = POIS.map((p, i) => {
    const c = CAT[p.cat];
    return `
    <article class="card" data-tags="${p.tags.join(",")}" data-idx="${i}">
      <div class="card__top">
        <div class="card__icon" style="background:${c.color}">${c.icon}</div>
        <div>
          <div class="card__day">Dag ${p.day}</div>
          <h3>${p.name}</h3>
        </div>
      </div>
      <p>${p.desc}</p>
      <div class="card__tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </article>`;
  }).join("");
})();

/* ---- Overnatting ---- */
(function renderStays() {
  const wrap = document.getElementById("stays");
  wrap.innerHTML = STAYS.map(s => `
    <article class="stay">
      <span class="stay__badge">${s.night}</span>
      <h3 class="stay__name">${s.name}</h3>
      <p class="stay__place">📍 ${s.place}</p>
      <p class="stay__desc">${s.desc}</p>
      <p class="stay__why">${s.why}</p>
      <div class="stay__foot-row">
        <span class="stay__price">${s.price}</span>
        <a class="stay__link" href="${s.url}" target="_blank" rel="noopener">Til booking →</a>
      </div>
    </article>`).join("");
})();

/* ---- Praktisk ---- */
(function renderInfo() {
  const wrap = document.getElementById("info-grid");
  wrap.innerHTML = INFO.map(i => `
    <div class="info">
      <div class="info__icon">${i.icon}</div>
      <h3>${i.title}</h3>
      <p>${i.text}</p>
    </div>`).join("");
})();

/* ---- Sjekkliste (localStorage) ---- */
(function renderChecklist() {
  const wrap = document.getElementById("checklist");
  const KEY = "norgesferie-checklist";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }

  wrap.innerHTML = CHECKS.map((c, i) => `
    <label class="check">
      <input type="checkbox" data-i="${i}" ${state[i] ? "checked" : ""} />
      <span class="check__text">${c.t}<small>${c.s}</small></span>
    </label>`).join("");

  wrap.addEventListener("change", e => {
    if (e.target.matches("input[type=checkbox]")) {
      state[e.target.dataset.i] = e.target.checked;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
  });

  document.getElementById("reset-checklist").addEventListener("click", () => {
    state = {};
    try { localStorage.removeItem(KEY); } catch (e) {}
    wrap.querySelectorAll("input").forEach(i => (i.checked = false));
  });
})();

/* =========================================================================
   KART (Leaflet)
   ========================================================================= */
let mapMarkers = []; // { marker, tags }

(function initMap() {
  if (typeof L === "undefined") { console.warn("Leaflet lastet ikke."); return; }

  const map = L.map("map", { scrollWheelZoom: false, zoomControl: true }).setView([61.3, 7.6], 6);
  L.control.scale({ imperial: false }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17, attribution: "© OpenStreetMap-bidragsytere",
  }).addTo(map);

  // Rutelinje (indikativ) via hovedstoppene
  const route = [
    [59.6685, 9.6494],  // Kongsberg
    [60.4262, 7.253],   // Vøringsfossen
    [60.4676, 7.0722],  // Eidfjord
    [60.070, 6.545],    // Odda
    [60.9033, 7.227],   // Stegastein
    [60.8631, 7.1134],  // Flåm
    [61.210, 6.534],    // Balestrand
    [62.234, 7.303],    // Valldal (Juvet)
    [62.101, 7.206],    // Geiranger
    [62.4574, 7.671],   // Trollstigen
    [61.8386, 8.5669],  // Lom
    [61.92, 9.80],      // Rondane
    [59.6685, 9.6494],  // Kongsberg (hjem)
  ];
  L.polyline(route, { color: "#0d3b52", weight: 3, opacity: 0.5, dashArray: "2 8", lineCap: "round" }).addTo(map);

  // Start-/sluttmarkør
  const homeIcon = L.divIcon({
    className: "", html: `<div class="pin" style="background:#12212e"><span>🏠</span></div>`,
    iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22],
  });
  L.marker([59.6685, 9.6494], { icon: homeIcon }).addTo(map)
    .bindPopup(`<div class="popup"><span class="popup__day">Start & mål</span><h4>Kongsberg</h4><p>Turen starter og ender her.</p></div>`);

  // Severdigheter – med bilder fra reisemål-databasen der navnet matcher
  const normName = s => (s || "").toLowerCase().replace(/[^a-zæøå0-9]/g, "");
  const placeByName = {};
  (window.PLACES || []).forEach(p => { placeByName[normName(p.name)] = p; });
  POIS.forEach(p => {
    const c = CAT[p.cat];
    const icon = L.divIcon({
      className: "", html: `<div class="pin" style="background:${c.color}"><span>${c.icon}</span></div>`,
      iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22],
    });
    const match = placeByName[normName(p.name)];
    const photo = match && match.images && match.images.length
      ? `<button class="popup__photo" type="button" data-photo="${match.id}" aria-label="Se bildene av ${p.name} i fullskjerm"><img src="${match.images[0].src}" alt="" loading="lazy" /><span class="popup__photo-count">📷 ${match.images.length > 1 ? `${match.images.length} bilder` : "1 bilde"}</span></button>`
      : "";
    const m = L.marker([p.lat, p.lng], { icon }).addTo(map)
      .bindPopup(`<div class="popup${photo ? " popup--rich" : ""}"><span class="popup__day">Dag ${p.day} · ${p.cat}</span><h4>${p.name}</h4>${photo}<p>${p.desc}</p><a class="popup__nav" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">🧭 Åpne i Google Maps</a></div>`);
    mapMarkers.push({ marker: m, tags: p.tags, layer: map });
  });

  // Overnatting (★)
  STAYS.forEach(s => {
    const icon = L.divIcon({
      className: "", html: `<div class="pin pin--star"><span>★</span></div>`,
      iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -14],
    });
    L.marker([s.lat, s.lng], { icon }).addTo(map)
      .bindPopup(`<div class="popup"><span class="popup__day">★ ${s.night}</span><h4>${s.name}</h4><p>${s.desc}</p><a href="${s.url}" target="_blank" rel="noopener">Til booking →</a></div>`);
  });

  // Klikk for å aktivere zoom med scroll
  map.on("click", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());

  window.__map = map;
})();

/* =========================================================================
   FILTER (chips → kort + kartmarkører)
   ========================================================================= */
(function initFilter() {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");
  const empty = document.getElementById("poi-empty");

  function apply(filter) {
    // Kort
    let visible = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags.split(",");
      const show = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });
    empty.hidden = visible !== 0;

    // Kartmarkører
    const map = window.__map;
    mapMarkers.forEach(({ marker, tags }) => {
      const show = filter === "all" || tags.includes(filter);
      if (show) { if (map && !map.hasLayer(marker)) marker.addTo(map); }
      else { if (map && map.hasLayer(marker)) map.removeLayer(marker); }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      apply(chip.dataset.filter);
    });
  });
})();

/* =========================================================================
   RUTEFORSLAG — skjult som standard, vises med knapp (Leaflet må re-måles)
   ========================================================================= */
(function initKartToggle() {
  const btn = document.getElementById("kart-toggle");
  const reveal = document.getElementById("kart-reveal");
  if (!btn || !reveal) return;
  function setShown(shown) {
    reveal.hidden = !shown;
    btn.setAttribute("aria-expanded", String(shown));
    btn.textContent = shown ? "🗺️ Skjul ruteforslaget" : "🗺️ Vis vårt ruteforslag";
    // Leaflet må måle kartet på nytt når det vises fra skjult tilstand
    if (shown && window.__map) setTimeout(() => window.__map.invalidateSize(), 60);
  }
  btn.addEventListener("click", () => setShown(reveal.hidden));
  // «Se ruten på kart» og nav-lenken «Kart» skal også åpne forslaget
  document.querySelectorAll('a[href="#kart"]').forEach(a => {
    a.addEventListener("click", () => { if (reveal.hidden) setShown(true); });
  });
})();

/* =========================================================================
   PERSONLIG RUTE — bygget fra swipe-favoritter (localStorage)
   ========================================================================= */
(function () {
  const body = document.getElementById("minrute-body");
  if (!body) return;

  // Be nettleseren beholde lagringen (best effort – hindrer sletting ved plassmangel)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  const KONGSBERG = { id: "_start", name: "Kongsberg", region: "Start & mål", lat: 59.6685, lng: 9.6494 };
  const PLACES = window.PLACES || [];
  const byId = {}; PLACES.forEach(p => (byId[p.id] = p));
  const ICON = { Fjord:"🌊", Foss:"💧", Bre:"🧊", Fjelltopp:"⛰", Utsikt:"🔭", Kjøretur:"🚗", Stavkirke:"⛪", Kultur:"🏛", By:"🏙", Kyst:"🌅", Vandring:"🥾" };
  let myMap = null, lastSig = null;
  // Buffer for ekte veirute (OSRM) – status: idle | loading | ok | fail
  let roadState = { sig: null, status: "idle" };

  function liked() { try { return JSON.parse(localStorage.getItem("norgesferie-liked")) || []; } catch (e) { return []; } }
  function saveLiked(ids) { localStorage.setItem("norgesferie-liked", JSON.stringify(ids)); }

  // «Nei»-bunken (fra swiping) + fjernet-fra-kart – så ingenting går tapt
  const NOPE_KEY = "norgesferie-nope", REMOVED_KEY = "norgesferie-removed", REQUEUE_KEY = "norgesferie-requeue";
  function loadList(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function saveList(k, a) { localStorage.setItem(k, JSON.stringify(a)); }
  function addToList(k, id) { const a = loadList(k); if (!a.includes(id)) { a.push(id); saveList(k, a); } }
  function removeFromList(k, id) { saveList(k, loadList(k).filter(x => x !== id)); }
  function sig() { return liked().join(",") + "|" + loadList(NOPE_KEY).join(",") + "|" + loadList(REMOVED_KEY).join(","); }
  // Bortvalgte = fjernet-fra-kart + swipet-nei, uten duplikater og uten de som alt er i ruten
  function bortvalgteItems() {
    const likedSet = new Set(liked()), seen = new Set();
    return [
      ...loadList(REMOVED_KEY).map(id => ({ id, src: "kart" })),
      ...loadList(NOPE_KEY).map(id => ({ id, src: "nei" })),
    ].filter(o => byId[o.id] && !likedSet.has(o.id) && !seen.has(o.id) && (seen.add(o.id), true));
  }

  // Fjern et sted fra ruten (klikk på kartnål eller ✕ i lista) – med angre-mulighet
  const toastEl = document.createElement("div");
  toastEl.className = "route-toast";
  let toastTimer = null;
  function hideToast() { toastEl.classList.remove("show"); }
  function showToast(name, removedId) {
    toastEl.innerHTML = `<span>Fjernet «${name}»</span><button type="button" class="route-toast__undo">Angre</button>`;
    if (!toastEl.parentNode) document.body.appendChild(toastEl);
    toastEl.classList.add("show");
    toastEl.querySelector(".route-toast__undo").onclick = () => {
      const ids = liked();
      if (!ids.includes(removedId)) { ids.push(removedId); saveLiked(ids); render(); }
      hideToast();
    };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
  }
  function removePlace(id) {
    if (!liked().includes(id)) return;
    const p = byId[id];
    saveLiked(liked().filter(x => x !== id));
    removeFromList(NOPE_KEY, id);
    addToList(REMOVED_KEY, id);   // husk at det ble fjernet fra kartet
    render();
    showToast(p ? p.name : "stedet", id);
  }
  // Legg et bortvalgt sted tilbake i ruten
  function restore(id) {
    removeFromList(NOPE_KEY, id);
    removeFromList(REMOVED_KEY, id);
    const ids = liked();
    if (!ids.includes(id)) { ids.push(id); saveLiked(ids); }
    render();
  }

  // Panel med «nei»-swipede + fjernede steder, med «Ta med likevel»
  function renderVraket() {
    const wrap = document.getElementById("vraket-wrap");
    if (!wrap) return;
    const items = bortvalgteItems();
    if (!items.length) { wrap.innerHTML = ""; wrap.classList.remove("open"); return; }
    const open = wrap.classList.contains("open");
    wrap.innerHTML = `
      <button class="vraket-toggle" aria-expanded="${open}">
        🗂️ Bortvalgte steder <span class="vraket-count">${items.length}</span>
        <span class="vraket-caret">▾</span>
      </button>
      <div class="vraket-panel">
        <div class="vraket-head">
          <p class="vraket-note">Ingenting forsvinner for godt. Her er stedene dere har swipet <b>nei</b> på eller fjernet fra ruten – legg dem tilbake i ruten, eller send hele bunken til Reise-Tinder for å swipe på nytt.</p>
          <button class="vraket-reswipe" type="button">🔄 Swipe disse på nytt</button>
        </div>
        <div class="vraket-grid">
          ${items.map(o => { const p = byId[o.id]; const img = p.images && p.images[0] ? p.images[0].src : ""; return `
            <div class="vraket-card">
              ${img ? `<img class="vraket-thumb" src="${img}" alt="" loading="lazy" data-photo="${p.id}" title="Se bildene av ${p.name}" role="button" tabindex="0" />` : ""}
              <div class="vraket-body">
                <span class="vraket-tag vraket-tag--${o.src}">${o.src === "nei" ? "👎 Swipet nei" : "🗺️ Fjernet fra ruten"}</span>
                <h4>${p.name}</h4>
                <p class="vraket-region">${ICON[p.cat] || "📍"} ${p.region}</p>
                <button class="vraket-restore" data-id="${p.id}">❤️ Ta med likevel</button>
              </div>
            </div>`; }).join("")}
        </div>
      </div>`;
  }

  function hav(a, b) {
    const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function nnOrder(places) {
    const rem = places.slice(), out = [];
    let cur = KONGSBERG;
    while (rem.length) {
      let bi = 0, bd = Infinity;
      rem.forEach((p, i) => { const d = hav(cur, p); if (d < bd) { bd = d; bi = i; } });
      cur = rem[bi]; out.push(cur); rem.splice(bi, 1);
    }
    return out;
  }
  // Ekte veirute via OSRM /trip: optimal rundtur langs veier fra Kongsberg (unngår fram-og-tilbake)
  async function fetchRoads(forSig, places) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);          // ikke heng i «beregner …» for alltid
    try {
      const pts = [KONGSBERG, ...places];
      const coordStr = pts.map(p => `${p.lng},${p.lat}`).join(";");
      const url = `https://router.project-osrm.org/trip/v1/driving/${coordStr}?source=first&roundtrip=true&overview=full&geometries=geojson`;
      const res = await fetch(url, { signal: ctrl.signal });
      const data = await res.json();
      if (roadState.sig !== forSig) return;                       // favorittene endret seg underveis
      if (data.code !== "Ok" || !data.trips || !data.trips[0] || !data.waypoints) throw new Error(data.code || "no trip");
      const wp = data.waypoints;                                  // wp[0] = Kongsberg, wp[j+1] = places[j]
      const order = places
        .map((p, j) => ({ p, idx: wp[j + 1] ? wp[j + 1].waypoint_index : 1e9 }))
        .sort((a, b) => a.idx - b.idx)
        .map(o => o.p);
      // legs følger kjørerekkefølgen: [Kongsberg→1. stopp, …, siste stopp→Kongsberg]
      const legs = (data.trips[0].legs || []).map(l => l.duration);
      roadState = { sig: forSig, status: "ok", order, distance: data.trips[0].distance, duration: data.trips[0].duration, geometry: data.trips[0].geometry, legs };
      render();
    } catch (e) {
      if (roadState.sig === forSig) { roadState.status = "fail"; render(); }
    } finally {
      clearTimeout(timer);
    }
  }

  // Kjøretid (timer) per etappe: Kongsberg → stopp 1 → … → siste stopp → Kongsberg
  function legHoursFor(seq, road) {
    if (road && road.legs && road.legs.length === seq.length + 1) return road.legs.map(s => s / 3600);
    const chain = [KONGSBERG, ...seq, KONGSBERG], out = [];
    for (let i = 1; i < chain.length; i++) out.push(hav(chain[i - 1], chain[i]) * 1.25 / 65);
    return out;
  }
  // Del stoppene i dagsetapper på ~8 aktive timer (kjøring + tid på stedet)
  function splitDays(seq, legH) {
    const DAY_H = 8, days = [];
    let cur = null;
    seq.forEach((p, i) => {
      const t = legH[i] + visitHours(p);
      if (!cur || (cur.h > 0 && cur.h + t > DAY_H + 0.75)) {      // litt slingringsmonn før ny dag
        cur = { idx: [], h: 0, drive: 0, visit: 0 };
        days.push(cur);
      }
      cur.idx.push(i);
      cur.h += t; cur.drive += legH[i]; cur.visit += visitHours(p);
    });
    if (days.length) {                                            // hjemturen: på siste dag hvis den får plass, ellers egen kjøredag
      const last = days[days.length - 1];
      const homeLeg = legH[seq.length];
      if (last.h + homeLeg > DAY_H + 0.75 && homeLeg > 1.5) {
        days.push({ idx: [], h: homeLeg, drive: homeLeg, visit: 0, homeLeg, homeOnly: true });
      } else {
        last.homeLeg = homeLeg;
        last.drive += homeLeg; last.h += homeLeg;
      }
    }
    return days;
  }

  // Grovt opphold/aktivitetsestimat per sted (timer) – lest ut av turlengden
  function visitHours(p) {
    const h = (p.hike || "").toLowerCase();
    const nums = [...h.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:t\b|time)/g)].map(m => parseFloat(m[1].replace(",", ".")));
    if (nums.length) return Math.max(...nums);                       // øvre ende av f.eks. «3–4 t»
    if (p.cat === "By") return 3;                                    // byer fortjener noen timer rusling
    if (/dagstur|topptur|breføring|\bbre\b|safari|guidet/.test(h)) return 4;
    if (/^ingen|kort|rusle|gondol|\bmin\b|trinn/.test(h)) return 0.75;
    if (!h) return (p.cat === "Utsikt" || p.cat === "Kjøretur") ? 0.75 : 1.5;
    return 1.5;                                                       // standard stopp
  }
  function fmtHours(x) {
    const r = Math.round(x * 2) / 2;                                  // nærmeste halvtime
    if (r < 1) return "½ t";
    const whole = Math.floor(r);
    return (r - whole === 0.5) ? `${whole}½ t` : `${whole} t`;
  }

  /* ---------- Turdatoer (avreise man. 6. juli 2026) + lenker per dag ---------- */
  const TRIP_START = new Date(2026, 6, 6);
  const FMT_DAY = new Intl.DateTimeFormat("nb-NO", { weekday: "short", day: "numeric", month: "long" });
  const FMT_MONTH = new Intl.DateTimeFormat("nb-NO", { month: "long" });
  function dayDate(d) { return new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate() + d); }
  function isoDate(dt) { return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`; }
  function nightRange(d) {
    const a = dayDate(d), b = dayDate(d + 1);
    return a.getMonth() === b.getMonth()
      ? `${a.getDate()}.–${b.getDate()}. ${FMT_MONTH.format(a)}`
      : `${a.getDate()}. ${FMT_MONTH.format(a)} – ${b.getDate()}. ${FMT_MONTH.format(b)}`;
  }
  // Booking-søk for riktig natt, ferdig utfylt med sted og datoer
  function bookingUrl(name, d) {
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name + ", Norge")}&checkin=${isoDate(dayDate(d))}&checkout=${isoDate(dayDate(d + 1))}&group_adults=2&no_rooms=1`;
  }
  // Hele dagsetappen i Google Maps (maks 9 viapunkter støttes)
  function gmapsDir(origin, dest, wps) {
    const c = p => `${p.lat},${p.lng}`;
    const wp = wps.slice(0, 9).map(c).join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${c(origin)}&destination=${c(dest)}${wp ? `&waypoints=${encodeURIComponent(wp)}` : ""}&travelmode=driving`;
  }

  function render() {
    renderVraket();
    const ids = liked();
    const s = sig();
    lastSig = s;
    const places = ids.map(id => byId[id]).filter(Boolean);
    if (myMap) { myMap.remove(); myMap = null; }

    if (!places.length) {
      roadState = { sig: null, status: "idle" };
      body.innerHTML = `<div class="myroute-empty">
        <p>🗺️ Dere har ikke valgt noen steder ennå.</p>
        <a href="swipe.html" class="btn btn--primary">Swipe reisemål →</a>
      </div>`;
      return;
    }

    // Rekkefølge + avstand/tid: bruk ekte veirute (OSRM) når vi har den, ellers luftlinje-anslag
    if (roadState.sig !== s) roadState = { sig: s, status: "idle" };
    let seq, total, hours, geometry = null, mode;
    if (roadState.status === "ok") {
      seq = roadState.order;
      total = roadState.distance / 1000;          // meter → km
      hours = roadState.duration / 3600;          // sekund → timer
      geometry = roadState.geometry;
      mode = "road";
    } else {
      seq = nnOrder(places);
      const chain = [KONGSBERG, ...seq, KONGSBERG];
      total = 0;
      for (let i = 1; i < chain.length; i++) total += hav(chain[i - 1], chain[i]) * 1.25;
      hours = total / 65;
      mode = "fallback";
      if (roadState.status === "idle") {
        if (navigator.onLine !== false && places.length <= 99) { roadState.status = "loading"; mode = "loading"; fetchRoads(s, places); }
        else { roadState.status = "fail"; }
      } else if (roadState.status === "loading") { mode = "loading"; }
    }
    const visitH = seq.reduce((acc, p) => acc + visitHours(p), 0);
    const totalH = hours + visitH;
    const TRIP_DAYS = 7;
    const legH = legHoursFor(seq, mode === "road" ? roadState : null);
    const dayChunks = splitDays(seq, legH);
    const dayCount = Math.max(1, dayChunks.length);
    const multiDay = dayChunks.length > 1;

    const stopHtml = (p, i) => `
            <li class="myroute-item">
              <div class="myroute-top">
                <span class="myroute-num">${i + 1}</span>
                <div class="myroute-info">
                  <h4>${p.name}</h4>
                  <p class="myroute-region">${ICON[p.cat] || "📍"} ${p.region}</p>
                  <div class="myroute-meta">
                    ${p.fromRoad ? `<span>🚗 ${p.fromRoad}</span>` : ""}
                    ${p.hike ? `<span>🥾 ${p.hike}</span>` : ""}
                    <span class="myroute-time">🕒 ~${fmtHours(visitHours(p))}</span>
                    ${p.cost ? `<span class="myroute-cost">💰 ${p.cost}</span>` : ""}
                    <a class="myroute-nav" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener" title="Åpne ${p.name} i Google Maps">🧭 Kart</a>
                  </div>
                </div>
                <button class="myroute-remove" data-id="${p.id}" title="Fjern «${p.name}» fra ruten" aria-label="Fjern ${p.name}">✕</button>
              </div>
              ${p.images && p.images.length ? `
              <button class="myroute-photo" data-photo="${p.id}" aria-label="Se bildene av ${p.name} i fullskjerm">
                <img src="${p.images[0].src}" alt="${p.name}" loading="lazy" />
                ${p.images.length > 1 ? `<span class="myroute-photo__count">📷 1 / ${p.images.length}</span>` : ""}
                <span class="myroute-photo__hint">🔍 Trykk for fullskjerm${p.images.length > 1 ? " · bla gjennom bildene" : ""}</span>
              </button>` : ""}
            </li>`;

    const listHtml = dayChunks.map((day, d) => {
      const stops = day.idx.map(i => stopHtml(seq[i], i)).join("");
      if (!multiDay) return stops;
      const prev = d > 0 ? dayChunks[d - 1] : null;
      const origin = prev && prev.idx.length ? seq[prev.idx[prev.idx.length - 1]] : KONGSBERG;   // der dere våkner
      const dateHtml = `<span class="myroute-day__date">${FMT_DAY.format(dayDate(d))}</span>`;
      if (day.homeOnly) return `
            <li class="myroute-day"><span class="myroute-day__num">Dag ${d + 1}</span>${dateHtml}<span class="myroute-day__meta">🚗 ${fmtHours(day.drive)} kjøring</span><a class="myroute-day__nav" href="${gmapsDir(origin, KONGSBERG, [])}" target="_blank" rel="noopener">🧭 Naviger etappen</a></li>
            <li class="myroute-sleep">🏁 Hjemreise til Kongsberg – rundt ${fmtHours(day.drive)} bak rattet, med pauser der det frister.</li>`;
      const dayStops = day.idx.map(i => seq[i]);
      const lastStop = dayStops[dayStops.length - 1];
      const isLast = d === dayChunks.length - 1;
      const nav = (isLast && day.homeLeg)
        ? gmapsDir(origin, KONGSBERG, dayStops)                       // dagens stopp, så helt hjem
        : gmapsDir(origin, lastStop, dayStops.slice(0, -1));
      return `
            <li class="myroute-day"><span class="myroute-day__num">Dag ${d + 1}</span>${dateHtml}<span class="myroute-day__meta">🚗 ${fmtHours(day.drive)} kjøring · 🕒 ${fmtHours(day.visit)} på stedene</span><a class="myroute-day__nav" href="${nav}" target="_blank" rel="noopener">🧭 Naviger etappen</a></li>
            ${stops}
            ${isLast
              ? `<li class="myroute-sleep">🏁 …og så hjem til Kongsberg (≈ ${fmtHours(day.homeLeg || 0)} kjøring).</li>`
              : `<li class="myroute-sleep">🛏 <b>Natt ${d + 1}</b> (${nightRange(d)}): overnatt gjerne i nærheten av <b>${lastStop.name}</b><span class="u-noprint"> · <a href="${bookingUrl(lastStop.name, d)}" target="_blank" rel="noopener">Søk overnatting →</a></span></li>`}`;
    }).join("");

    const modeHtml = mode === "road"
      ? `<span class="myroute-mode myroute-mode--road">🛣️ langs vei</span>`
      : mode === "loading"
      ? `<span class="myroute-mode myroute-mode--loading">🛰️ beregner rute …</span>`
      : `<button type="button" class="myroute-mode myroute-mode--fallback" id="route-retry" title="Prøv å hente veirute på nytt">📏 luftlinje · prøv igjen ↻</button>`;

    // Husk hvor langt ned i lista man var, så fjern/angre/veirute-svar ikke hopper til toppen
    const oldList = body.querySelector(".myroute-list");
    const keepScroll = oldList ? oldList.scrollTop : 0;

    body.innerHTML = `
      <div class="myroute-grid">
        <div id="map-mine" class="myroute-map"></div>
        <ol class="myroute-list">${listHtml}
        </ol>
      </div>
      <div class="myroute-foot">
        <div class="myroute-stat"><b>${seq.length}</b><span>stopp</span></div>
        <div class="myroute-stat"><b>≈ ${Math.round(total)}</b><span>km t/r</span></div>
        <div class="myroute-stat"><b>≈ ${Math.round(hours)}</b><span>t kjøring</span></div>
        <div class="myroute-stat"><b>≈ ${Math.round(visitH)}</b><span>t på stedene</span></div>
        <div class="myroute-stat myroute-stat--total"><b>≈ ${dayCount}</b><span>${dayCount === 1 ? "dagsetappe" : "dagsetapper"}</span></div>
        ${modeHtml}
        <a href="swipe.html" class="btn btn--ghost btn--sm">Swipe flere steder</a>
      </div>
      <p class="myroute-note myroute-note--time">🕒 <b>Tidsestimat:</b> ca. ${Math.round(hours)} t kjøring + ${Math.round(visitH)} t på stedene ≈ <b>${Math.round(totalH)} timer</b> totalt, delt opp i <b>${dayCount} ${dayCount === 1 ? "dagsetappe" : "dagsetapper"}</b> med ~8 aktive timer i døgnet.${multiDay ? " Dagsinndelingen i lista er veiledende – flytt gjerne stopp mellom dager." : ""} Ferien deres er ca. ${TRIP_DAYS} dager${dayCount > TRIP_DAYS ? " – så her lønner det seg å luke litt i lista. 🙂" : " – dette ser overkommelig ut! 🎉"}</p>
      <p class="myroute-note">${
        mode === "road"
          ? "🛣️ Rekkefølgen og kjøreavstanden følger <b>ekte hovedveier</b> (beregnet med OSRM) som en optimert rundtur fra Kongsberg – uten unødig fram og tilbake. «På stedene» er summert fra turlengden. Ferje- og bomtider kommer i tillegg."
          : mode === "loading"
          ? "🛰️ Beregner beste rute langs vei … (viser luftlinje-anslag så lenge). Dette krever nettforbindelse og tar et par sekunder."
          : "📏 Anslag basert på <b>luftlinje × 1,25</b> ved ~65 km/t (ingen nettforbindelse, eller for mange stopp for automatisk veiruting). «På stedene» er summert fra turlengden. Ferje- og bomtider kommer i tillegg."
      }</p>`;

    const newList = body.querySelector(".myroute-list");
    if (newList && keepScroll) newList.scrollTop = keepScroll;

    if (typeof L === "undefined") return;
    const map = L.map("map-mine", { scrollWheelZoom: false }).setView([KONGSBERG.lat, KONGSBERG.lng], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 17, attribution: "© OpenStreetMap" }).addTo(map);
    const home = L.divIcon({ className: "", html: `<div class="pin" style="background:#12212e"><span>🏠</span></div>`, iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22] });
    L.marker([KONGSBERG.lat, KONGSBERG.lng], { icon: home }).addTo(map).bindPopup("<div class='popup'><h4>Kongsberg</h4><p>Start & mål</p></div>");
    seq.forEach((p, i) => {
      const icon = L.divIcon({ className: "", html: `<div class="pin pin--num"><span>${i + 1}</span></div>`, iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22] });
      const photo = p.images && p.images.length
        ? `<button class="popup__photo" type="button" data-photo="${p.id}" aria-label="Se bildene av ${p.name} i fullskjerm"><img src="${p.images[0].src}" alt="" loading="lazy" /><span class="popup__photo-count">📷 ${p.images.length > 1 ? `${p.images.length} bilder` : "1 bilde"}</span></button>`
        : "";
      L.marker([p.lat, p.lng], { icon }).addTo(map)
        .bindPopup(`<div class="popup popup--rich"><span class="popup__day">Stopp ${i + 1} · ${p.region}</span><h4>${p.name}</h4>${photo}${p.cost ? `<p>💰 ${p.cost}</p>` : ""}<a class="popup__nav" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">🧭 Åpne i Google Maps</a><button class="popup__remove" data-id="${p.id}">✕ Fjern fra ruten</button></div>`);
    });
    if (geometry && geometry.coordinates) {
      // ekte veigeometri fra OSRM (GeoJSON [lng,lat] → Leaflet [lat,lng])
      L.polyline(geometry.coordinates.map(c => [c[1], c[0]]), { color: "#e76f51", weight: 4, opacity: 0.85, lineCap: "round", lineJoin: "round" }).addTo(map);
    } else {
      L.polyline([KONGSBERG, ...seq, KONGSBERG].map(pt => [pt.lat, pt.lng]), { color: "#e76f51", weight: 3, opacity: 0.7, dashArray: "1 7", lineCap: "round" }).addTo(map);
    }
    map.fitBounds(L.latLngBounds([KONGSBERG, ...seq].map(pt => [pt.lat, pt.lng])).pad(0.15));
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
    map.on("popupopen", (e) => {
      const el = e.popup.getElement();
      const btn = el && el.querySelector(".popup__remove");
      if (!btn) return;
      btn.addEventListener("click", () => removePlace(btn.dataset.id));
      // Rull lista til stoppet og gi det et lite blink – uten å flytte selve siden
      const item = body.querySelector(`.myroute-remove[data-id="${btn.dataset.id}"]`);
      const list = body.querySelector(".myroute-list");
      if (item && list) {
        const li = item.closest(".myroute-item");
        // plasser stoppet rett under dagens klebrige overskrift (høyden varierer med skjermbredde)
        let hdr = li.previousElementSibling;
        while (hdr && !hdr.classList.contains("myroute-day")) hdr = hdr.previousElementSibling;
        const off = (hdr ? hdr.offsetHeight : 44) + 10;
        list.scrollTop = li.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop - off;
        li.classList.add("is-flash");
        setTimeout(() => li.classList.remove("is-flash"), 1600);
      }
    });
    myMap = map;
  }

  /* ---------- Fullskjerm bildevisning (lightbox med bla-gjennom) ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Lukk (Esc)">✕</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Forrige bilde">‹</button>
    <figure class="lightbox__stage">
      <img class="lightbox__img" src="" alt="" />
      <figcaption class="lightbox__cap">
        <span class="lightbox__title"></span>
        <span class="lightbox__count"></span>
        <span class="lightbox__credit"></span>
      </figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Neste bilde">›</button>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector(".lightbox__img");
  const lbTitle = lb.querySelector(".lightbox__title");
  const lbCount = lb.querySelector(".lightbox__count");
  const lbCredit = lb.querySelector(".lightbox__credit");
  const lbPrev = lb.querySelector(".lightbox__nav--prev");
  const lbNext = lb.querySelector(".lightbox__nav--next");
  let lbList = [], lbI = 0, lbName = "";
  function lbShow() {
    const im = lbList[lbI]; if (!im) return;
    lbImg.src = im.src; lbImg.alt = lbName;
    lbTitle.textContent = lbName;
    lbCount.textContent = lbList.length > 1 ? `${lbI + 1} / ${lbList.length}` : "";
    lbCredit.textContent = [im.credit, im.license].filter(Boolean).join(" · ");
    const multi = lbList.length > 1;
    lbPrev.style.visibility = multi ? "" : "hidden";
    lbNext.style.visibility = multi ? "" : "hidden";
    // forhåndslast nabobildene så blaing føles umiddelbar
    if (multi) [lbI + 1, lbI - 1].forEach(k => {
      const n = lbList[(k + lbList.length) % lbList.length];
      if (n) { const pre = new Image(); pre.src = n.src; }
    });
  }
  function openLightbox(place, idx) {
    if (!place || !place.images || !place.images.length) return;
    lbList = place.images; lbI = idx || 0; lbName = place.name;
    lb.setAttribute("aria-label", `Bilder av ${place.name}`);
    lbShow();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", lbKey);
  }
  function lbClose() { lb.hidden = true; document.body.style.overflow = ""; document.removeEventListener("keydown", lbKey); }
  function lbNav(d) { if (lbList.length) { lbI = (lbI + d + lbList.length) % lbList.length; lbShow(); } }
  function lbKey(e) {
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowLeft") lbNav(-1);
    else if (e.key === "ArrowRight") lbNav(1);
  }
  lb.querySelector(".lightbox__close").addEventListener("click", lbClose);
  lbPrev.addEventListener("click", (e) => { e.stopPropagation(); lbNav(-1); });
  lbNext.addEventListener("click", (e) => { e.stopPropagation(); lbNav(1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });      // klikk på bakgrunn lukker
  // Trykk på bildet = neste. Sveip mot venstre/høyre (mobil) = neste/forrige.
  let lbDownX = null, lbSwiped = false;
  lbImg.addEventListener("pointerdown", (e) => { lbDownX = e.clientX; lbSwiped = false; });
  lbImg.addEventListener("pointerup", (e) => {
    if (lbDownX === null) return;
    const dx = e.clientX - lbDownX; lbDownX = null;
    if (Math.abs(dx) > 40) { lbSwiped = true; lbNav(dx < 0 ? 1 : -1); }
  });
  lbImg.addEventListener("click", (e) => {
    e.stopPropagation();
    if (lbSwiped) { lbSwiped = false; return; }   // sveip skal ikke også telle som klikk
    lbNav(1);
  });

  // Klikk i lista: ✕ fjerner, bilde åpner fullskjerm (delegert – body består ved ny render)
  body.addEventListener("click", (e) => {
    const rm = e.target.closest(".myroute-remove");
    if (rm) { removePlace(rm.dataset.id); return; }
    const retry = e.target.closest("#route-retry");
    if (retry) { roadState = { sig: null, status: "idle" }; render(); return; }
    const ph = e.target.closest(".myroute-photo");
    if (ph) openLightbox(byId[ph.dataset.photo], 0);
  });

  // Bilder i kart-popups (begge kart) og bortvalgte-miniatyrer → fullskjerm
  document.addEventListener("click", (e) => {
    const ph = e.target.closest(".popup__photo, .vraket-thumb");
    if (ph && ph.dataset.photo) openLightbox(byId[ph.dataset.photo], 0);
  });

  // Bortvalgte-panelet: vis/skjul + «Ta med likevel» (delegert)
  const vwrap = document.getElementById("vraket-wrap");
  if (vwrap) vwrap.addEventListener("click", (e) => {
    const r = e.target.closest(".vraket-restore");
    if (r) { restore(r.dataset.id); return; }
    const rs = e.target.closest(".vraket-reswipe");
    if (rs) {
      const ids = bortvalgteItems().map(o => o.id);
      if (ids.length) { saveList(REQUEUE_KEY, ids); window.location.href = "swipe.html"; }
      return;
    }
    const t = e.target.closest(".vraket-toggle");
    if (t) { vwrap.classList.toggle("open"); t.setAttribute("aria-expanded", vwrap.classList.contains("open")); }
  });

  function flashToast(msg) {
    toastEl.innerHTML = `<span>${msg}</span>`;
    if (!toastEl.parentNode) document.body.appendChild(toastEl);
    toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 4000);
  }

  // «Start på nytt» – nullstiller alle swipe-valg
  const resetBtn = document.getElementById("reset-all");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (!confirm("Vil dere slette alle swipe-valg (ruten, «nei»-bunken og de fjernede) og starte helt på nytt?\n\nTips: ta en sikkerhetskopi først (💾-knappen), så kan dere angre senere.")) return;
    ["norgesferie-liked", NOPE_KEY, REMOVED_KEY, REQUEUE_KEY].forEach(k => localStorage.removeItem(k));
    render();
    flashToast("✨ Alt nullstilt – klar for en ny swiperunde!");
  });

  /* ---------- Sikkerhetskopi: eksport/import/deling av alle valg ---------- */
  const CHECK_KEY = "norgesferie-checklist";
  function exportCode() {
    const data = { v: 1, dato: isoDate(new Date()) };
    [["liked", "norgesferie-liked"], ["nope", NOPE_KEY], ["removed", REMOVED_KEY]].forEach(([f, k]) => {
      try { data[f] = JSON.parse(localStorage.getItem(k)) || []; } catch (e) { data[f] = []; }
    });
    try { data.check = JSON.parse(localStorage.getItem(CHECK_KEY)) || {}; } catch (e) { data.check = {}; }
    return "NF26:" + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }
  function parseCode(raw) {
    let code = (raw || "").trim().replace(/\s+/g, "");
    if (code.startsWith("NF26:")) code = code.slice(5);
    const data = JSON.parse(decodeURIComponent(escape(atob(code))));
    if (!data || data.v !== 1) throw new Error("ukjent versjon");
    const clean = a => (Array.isArray(a) ? a.filter(id => byId[id]) : []);
    return { liked: clean(data.liked), nope: clean(data.nope), removed: clean(data.removed),
             check: (data.check && typeof data.check === "object") ? data.check : {} };
  }
  function applyImport(inc, merge) {
    let nl, nn, nr, nc;
    if (merge) {                                   // union: ❤️ vinner over nei/fjernet
      nl = [...new Set([...liked(), ...inc.liked])];
      nn = [...new Set([...loadList(NOPE_KEY), ...inc.nope])].filter(id => !nl.includes(id));
      nr = [...new Set([...loadList(REMOVED_KEY), ...inc.removed])].filter(id => !nl.includes(id));
      let cur = {}; try { cur = JSON.parse(localStorage.getItem(CHECK_KEY)) || {}; } catch (e) {}
      nc = { ...cur };
      Object.keys(inc.check).forEach(k => { if (inc.check[k]) nc[k] = true; });
    } else {
      nl = inc.liked;
      nn = inc.nope.filter(id => !nl.includes(id));
      nr = inc.removed.filter(id => !nl.includes(id));
      nc = inc.check;
    }
    saveLiked(nl); saveList(NOPE_KEY, nn); saveList(REMOVED_KEY, nr);
    try { localStorage.setItem(CHECK_KEY, JSON.stringify(nc)); } catch (e) {}
    return nl.length;
  }
  const bkPanel = document.getElementById("backup-panel");
  const bkToggle = document.getElementById("backup-toggle");
  const bkOut = document.getElementById("backup-out");
  const bkIn = document.getElementById("backup-in");
  if (bkPanel && bkToggle && bkOut && bkIn) {
    bkToggle.addEventListener("click", () => {
      const show = bkPanel.hidden;
      bkPanel.hidden = !show;
      bkToggle.setAttribute("aria-expanded", String(show));
      if (show) bkOut.value = exportCode();
    });
    document.getElementById("backup-copy").addEventListener("click", () => {
      bkOut.value = exportCode();
      bkOut.select(); bkOut.setSelectionRange(0, 999999);
      const ok = () => flashToast("📋 Koden er kopiert – lagre den i et notat!");
      const manuelt = () => flashToast("Koden er merket – kopiér med Ctrl/Cmd+C");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bkOut.value).then(ok, manuelt);
      else manuelt();
    });
    document.getElementById("backup-download").addEventListener("click", () => {
      const blob = new Blob([exportCode() + "\n"], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `norgesferie-valg-${isoDate(new Date())}.txt`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      flashToast("⬇️ Sikkerhetskopi lastet ned");
    });
    const doImport = (merge) => {
      let inc;
      try { inc = parseCode(bkIn.value); } catch (e) { flashToast("🤔 Koden ble ikke gjenkjent – lim inn hele koden (starter med NF26:)"); return; }
      if (!merge) {
        const n = liked().length;
        if (!confirm(`Erstatte alle valg på denne enheten${n ? ` (${n} steder i ruten nå)` : ""} med innholdet i koden (${inc.liked.length} steder)?\n\nTips: «Slå sammen» beholder begge deler.`)) return;
      }
      const n = applyImport(inc, merge);
      flashToast(`✅ Hentet inn – ${n} steder i ruten. Laster siden på nytt …`);
      setTimeout(() => window.location.reload(), 1200);
    };
    document.getElementById("backup-merge").addEventListener("click", () => doImport(true));
    document.getElementById("backup-replace").addEventListener("click", () => doImport(false));
  }

  // Print-vennlig dagsplan
  const printBtn = document.getElementById("print-plan");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  render();
  // oppdater når favoritter/bortvalgte endres (annen fane) eller når man kommer tilbake til siden
  window.addEventListener("storage", (e) => { if (["norgesferie-liked", NOPE_KEY, REMOVED_KEY].includes(e.key)) render(); });
  window.addEventListener("focus", () => { if (sig() !== lastSig) render(); });
})();
