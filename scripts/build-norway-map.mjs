/* =========================================================================
   Lager et forenklet SVG-omriss av Norge (norway-map.js) til mini-kart.
   Kjør:  node scripts/build-norway-map.mjs
   ========================================================================= */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "norway-map.js");

const SOURCES = [
  "https://raw.githubusercontent.com/georgique/world-geojson/develop/countries/norway.json",
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/NOR.geo.json",
];

async function getGeo() {
  for (const url of SOURCES) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "NorgesferieMap/1.0" } });
      if (!r.ok) continue;
      return await r.json();
    } catch (_) {}
  }
  throw new Error("Klarte ikke hente Norge-GeoJSON");
}

const PI = Math.PI;
const merc = (lng, lat) => [lng * PI / 180, Math.log(Math.tan(PI / 4 + lat * PI / 180 / 2))];

function collectRings(geo) {
  // finn geometrien (Feature / FeatureCollection / rå geometry)
  let geom = geo;
  if (geo.type === "FeatureCollection") geom = geo.features[0].geometry;
  else if (geo.type === "Feature") geom = geo.geometry;

  const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
  const rings = polys.map(p => p[0]); // ytre ring i hver polygon

  // behold fastlands-Norge (dropp Svalbard / Jan Mayen)
  const inBox = r => {
    let lng = 0, lat = 0;
    for (const [x, y] of r) { lng += x; lat += y; }
    lng /= r.length; lat /= r.length;
    return lng > 3 && lng < 32 && lat > 57 && lat < 72;
  };
  return rings.filter(inBox).sort((a, b) => b.length - a.length).slice(0, 9);
}

const geo = await getGeo();
const rings = collectRings(geo);

// global mercator-bbox
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
const mrings = rings.map(r => r.map(([lng, lat]) => {
  const [mx, my] = merc(lng, lat);
  if (mx < x0) x0 = mx; if (mx > x1) x1 = mx;
  if (my < y0) y0 = my; if (my > y1) y1 = my;
  return [mx, my];
}));

const W = 150;
const H = +(W * ((y1 - y0) / (x1 - x0))).toFixed(1);

function toPath(mring) {
  let d = "", prev = "";
  for (let i = 0; i < mring.length; i++) {
    const [mx, my] = mring[i];
    const sx = ((mx - x0) / (x1 - x0) * W).toFixed(1);
    const sy = ((1 - (my - y0) / (y1 - y0)) * H).toFixed(1);
    const pt = sx + " " + sy;
    if (pt === prev) continue; // dropp like punkter
    d += (i === 0 ? "M" : "L") + pt + " ";
    prev = pt;
  }
  return d.trim() + " Z";
}

const path = mrings.map(toPath).join(" ");

const src = `/* Auto-generert av scripts/build-norway-map.mjs – forenklet Norge-omriss. */
window.NORWAY = {
  viewBox: "0 0 ${W} ${H}",
  W: ${W}, H: ${H},
  b: { x0: ${x0}, x1: ${x1}, y0: ${y0}, y1: ${y1} },
  path: ${JSON.stringify(path)},
  // projiser lat/lng til samme koordinatrom som omrisset
  project: function (lat, lng) {
    var PI = Math.PI, x = lng * PI / 180, y = Math.log(Math.tan(PI / 4 + lat * PI / 180 / 2)), b = this.b;
    return {
      x: (x - b.x0) / (b.x1 - b.x0) * this.W,
      y: (1 - (y - b.y0) / (b.y1 - b.y0)) * this.H
    };
  }
};
`;

writeFileSync(OUT, src);
console.log(`Skrev norway-map.js  ·  ${rings.length} polygon(er)  ·  viewBox 0 0 ${W} ${H}  ·  path ${path.length} tegn`);
