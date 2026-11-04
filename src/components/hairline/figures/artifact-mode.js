/**
 * Artifact Mode: four sheets fanned out from a round origin, each a different
 * deliverable by its layout: a diagram (three nodes joined), a slide (a title
 * bar over two blocks), a canvas (a grid of four frames) and a deck (a frame
 * within a frame). The sheet under the pointer is drawn out of the fan and
 * lifted, taking the bright edge; a dashed footprint stays where it lay and a
 * dashed guide runs back to the origin. The others settle, staggered from
 * it. At rest the slide is out. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, a hit test on
 * each sheet's resting centre on screen, and paint order kept by moving
 * groups as a sheet rises over the others.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, rrect, circ, prism, ringAt, poly, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const R0 = 12, LEN = 40, HW = 13, TH = 1.2, DZ = 1.6, OZ = 5, PULL = 0.5, REST_I = 1, STEP = 45, LMAX = 22;
const ANG = [-200, -158, -116, -74].map((d) => (d * Math.PI) / 180);
// what each sheet carries, in its own frame (u out from the origin, v across): closed rings and open segments
const R = (u0, v0, u1, v1, r) => rrect(u0, v0, u1, v1, r, 3).map((q) => [q.u, q.v]);
const LAYOUT = [
  { rings: [R(31, -8, 35, -4, 2), R(31, 4, 35, 8, 2), R(16, -2, 20, 2, 2)], segs: [[[33, -4], [33, 4]], [[31, -6], [20, 0]]] },
  { rings: [R(31, -9, 36, 9, 1), R(15, -9, 28, -1, 1.2), R(15, 1, 28, 9, 1.2)], segs: [] },
  { rings: [R(26, -9, 36, -1, 1), R(26, 1, 36, 9, 1), R(14, -9, 24, -1, 1), R(14, 1, 24, 9, 1)], segs: [] },
  { rings: [R(14, -9, 36, 9, 1.5), R(18, -5, 32, 5, 1.2)], segs: [] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 3.1);
  const far = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
  fit(C, [...ANG.flatMap((a) => [[...far(a, R0 + LEN + PULL * LMAX + 2), 0], [...far(a, R0 + LEN + PULL * LMAX), LMAX + 8]]), [12, 12, 0], [-12, 12, 0], [12, -12, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // guides first: under the sheets and the origin
  const foot = mk("path", { class: "nf dash" }, g), tether = mk("path", { class: "nf dash" }, g);
  const fan = mk("g", {}, g);
  const sheets = ANG.map((a, k) => {
    const c = Math.cos(a), s = Math.sin(a);
    /** A point of this sheet's frame, pulled out by o, as world [x, y]. */
    const W = (u, v, o) => [(u + o) * c - v * s, (u + o) * s + v * c];
    const turn = (ring, o) => ring.map((q) => { const [u, v] = W(q.u, q.v, o); return { u, v, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }; });
    const grp = mk("g", {}, fan);
    return { k, a, W, turn, grp, el: solid(grp), marks: mk("path", { class: "nf lo" }, grp), z: tween(0), last: NaN };
  });
  const [ring, inner] = rings(R0, -HW, R0 + LEN, HW, 2.4, 0.9);
  // the origin, in front of the fan
  put(solid(g), prism(P, front, circ(9, 14).map((q) => ({ ...q })), circ(7.8, 14), 0, OZ));

  function draw(sh, t) {
    if (t === sh.last) return;
    sh.last = t;
    const o = PULL * t, z0 = sh.k * DZ + t, z1 = z0 + TH;
    put(sh.el, prism(P, front, sh.turn(ring, o), sh.turn(inner, o), z0, z1));
    const L = LAYOUT[sh.k], at = ([u, v]) => P(...sh.W(u, v, o), z1);
    sh.marks.setAttribute("d", L.rings.map((r) => poly(r.map(at))).join("") + L.segs.map(([p, q]) => seg(at(p), at(q))).join(""));
  }

  let act = null, on = REST_I;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    sheets.forEach((sh) => { draw(sh, tval(sh.z, now)); if (!tdone(sh.z, now)) moving = true; });
    // where the drawn-out sheet lay, and a guide from the origin to it
    const sh = sheets[on], t = tval(sh.z, now);
    foot.setAttribute("d", t > 0.5 ? poly(ringAt(P, sh.turn(ring, 0), sh.k * DZ)) : "");
    tether.setAttribute("d", t > 0.5 ? seg(P(...sh.W(9, 0, 0), OZ), P(...sh.W(R0, 0, PULL * t), sh.k * DZ + t)) : "");
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each sheet's resting centre on screen; they never move
  const targets = sheets.map((sh) => P(...sh.W(R0 + LEN * 0.6, 0, 0), sh.k * DZ));
  /** The sheet whose resting centre is nearest the pointer, within reach; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 46;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.4); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Draws sheet a out of the fan (-1 the rest pose's); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    sheets.forEach((sh) => {
      tset(sh.z, sh.k === on ? (a >= 0 ? lift : lift * 0.7) : 0, now, Math.abs(sh.k - from) * STEP);
      sh.el.sil.classList.toggle("hi", sh.k === on);
      sh.last = NaN;
    });
    // the risen sheet is painted over the rest of the fan; the others keep their stacking order
    sheets.filter((sh) => sh.k !== on).concat(sheets[on]).forEach((sh) => fan.appendChild(sh.grp));
    read.textContent = a < 0 ? "rest" : ["diagram", "slide", "canvas", "deck"][a];
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = clamp(v, 0, LMAX); setActive(act, true); },
    destroy: bag.dispose,
  };
}

const artifactMode = {
  name: "artifact-mode",
  means: "A fan of artifacts from one origin: the sheet under the pointer is drawn out and lifted, a guide tying it back.",
  rules: [1, 2, 5, 6],
  range: [8, 14, 22],
  tour: [[240, 178], [102, 216], [301, 199], null],
  mount,
};

export default artifactMode;
