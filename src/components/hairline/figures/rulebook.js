/**
 * Rulebook: an open book lying on its cover, its pages rising gently to the
 * spine. Each page holds a few raised rules, a heading and indented rules
 * under it, with a small mark in the margin of each. The rule under the
 * pointer lifts off its page and takes the bright edge, its neighbours rise a
 * little after it, and a sticky flag slides out of the page edge beside it.
 * At rest one rule on the right page is already raised and flagged. The
 * slider is the lift, in world units.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, a dashed
 * footprint left on the page under the chosen rule, and a hit test on the
 * resting page surface, so a rule rising out from under the pointer cannot
 * flip the choice.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, unproj, rings, hull, prism, run, poly, open, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, register, pointer, disposer,
} = HL;

const PW = 70, PD = 88, GAP = 4, CZ = 2, TOP = 6, RISE = 9, BT = 1.8, BW = 4;
const PAGES = [0, PW + GAP], X1 = 2 * PW + GAP;
// a few rules per page: [y, x offset from the page edge, length]; the first of each is the heading
const ROWS = [
  [[18, 14, 44], [36, 19, 34], [54, 19, 38]],
  [[16, 14, 46], [33, 19, 36], [50, 19, 40], [67, 19, 26]],
];
const FLAG = 9, FT = 0.8, REST_I = 4, REST_K = 0.6, NEAR = [1, 0.5, 0.22], STEP = 45, LMAX = 26;

/** The page's surface height at u: each page rises from its outer edge to the spine, as an open book lies. */
const surf = (p, u) => TOP + RISE * (p === 0 ? u / PW : 1 - (u - PAGES[1]) / PW);

const RULES = ROWS.flatMap((rows, p) => rows.map(([y, dx, len]) => {
  const px = PAGES[p], x0 = px + dx;
  const [ring, inner] = rings(x0, y - BW / 2, x0 + len, y + BW / 2, 2, 0.8);
  // the flag sits on the page's outer edge: the far edge for the left page, the near one for the right
  const edge = p === 0 ? px : px + PW;
  return { p, y, ring, inner, edge, mark: [px + 7, y] };
}));

/** Each rule's lift when rule a is chosen: the rule itself, and its neighbours on the same page less, the farther the less. */
const lifts = (a, L) => RULES.map((r, i) => {
  const d = Math.abs(i - a);
  return r.p === RULES[a].p && d < NEAR.length ? NEAR[d] * L : 0;
});

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let L = value;

  // fitted to the book with flags out and a heading at the highest lift, so nothing leaves the frame
  const C = Cam(45, 0.5, 1.6);
  const zMax = TOP + RISE + BT + LMAX;
  fit(C, [[-5 - FLAG, -5, 0], [X1 + 5 + FLAG, PD + 5, 0], [X1 + 5, -5, 0], [-5, PD + 5, 0], [14, 16, zMax], [X1 - 10, 16, zMax]], 200, 166);
  const P = proj(C), front = facing(C);

  /** A solid between two heights that vary along u, the way prism stands one between two flat ones. */
  const at = (ring, z) => ring.map((q) => P(q.u, q.v, z(q.u)));
  const block = (ring, inner, zb, zt) => ({
    sil: poly(hull(at(ring, zb).concat(at(ring, zt)))),
    crease: open(at(run(inner, front), zt)),
  });

  const g = mk("g", {}, svg);
  const [cover, coverIn] = rings(-5, -5, X1 + 5, PD + 5, 6, 1.6);
  put(solid(g), prism(P, front, cover, coverIn, 0, CZ));

  const rules = [];
  PAGES.forEach((px, p) => {
    // the page block, one leaf line showing on its near faces
    const [ring, inner] = rings(px, 0, px + PW, PD, 3, 1.6);
    const top = (u) => surf(p, u);
    put(solid(g), block(ring, inner, () => CZ, top));
    mk("path", { d: open(at(run(ring, front), (u) => (CZ + top(u)) / 2)), class: "nf lo" }, g);
    // the spine, a dim seam on the cover between the two pages
    if (p === 0) mk("path", { d: seg(P(PW + GAP / 2, 1, CZ), P(PW + GAP / 2, PD - 1, CZ)), class: "nf lo" }, g);

    const mine = RULES.filter((r) => r.p === p);
    for (const r of mine) place(flatDot(g, C, 1.2, "dot off"), P(r.mark[0], r.mark[1], surf(p, r.mark[0])));
    for (const r of mine) {
      // the flag first, then the footprint guide behind the rule it belongs to
      rules.push({ ...r, flag: solid(g), foot: mk("path", { class: "nf dash" }, g), s: solid(g), z: tween(0), out: tween(0), last: -1, lastOut: -1 });
    }
  });

  function draw(r, z, out) {
    if (Math.abs(z - r.last) > 0.01 || r.dirty) {
      r.last = z;
      const base = (u) => surf(r.p, u) + z;
      put(r.s, block(r.ring, r.inner, base, (u) => base(u) + BT));
      r.foot.setAttribute("d", r.on && z > 0.4 ? poly(at(r.ring, (u) => surf(r.p, u))) : "");
    }
    if (Math.abs(out - r.lastOut) > 0.01 || r.dirty) {
      r.lastOut = out;
      // the flag tucks under the page edge and slides out by `out`; tucked away, it is not drawn
      const [x0, x1] = r.p === 0 ? [r.edge - out, r.edge + 5] : [r.edge - 5, r.edge + out];
      const zf = surf(r.p, r.edge) + 0.6;
      if (out < 1) { r.flag.sil.setAttribute("d", ""); r.flag.cr.setAttribute("d", ""); }
      else { const [fr, fi] = rings(x0, r.y - 3, x1, r.y + 3, 1.5, 0.6); put(r.flag, prism(P, front, fr, fi, zf, zf + FT)); }
    }
    r.dirty = false;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rules) {
      draw(r, tval(r.z, now), tval(r.out, now));
      if (!tdone(r.z, now) || !tdone(r.out, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The rule nearest the pointer on the resting page surface, or -1 off the pages. */
  function hit([sx, sy]) {
    let [x, y] = unproj(C, sx, sy, TOP + RISE / 2);
    [x, y] = unproj(C, sx, sy, surf(x > PW + GAP / 2 ? 1 : 0, clamp(x, 0, X1)));
    const p = x >= -2 && x <= PW + 1 ? 0 : x >= PW + GAP - 1 && x <= X1 + 2 ? 1 : -1;
    if (p < 0 || y < 4 || y > PD - 4) return -1;
    let best = -1;
    RULES.forEach((r, i) => { if (r.p === p && (best < 0 || Math.abs(y - r.y) < Math.abs(y - RULES[best].y))) best = i; });
    return Math.abs(y - RULES[best].y) > 9 ? -1 : best;
  }

  let act = null;
  /** Lifts and flags rule a (-1 returns to rest), the stagger spreading out from the rule chosen or let go. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : REST_I;
    act = a;
    const on = a >= 0 ? a : REST_I, to = lifts(on, a >= 0 ? L : REST_K * L);
    rules.forEach((r, i) => {
      r.on = i === on;
      r.dirty = true;
      tset(r.z, to[i], now, Math.abs(i - from) * STEP);
      tset(r.out, r.on ? FLAG : 0, now, 0);
      r.s.sil.classList.toggle("hi", r.on);
      r.flag.sil.classList.toggle("hi", r.on);
    });
    read.textContent = a < 0 ? "rest" : "rule " + String(a + 1).padStart(2, "0");
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { L = clamp(v, 0, LMAX); setActive(act, true); },
    destroy: bag.dispose,
  };
}

const rulebook = {
  name: "rulebook",
  means: "An open rulebook: the rule under the pointer lifts off its page and is flagged, its neighbours rising after it.",
  rules: [1, 2, 4, 5],
  range: [8, 16, 26],
  tour: [[240, 195], [168, 142], [276, 174], null],
  mount,
};

export default rulebook;
