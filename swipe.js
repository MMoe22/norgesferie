/* =========================================================================
   Reise-Tinder — swipe deg gjennom Norges reisemål
   ========================================================================= */
(function () {
  "use strict";

  const PLACES = (window.PLACES || []).slice();
  const LIKED_KEY = "norgesferie-liked";
  const NOPE_KEY = "norgesferie-nope";
  const REMOVED_KEY = "norgesferie-removed";

  const CATMETA = {
    Fjord:     { e: "🌊", label: "Fjord" },
    Foss:      { e: "💧", label: "Foss" },
    Bre:       { e: "🧊", label: "Isbre" },
    Fjelltopp: { e: "⛰",  label: "Fjelltopp" },
    Utsikt:    { e: "🔭", label: "Utsiktspunkt" },
    Kjøretur:  { e: "🚗", label: "Kjøretur" },
    Stavkirke: { e: "⛪", label: "Stavkirke" },
    Kultur:    { e: "🏛", label: "Kultur" },
    By:        { e: "🏙", label: "By" },
    Kyst:      { e: "🌅", label: "Kyst" },
    Vandring:  { e: "🥾", label: "Vandring" },
  };

  // DOM
  const deckEl    = document.getElementById("deck");
  const barEl     = document.getElementById("bar");
  const counterEl = document.getElementById("counter");
  const controls  = document.getElementById("controls");
  const resultsEl = document.getElementById("results");
  const gridEl    = document.getElementById("results-grid");
  const favCountEl= document.getElementById("fav-count");
  const toastEl   = document.getElementById("toast");

  // State
  let pos = 0;
  let nodes = [];         // synlige kort, nodes[0] = fremste
  const history = [];     // { pos, dir, wasLiked, wasNoped, wasRemoved } for angre
  let liked = loadLiked();
  // Startstokken hopper over alt dere allerede har tatt stilling til (likt, nei eller fjernet)
  let deck = freshDeck();
  let allMode = deck.length === PLACES.length;  // true = full runde med alle kort
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  const byId = {};
  PLACES.forEach(p => (byId[p.id] = p));

  // Re-swipe kun de bortvalgte, hvis dashbordet ba om det (engangs)
  let requeueMode = false;
  (function initRequeue() {
    let q; try { q = JSON.parse(localStorage.getItem("norgesferie-requeue")) || []; } catch (e) { q = []; }
    localStorage.removeItem("norgesferie-requeue");
    const places = q.map(id => byId[id]).filter(Boolean);
    if (places.length) { deck = shuffle(places); pos = 0; requeueMode = true; }
  })();
  if (requeueMode) {
    const b = document.getElementById("requeue-banner");
    if (b) { b.textContent = `🔄 Nå swiper dere på nytt gjennom ${deck.length} bortvalgte ${deck.length === 1 ? "sted" : "steder"}`; b.hidden = false; }
  }
  updateDeckNote();

  // Stokk med kun uvurderte steder
  function freshDeck() {
    const decided = new Set([...liked, ...loadArr(NOPE_KEY), ...loadArr(REMOVED_KEY)]);
    return shuffle(PLACES.filter(p => !decided.has(p.id)));
  }
  function updateDeckNote() {
    const el = document.getElementById("deck-note");
    if (!el) return;
    const done = PLACES.length - deck.length;
    if (requeueMode || allMode || done <= 0) { el.hidden = true; return; }
    el.textContent = `Dere har allerede vurdert ${done} av ${PLACES.length} steder – her er de ${deck.length} som gjenstår.`;
    el.hidden = false;
  }

  /* ---------- Hjelpere ---------- */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function loadLiked() { try { return JSON.parse(localStorage.getItem(LIKED_KEY)) || []; } catch (e) { return []; } }
  function saveLiked() { try { localStorage.setItem(LIKED_KEY, JSON.stringify(liked)); } catch (e) {} }
  function addLike(id) { clearDiscard(id); if (!liked.includes(id)) { liked.push(id); saveLiked(); } updateFav(); }
  function removeLike(id) { liked = liked.filter(x => x !== id); saveLiked(); updateFav(); }
  function updateFav() { favCountEl.textContent = liked.length; }

  // «Nei»-bunken + fjernet-fra-kart lagres, så ingenting går tapt
  function loadArr(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function saveArr(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
  function clearDiscard(id) { saveArr(NOPE_KEY, loadArr(NOPE_KEY).filter(x => x !== id)); saveArr(REMOVED_KEY, loadArr(REMOVED_KEY).filter(x => x !== id)); }
  function addNope(id) {
    liked = liked.filter(x => x !== id); saveLiked(); updateFav();
    saveArr(REMOVED_KEY, loadArr(REMOVED_KEY).filter(x => x !== id));
    const a = loadArr(NOPE_KEY); if (!a.includes(id)) { a.push(id); saveArr(NOPE_KEY, a); }
  }
  function removeNope(id) { saveArr(NOPE_KEY, loadArr(NOPE_KEY).filter(x => x !== id)); }
  // Flytt til «Bortvalgte» (vises på reiseplanen) i stedet for å slette for godt
  function addRemoved(id) { const a = loadArr(REMOVED_KEY); if (!a.includes(id)) { a.push(id); saveArr(REMOVED_KEY, a); } }
  function mapUrl(p) { return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`; }
  function creditText(img) { return "Foto: " + (img.credit || "Wikimedia") + (img.license ? " · " + img.license : "") + " / Wikimedia Commons"; }

  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("toast--show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("toast--show"), 1600);
  }

  /* ---------- Norge-mini-kart ---------- */
  function injectNorwaySymbol() {
    if (!window.NORWAY || document.getElementById("norwaySym")) return;
    const holder = document.createElement("div");
    holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    holder.setAttribute("aria-hidden", "true");
    holder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="norwaySym" viewBox="${window.NORWAY.viewBox}"><path d="${window.NORWAY.path}" fill="currentColor" stroke="rgba(13,59,82,0.4)" stroke-width="0.4" stroke-linejoin="round"/></symbol></svg>`;
    document.body.appendChild(holder);
  }
  function miniMap(place) {
    if (!window.NORWAY) return "";
    const p = window.NORWAY.project(place.lat, place.lng);
    const cx = p.x.toFixed(1), cy = p.y.toFixed(1);
    return `<div class="card__minimap" title="Hvor i Norge"><svg class="minimap" viewBox="${window.NORWAY.viewBox}" preserveAspectRatio="xMidYMid meet">
      <use href="#norwaySym"></use>
      <circle cx="${cx}" cy="${cy}" r="7" class="minimap__halo"></circle>
      <circle cx="${cx}" cy="${cy}" r="3.4" class="minimap__dot"></circle>
    </svg></div>`;
  }

  /* ---------- Stort Norge-kart ved siden av kortet (desktop) ---------- */
  function initStageMap() {
    const el = document.getElementById("stage-map");
    if (!el || !window.NORWAY) return;
    el.innerHTML = `
      <span class="stage-badge">📍 Hvor i Norge</span>
      <div class="stage-svgwrap">
        <svg class="stage-svg" viewBox="${window.NORWAY.viewBox}" preserveAspectRatio="xMidYMid meet">
          <use href="#norwaySym"></use>
          <circle class="stage-halo" r="6" cx="-99" cy="-99"></circle>
          <circle class="stage-dot" r="3.2" cx="-99" cy="-99"></circle>
        </svg>
      </div>
      <div class="stage-cap">
        <span class="stage-cap__name" id="stage-name"></span>
        <span class="stage-cap__region" id="stage-region"></span>
      </div>`;
  }
  function updateStageMap(place) {
    const el = document.getElementById("stage-map");
    if (!el || !window.NORWAY || !place) return;
    const p = window.NORWAY.project(place.lat, place.lng);
    el.querySelectorAll(".stage-dot, .stage-halo").forEach(c => {
      c.setAttribute("cx", p.x.toFixed(1)); c.setAttribute("cy", p.y.toFixed(1));
    });
    const n = document.getElementById("stage-name"); if (n) n.textContent = place.name;
    const r = document.getElementById("stage-region"); if (r) r.textContent = place.region;
  }

  /* ---------- Bygg kort ---------- */
  function buildCard(place) {
    const cat = CATMETA[place.cat] || { e: "📍", label: place.cat };
    const card = document.createElement("article");
    card.className = "card";

    const multi = place.images.length > 1;
    const dots = place.images.map((_, i) => `<span class="dot ${i === 0 ? "dot--on" : ""}"></span>`).join("");
    const costChip = place.cost ? `<span class="cost" title="Pris (ca.)">💰 ${place.cost}</span>` : "";
    const meta = [
      place.fromRoad ? `<span title="Fra bilvei">🚗 ${place.fromRoad}</span>` : "",
      place.hike ? `<span title="Tur / gange">🥾 ${place.hike}</span>` : "",
      place.diff ? `<span class="diff diff--${place.diff}">${place.diff === "Ingen" ? "Ingen tur" : place.diff}</span>` : "",
      costChip,
    ].filter(Boolean).join("\n      ");

    card.innerHTML = `
      <img class="card__img" alt="${place.name}" src="${place.images[0].src}" draggable="false" />
      <div class="card__shade"></div>
      <div class="card__dots">${dots}</div>
      ${multi ? `<button class="tap tap--prev" aria-label="Forrige bilde"><span class="chev">‹</span></button>
      <button class="tap tap--next" aria-label="Neste bilde"><span class="chev">›</span></button>` : ""}
      <span class="card__cat">${cat.e} ${cat.label}</span>
      ${miniMap(place)}
      <span class="stamp stamp--like">Lyst!</span>
      <span class="stamp stamp--nope">Nei</span>
      <div class="card__info">
        <h2 class="card__name">${place.name}</h2>
        <p class="card__region">📍 ${place.region}</p>
        <p class="card__blurb">${place.blurb}</p>
        <div class="card__meta">${meta}</div>
        <div class="card__credit">${creditText(place.images[0])}</div>
      </div>`;

    // bildekarusell-tilstand. Selve blaingen skjer i attachDrag via tap-deteksjon,
    // fordi setPointerCapture (som trengs for dra-gesten) ellers spiser click-eventet på pilene.
    card._img = { i: 0, list: place.images };

    // forhåndslast bildene
    place.images.forEach(im => { const p = new Image(); p.src = im.src; });
    return card;
  }

  function changeImg(card, delta) {
    const st = card._img;
    if (!st || st.list.length < 2) return;
    st.i = (st.i + delta + st.list.length) % st.list.length;
    card.querySelector(".card__img").src = st.list[st.i].src;
    card.querySelector(".card__credit").textContent = creditText(st.list[st.i]);
    card.querySelectorAll(".card__dots .dot").forEach((d, k) => d.classList.toggle("dot--on", k === st.i));
  }

  function depthStyle(node, d) {
    node.style.zIndex = String(100 - d);
    node.style.transform = `translateY(${d * 14}px) scale(${1 - d * 0.05})`;
    node.style.opacity = d >= 3 ? "0" : "1";
    node.classList.toggle("card--back", d > 0);
  }

  /* ---------- Render stabel ---------- */
  function renderStack() {
    deckEl.innerHTML = "";
    nodes = [];
    if (!PLACES.length) {
      deckEl.innerHTML = `<div class="deck__empty">Fant ingen reisemål 😳<br>Kjør <code>node scripts/fetch-images.mjs</code> for å hente stedene.</div>`;
      controls.style.display = "none";
      return;
    }
    if (pos >= deck.length) { showResults(); return; }
    for (let d = 0; d < 3; d++) {
      const idx = pos + d;
      if (idx >= deck.length) break;
      const n = buildCard(deck[idx]);
      deckEl.appendChild(n);
      depthStyle(n, d);
      nodes.push(n);
    }
    if (nodes[0]) attachDrag(nodes[0]);
    updateStageMap(deck[pos]);
    updateProgress();
  }

  function updateProgress() {
    const seen = Math.min(pos, deck.length);
    barEl.style.width = (deck.length ? (seen / deck.length) * 100 : 0) + "%";
    counterEl.textContent = `${Math.min(pos + 1, deck.length)} / ${deck.length}  ·  ❤️ ${liked.length}`;
  }

  /* ---------- Drag / swipe ---------- */
  function setStamp(node, dx) {
    const like = node.querySelector(".stamp--like");
    const nope = node.querySelector(".stamp--nope");
    const t = Math.min(Math.abs(dx) / 90, 1);
    if (dx > 0) { like.style.opacity = t; nope.style.opacity = 0; }
    else if (dx < 0) { nope.style.opacity = t; like.style.opacity = 0; }
    else { like.style.opacity = 0; nope.style.opacity = 0; }
  }

  function attachDrag(node) {
    let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;
    node._moved = false;

    node.addEventListener("pointerdown", (e) => {
      dragging = true; node._moved = false;
      startX = e.clientX; startY = e.clientY;
      dx = 0; dy = 0;
      try { node.setPointerCapture(e.pointerId); } catch (_) {}
      node.style.transition = "none";
    });
    node.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - startX; dy = e.clientY - startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) node._moved = true;
      node.style.transform = `translate(${dx}px, ${dy * 0.35}px) rotate(${dx * 0.05}deg)`;
      setStamp(node, dx);
    });
    const end = (e, allowTap) => {
      if (!dragging) return;
      dragging = false;
      node.style.transition = "";
      if (dx > 90) { decide("like"); }
      else if (dx < -90) { decide("nope"); }
      else {
        node.style.transform = ""; setStamp(node, 0);
        // Tapp (nesten ingen bevegelse) → bla i bilder ut fra hvilken side man trykket
        if (allowTap && e && Math.abs(dx) < 10 && Math.abs(dy) < 10 && node._img && node._img.list.length > 1) {
          const rect = node.getBoundingClientRect();
          const rx = (e.clientX - rect.left) / rect.width;
          if (rx < 0.45) changeImg(node, -1);
          else if (rx > 0.55) changeImg(node, +1);
        }
      }
      dx = 0; dy = 0;
    };
    node.addEventListener("pointerup", (e) => end(e, true));
    node.addEventListener("pointercancel", (e) => end(e, false));
  }

  /* ---------- Beslutning ---------- */
  let busy = false;
  function decide(dir) {
    if (busy || !nodes.length) return;
    busy = true;
    const front = nodes.shift();
    const place = deck[pos];

    // Ta vare på tilstanden FØR beslutningen, så «Angre» kan gjenopprette den eksakt
    history.push({
      pos, dir,
      wasLiked: liked.includes(place.id),
      wasNoped: loadArr(NOPE_KEY).includes(place.id),
      wasRemoved: loadArr(REMOVED_KEY).includes(place.id),
    });
    if (dir === "like") addLike(place.id);
    else if (dir === "nope") addNope(place.id);
    pos++;

    // fly ut
    front.style.transition = "transform .4s ease, opacity .4s ease";
    const x = dir === "like" ? window.innerWidth : -window.innerWidth;
    const rot = dir === "like" ? 22 : -22;
    setStamp(front, dir === "like" ? 120 : -120);
    requestAnimationFrame(() => {
      front.style.transform = `translate(${x}px, -30px) rotate(${rot}deg)`;
      front.style.opacity = "0";
    });
    setTimeout(() => front.remove(), 400);

    // forfrem resten
    nodes.forEach((n, i) => depthStyle(n, i));
    // legg til nytt bakerst
    const newIdx = pos + nodes.length;
    if (newIdx < deck.length && nodes.length < 3) {
      const n = buildCard(deck[newIdx]);
      deckEl.appendChild(n);
      depthStyle(n, 3);
      requestAnimationFrame(() => depthStyle(n, nodes.length));
      nodes.push(n);
    }
    if (nodes[0]) attachDrag(nodes[0]);
    updateStageMap(deck[pos]);
    updateProgress();

    setTimeout(() => {
      busy = false;
      if (!nodes.length && pos >= deck.length) showResults();
    }, 260);
  }

  function undo() {
    if (!history.length) { toast("Ingenting å angre"); return; }
    const last = history.pop();
    pos = last.pos;
    // Gjenopprett nøyaktig tilstanden fra før beslutningen (et «nei» på et
    // tidligere likt sted skal f.eks. tilbake i ruten, ikke forsvinne)
    const id = deck[pos].id;
    liked = liked.filter(x => x !== id);
    if (last.wasLiked) liked.push(id);
    saveLiked(); updateFav();
    saveArr(NOPE_KEY, loadArr(NOPE_KEY).filter(x => x !== id).concat(last.wasNoped ? [id] : []));
    saveArr(REMOVED_KEY, loadArr(REMOVED_KEY).filter(x => x !== id).concat(last.wasRemoved ? [id] : []));
    if (!resultsEl.hidden) {
      resultsEl.hidden = true;
      document.getElementById("stage").style.display = "";
      controls.style.display = "";
      document.getElementById("head").style.display = "";
    }
    renderStack();
    toast("Angret ↩");
  }

  /* ---------- Resultat / ønskeliste ---------- */
  function showResults() {
    resultsEl.hidden = false;
    document.getElementById("stage").style.display = "none";
    controls.style.display = "none";
    document.getElementById("head").style.display = "none";

    const favs = PLACES.filter(p => liked.includes(p.id));
    document.getElementById("results-title").textContent =
      favs.length ? `Dere vil se ${favs.length} ${favs.length === 1 ? "sted" : "steder"} ❤️` : "Ingen favoritter ennå";
    document.getElementById("results-sub").textContent =
      favs.length ? "Lagret på denne enheten. ✕ flytter et sted til «Bortvalgte» på reiseplanen – ingenting slettes for godt." : "Swipe til høyre på det dere har lyst til å se.";
    const remaining = pos < deck.length ? deck.length - pos : freshDeck().length;
    document.getElementById("btn-more").textContent = remaining ? "Swipe videre" : "🔄 Swipe alle på nytt";

    if (!favs.length) {
      gridEl.innerHTML = `<p class="results__empty">Tomt her 🤷 Trykk «Swipe videre» og dra mot ❤️ på stedene dere vil se.</p>`;
    } else {
      gridEl.innerHTML = favs.map(p => {
        const cat = CATMETA[p.cat] || { e: "📍" };
        return `
        <div class="fav" data-id="${p.id}">
          <img class="fav__img" src="${p.images[0].src}" alt="${p.name}" loading="lazy" />
          <div class="fav__body">
            <h3 class="fav__name">${p.name}</h3>
            <p class="fav__region">${cat.e} ${p.region}</p>
            <div class="fav__meta">
              ${p.fromRoad ? `<span>🚗 ${p.fromRoad}</span>` : ""}
              ${p.hike ? `<span>🥾 ${p.hike}</span>` : ""}
              ${p.diff ? `<span>${p.diff === "Ingen" ? "Ingen tur" : p.diff}</span>` : ""}
              ${p.cost ? `<span class="fav__cost">💰 ${p.cost}</span>` : ""}
            </div>
            <a class="fav__map" href="${mapUrl(p)}" target="_blank" rel="noopener">📍 Åpne i kart</a>
          </div>
          <button class="fav__remove" data-id="${p.id}" title="Fjern" aria-label="Fjern">✕</button>
        </div>`;
      }).join("");
    }
    updateProgress();
  }

  /* ---------- Hendelser ---------- */
  document.getElementById("btn-like").addEventListener("click", () => decide("like"));
  document.getElementById("btn-nope").addEventListener("click", () => decide("nope"));
  document.getElementById("btn-undo").addEventListener("click", undo);
  document.getElementById("btn-fav").addEventListener("click", showResults);
  document.getElementById("nav-fav").addEventListener("click", (e) => { e.preventDefault(); showResults(); });

  document.getElementById("btn-more").addEventListener("click", () => {
    resultsEl.hidden = true;
    document.getElementById("stage").style.display = "";
    controls.style.display = "";
    document.getElementById("head").style.display = "";
    if (pos >= deck.length) {
      // Stokken er tom: fortsett med uvurderte kort hvis det finnes flere,
      // ellers en full runde med alle (valgene deres beholdes uansett)
      requeueMode = false;
      const banner = document.getElementById("requeue-banner");
      if (banner) banner.hidden = true;
      const fresh = freshDeck();
      if (fresh.length) { deck = fresh; allMode = false; toast(`${fresh.length} nye kort 🔄`); }
      else { deck = shuffle(PLACES.slice()); allMode = true; toast("Alle er vurdert – ny runde med alle"); }
      pos = 0; history.length = 0;
      updateDeckNote();
    }
    renderStack();
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    if (!liked.length) return;
    if (!confirm(`Vil dere tømme hele ønskelisten (${liked.length} ${liked.length === 1 ? "sted" : "steder"})?\n\nStedene slettes ikke – de flyttes til «Bortvalgte steder» på reiseplanen, der dere kan hente dem tilbake.`)) return;
    liked.forEach(id => addRemoved(id));
    liked = []; saveLiked(); updateFav(); showResults();
    toast("Flyttet til «Bortvalgte» på reiseplanen 🗂️");
  });

  document.getElementById("btn-copy").addEventListener("click", () => {
    const favs = PLACES.filter(p => liked.includes(p.id));
    if (!favs.length) { toast("Listen er tom"); return; }
    const text = "Norgesferie – steder vi vil se:\n" +
      favs.map(p => `• ${p.name} (${p.region}) – ${p.hike}`).join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast("Kopiert! 📋"), () => toast("Kunne ikke kopiere"));
    else toast("Kopiering støttes ikke her");
  });

  // Klikk på ✕ i resultatlisten (event delegation) – flytter til «Bortvalgte», sletter ikke
  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav__remove");
    if (!btn) return;
    const p = byId[btn.dataset.id];
    removeLike(btn.dataset.id);
    addRemoved(btn.dataset.id);
    showResults();
    toast(`«${p ? p.name : "Stedet"}» flyttet til Bortvalgte 🗂️`);
  });

  // Tastatur (preventDefault så piltastene ikke scroller siden samtidig)
  window.addEventListener("keydown", (e) => {
    if (!resultsEl.hidden) return;
    if (e.key === "ArrowRight") { e.preventDefault(); decide("like"); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); decide("nope"); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (nodes[0]) changeImg(nodes[0], +1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (nodes[0]) changeImg(nodes[0], -1); }
    else if (e.key.toLowerCase() === "z") undo();
  });

  /* ---------- Start ---------- */
  injectNorwaySymbol();
  initStageMap();
  updateFav();
  renderStack();
})();
