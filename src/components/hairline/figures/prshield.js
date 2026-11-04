/**
 * Security and quality: a code panel on the left, a shield on the right, and
 * between them three inspection markers of different shapes: a triangle for
 * security risks, a diamond for code smells, a circle for maintainability.
 * Each marker has a lead back to the row it inspects and a lead on to the
 * shield. The marker under the pointer is checking: it floats up, its leads
 * following it, its row rises, both its leads take the bright edge, and the shield's check lights.
 * The others settle, staggered from it. At rest one marker is checking. The
 * slider is the marker's rise.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each marker's resting centre on screen, so a rising marker cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, open, seg, fillet, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

/** The world point at screen-across h and screen-down v. */
const at = (h, v) => [h + v, v - h];
const REST_I = 0, STEP = 60, LMAX = 5, MH = 1.5, PW = 20, PD = 15, PH = 2, SH = 3;
const PANEL = at(-32, 0), SHIELD = at(32, 0);
const ROWS = [[-10, 22], [0, 26], [10, 18]], FILLERS = [[-5, 16], [5, 20]];
const SPOTS = [at(0, -20), at(0, 0), at(0, 20)];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** The ground point seen at (a across, b down) from (cx, cy) on screen, undoing the ground's foreshortening. */
const scr = (cx, cy, a, b) => [cx + a * A[0] + b * 2 * Bv[0], cy + a * A[1] + b * 2 * Bv[1]];
/** A closed outline as a ring of samples, each with its outward normal, for prism(). */
function ringOf(pts) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([u, v], i) => {
    const [ax, ay] = pts[(i + pts.length - 1) % pts.length], [bx, by] = pts[(i + 1) % pts.length];
    let nu = by - ay, nv = ax - bx;
    if (nu * (u - cx) + nv * (v - cy) < 0) { nu = -nu; nv = -nv; }
    const l = Math.hypot(nu, nv) || 1;
    return { u, v, nu: nu / l, nv: nv / l };
  });
}
const inset = (ring, k) => {
  const cx = ring.reduce((s, q) => s + q.u, 0) / ring.length, cy = ring.reduce((s, q) => s + q.v, 0) / ring.length;
  return ring.map((q) => ({ ...q, u: cx + (q.u - cx) * k, v: cy + (q.v - cy) * k }));
};
// the shield and the marker shapes, in the screen's own axes
const SHIELD_PTS = [[-13, -14], [13, -14], [13, 3], [0, 17], [-13, 3]], SHIELD_R = [2.5, 2.5, 7, 2, 7];
const shieldRing = ringOf(fillet(SHIELD_PTS.map(([a, b]) => scr(...SHIELD, a, b)), SHIELD_R, 6));
/** Where the shield's left side is, at height b on it. */
const shieldEdge = (b) => (b <= 3 ? -13 : -13 * (17 - b) / 14) + 1.5;
const SHAPES = [
  [[0, -4.8], [4.6, 3.4], [-4.6, 3.4]],
  [[0, -5], [5, 0], [0, 5], [-5, 0]],
];
const shapeRing = (k, [x, y]) => (k < 2
  ? ringOf(fillet(SHAPES[k].map(([a, b]) => scr(x, y, a, b)), SHAPES[k].map(() => 1.1), 5))
  : ringOf(Array.from({ length: 36 }, (_, i) => scr(x, y, 4.4 * Math.cos(i * Math.PI / 18), 4.4 * Math.sin(i * Math.PI / 18)))));
const CHECK = [[-5.5, 0], [-1.5, 4], [6.5, -5]].map(([a, b]) => scr(...SHIELD, a, b));
const NAMES = ["security", "code smell", "maintainability"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.9);
  const [px, py] = PANEL;
  fit(C, [[px - PW, py - PD, 0], [px + PW, py - PD, PH], [px - PW, py + PD, 0], [px + PW, py + PD, 0],
    ...shieldRing.map((q) => [q.u, q.v, 0]), ...shieldRing.map((q) => [q.u, q.v, SH])], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the panel: plate, header rule, and the rows that are not inspected
  put(solid(g), prism(P, front, ...rings(px - PW, py - PD, px + PW, py + PD, 3.5, 1.3), 0, PH));
  mk("path", { d: FILLERS.map(([v, l]) => seg(P(px - PW + 5, py + v, PH), P(px - PW + 5 + l, py + v, PH))).join(""), class: "nf lo" }, g);

  // each marker's row, its two leads, and the marker
  const items = SPOTS.map((at0, k) => {
    const [v, l] = ROWS[k], x1 = px - PW + 5 + l, y = py + v, b = (at0[0] + at0[1] - SHIELD[0] - SHIELD[1]) * Math.SQRT1_2 / 2;
    const end = scr(...SHIELD, shieldEdge(b), b);
    return { k, at: at0, x1, y, end, row: solid(g), rowRing: rings(px - PW + 5, y - 1.2, x1, y + 1.2, 1.2, 0.5), z: tween(0), last: NaN,
      back: mk("path", { class: "nf lo" }, g), on: mk("path", { class: "nf lo" }, g) };
  });
  // the shield, and the check on it
  const shield = solid(g);
  put(shield, prism(P, front, shieldRing, inset(shieldRing, 0.86), 0, SH));
  const check = mk("path", { d: open(CHECK.map(([x, y]) => P(x, y, SH))), class: "sil nf" }, g);
  items.forEach((it) => {
    it.el = solid(g);
    it.ring = shapeRing(it.k, it.at);
    it.inner = inset(it.ring, 0.62);
  });

  let on = REST_I, act = null;
  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    put(it.row, prism(P, front, ...it.rowRing, PH, PH + 0.5 + z * 0.15));
    // the marker floats, flat, so its shape stays its shape; the leads follow it up
    put(it.el, prism(P, front, it.ring, it.inner, z, z + MH));
    it.back.setAttribute("d", seg(P(it.x1 + 1, it.y, PH), P(...it.at, z + 0.5)));
    it.on.setAttribute("d", seg(P(...it.at, z + 0.5), P(...it.end, 0)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each marker's resting centre on screen; they never move
  const targets = items.map((it) => P(...it.at, MH));
  /** The marker nearest the pointer; -1 only when the pointer is far from all three. */
  function hit([sx, sy]) {
    let best = -1, bd = 120;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot((sx - tx) * 0.5, sy - ty); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Sets marker a checking (-1 the rest pose's, a little lower); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    items.forEach((it) => {
      tset(it.z, it.k === on ? (a >= 0 ? lift : lift * 0.7) : 0, now, Math.abs(it.k - from) * STEP);
      it.last = NaN;
      it.el.sil.classList.toggle("hi", it.k === on);
      it.row.sil.classList.toggle("hi", it.k === on);
      it.back.setAttribute("class", it.k === on ? "nf hi" : "nf lo");
      it.on.setAttribute("class", it.k === on ? "nf hi" : "nf lo");
    });
    check.setAttribute("class", a >= 0 ? "hi nf" : "sil nf");
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = clamp(v, 1, LMAX); setActive(act, true); },
    destroy: bag.dispose,
  };
}

const prshield = {
  name: "prshield",
  means: "A code panel checked against a shield: the marker under the pointer inspects its row and lights the shield's check.",
  rules: [1, 2, 4, 10],
  range: [1.5, 2.5, 5],
  tour: [[200, 128], [200, 166], [200, 204], null],
  mount,
};

export default prshield;
