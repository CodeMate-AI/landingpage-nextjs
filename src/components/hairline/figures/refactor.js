/**
 * Refactor: six code lines tangled on the left, thin bars of different
 * lengths lying at odd angles and heights, and on the right the dashed
 * slots of a clean two-by-three grid of modules. The pointer's x scrubs the
 * refactor: one after another each bar lifts, turns square, thickens into a
 * module block and lands in its slot. Nothing is lost on the way: six lines
 * become six modules. The bar being reworked takes the bright edge. At rest
 * the refactor has begun, one module in place. The slider is the arc.
 *
 * The pattern: scrub. One spring for progress, each bar's travel read from
 * it in order, a hit test on the pointer's screen x, which never moves, and
 * blocks re-ordered in paint as they pass each other.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, ringAt, poly, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const REST_P = 0.3, AMAX = 16, BW = 7.5, BD = 4.6, BH = 4;
// the tangle: centre, length, angle in degrees, height off the ground
const TANGLE = [[-34, 18, 26, 30, 1.5], [-26, 30, 22, -25, 0.5], [-38, 32, 18, 75, 2.6], [-22, 16, 20, -60, 3.6], [-32, 30, 16, 5, 0], [-28, 22, 24, -85, 2.2]];
// the grid's slots, back to front
const SLOTS = [[8, -32], [26, -32], [8, -18], [26, -18], [8, -4], [26, -4]];
/** Bar k's share of its trip at progress p: each starts 0.14 after the one before and takes 0.26. */
const trip = (p, k) => clamp((p - k * 0.14) / 0.26, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);
/** A rounded bar of half sizes hw, hd, turned by a round (cx, cy), as [ring, inner]. */
function bar(cx, cy, hw, hd, a) {
  const c = Math.cos(a), s = Math.sin(a), r = Math.min(hd, 2), b = Math.min(0.9, hd * 0.45);
  return rings(-hw, -hd, hw, hd, r, b).map((ring) => ring.map((q) => ({
    u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  })));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let arc = value;

  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-50, 34, 0], [-38, 46, 0], [-12, 6, 4], [8 - BW, -32 - BD, 0], [26 + BW, -4 + BD, 0], [26 + BW, -32 - BD, BH],
    [-10, 0, AMAX + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(-30, 24, 0)[0], sxR = P(17, -18, 0)[0];

  const g = mk("g", {}, svg);
  // the grid's slots, dashed on the ground, under everything
  SLOTS.forEach(([x, y]) => mk("path", { d: poly(ringAt(P, rings(x - BW, y - BD, x + BW, y + BD, 2, 0.9)[0], 0)), class: "nf dash" }, g));
  const items = TANGLE.map(([x, y, len, deg, z0], k) => ({ k, x, y, hl: len / 2, a: (deg * Math.PI) / 180, z0, el: solid(g), at: [x, y], drawn: "" }));
  const prog = spring(REST_P, { eps: 0.002 });
  let lit = -2;

  function draw() {
    const p = prog.x;
    items.forEach((it) => {
      const t = ease(trip(p, it.k)), [tx, ty] = SLOTS[it.k];
      const cx = lerp(it.x, tx, t), cy = lerp(it.y, ty, t), z = lerp(it.z0, 0, t) + arc * Math.sin(Math.PI * t);
      it.at = [cx, cy];
      const key = [cx, cy, z].map((v) => v.toFixed(2)).join(",");
      if (key === it.drawn) return;
      it.drawn = key;
      put(it.el, prism(P, front, ...bar(cx, cy, lerp(it.hl, BW, t), lerp(1.3, BD, t), lerp(it.a, 0, t)), z, z + lerp(1.1, BH, t)));
    });
    // back to front by where each bar is now: move the groups, never redraw them
    const sorted = items.slice().sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]));
    for (let i = 1; i < sorted.length; i++) if (sorted[i - 1].el.g.nextSibling !== sorted[i].el.g) sorted[i - 1].el.g.after(sorted[i].el.g);
    // the bar being reworked, read from the spring's target: the last to have set off
    let f = 0;
    items.forEach((it) => { if (trip(prog.t, it.k) > 0) f = it.k; });
    if (f !== lit) { lit = f; items.forEach((it) => it.el.sil.classList.toggle("hi", it.k === f)); }
  }

  const B = register(stage, (dt) => {
    const m = stepS(prog, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: ([sx]) => {
      prog.t = clamp((sx - sxL) / (sxR - sxL), 0, 1);
      let f = -1;
      items.forEach((it) => { if (trip(prog.t, it.k) > 0) f = it.k; });
      read.textContent = f < 0 ? "tangle" : "module " + (f + 1);
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { arc = clamp(v, 0, AMAX); items.forEach((it) => { it.drawn = ""; }); B.wake(); },
    destroy: bag.dispose,
  };
}

const refactor = {
  name: "refactor",
  means: "Tangled code lines become modules: as the pointer moves right, each bar straightens into a block in a clean grid.",
  rules: [1, 2, 5, 6],
  range: [4, 9, 16],
  tour: [[84, 174], [200, 176], [304, 180], null],
  mount,
};

export default refactor;
