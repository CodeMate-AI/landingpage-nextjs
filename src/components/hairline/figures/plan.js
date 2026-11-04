/**
 * Plan: loose blocks of different heights scattered on the left, and a row
 * of step plates on the right joined by a rail, ending in a round
 * plate for the outcome. The pointer's x scrubs how far the plan has come:
 * the blocks lift off in order and arc onto their steps, one after another,
 * leaving a dashed footprint where each lay; a rail joins the steps. The block at the front of the
 * work takes the bright edge. At rest the plan is half built, one block in
 * the air. The slider is the height of the arc.
 *
 * The pattern: scrub. One spring for progress, every block's travel read
 * from it in order, a hit test on the pointer's screen x (which never moves
 * with the figure), and blocks re-ordered in paint as they pass each other.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, rrect, prism, ringAt, poly, seg, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const PH = 3, REST_P = 0.5, AMAX = 18;
// steps along one screen row (x + y constant), the last one the outcome
const STEPS = [[50, 70], [68, 52], [86, 34], [106, 14]];
// where each block starts, its half size and height
const LOOSE = [[30, 58, 4.5, 9], [14, 56, 4, 7], [30, 86, 5, 11], [4, 72, 4.5, 8]];
const N = STEPS.length;
/** Block k's share of its trip at progress p: each starts 0.2 after the one before and takes 0.4. */
const trip = (p, k) => clamp((p - k * 0.2) / 0.4, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let arc = value;

  const C = Cam(45, 0.5, 2.9);
  // fitted to the blocks and the steps, with a block at the top of the highest arc over each end
  const ends = [...LOOSE.map(([x, y]) => [x, y]), ...STEPS];
  fit(C, [...ends.map(([x, y]) => [x, y, 0]), [14, 56, AMAX + 12], [86, 34, AMAX + 12]], 200, 140);
  const P = proj(C), front = facing(C);
  const sxL = P(10, 90, 0)[0], sxR = P(106, 14, 0)[0];

  const g = mk("g", {}, svg);
  // where each block lay, dashed once it has left
  const feet = LOOSE.map(() => mk("path", { class: "nf dash" }, g));
  // the rail joining the steps, then the plates; the last is round, the outcome
  mk("path", { d: STEPS.slice(1).map((s, k) => seg(P(...STEPS[k], PH), P(...s, PH))).join(""), class: "nf lo" }, g);
  STEPS.forEach(([x, y], k) => {
    const r = k === N - 1 ? 10 : 8, rr = k === N - 1 ? 10 : 2.5, n = k === N - 1 ? 14 : 4;
    put(solid(g), prism(P, front, rrect(x - r, y - r, x + r, y + r, rr, n), rrect(x - r + 1.2, y - r + 1.2, x + r - 1.2, y + r - 1.2, rr - 1.2, n), 0, PH));
  });

  const blocks = LOOSE.map(([x, y, s, h], k) => {
    const [ring, inner] = rings(-s, -s, s, s, 2, 0.9);
    const shift = (rg, cx, cy) => rg.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
    return { k, x, y, h, el: solid(g), at: [x, y], drawn: "", ring, inner, shift };
  });
  const prog = spring(REST_P, { eps: 0.002 });
  let front_k = -1;

  function draw() {
    const p = prog.x;
    blocks.forEach((b) => {
      const t = ease(trip(p, b.k)), [tx, ty] = STEPS[b.k];
      const cx = lerp(b.x, tx, t), cy = lerp(b.y, ty, t), z = PH * t + arc * Math.sin(Math.PI * t);
      b.at = [cx, cy];
      const key = cx.toFixed(2) + "," + cy.toFixed(2) + "," + z.toFixed(2);
      if (key !== b.drawn) {
        b.drawn = key;
        put(b.el, prism(P, front, b.shift(b.ring, cx, cy), b.shift(b.inner, cx, cy), z, z + b.h));
        feet[b.k].setAttribute("d", t > 0.02 ? poly(ringAt(P, b.shift(b.ring, b.x, b.y), 0)) : "");
      }
    });
    // back to front by where each block is now: move the groups, never redraw them
    const sorted = blocks.slice().sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]));
    for (let i = 1; i < sorted.length; i++) if (sorted[i - 1].el.g.nextSibling !== sorted[i].el.g) sorted[i - 1].el.g.after(sorted[i].el.g);
    // the front of the work: the last block to have set off, read from the spring's target
    let f = 0;
    blocks.forEach((b) => { if (trip(prog.t, b.k) > 0) f = b.k; });
    if (f !== front_k) { front_k = f; blocks.forEach((b) => b.el.sil.classList.toggle("hi", b.k === f)); }
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
      let f = 0;
      blocks.forEach((b) => { if (trip(prog.t, b.k) > 0) f = b.k; });
      read.textContent = "step " + (f + 1);
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { arc = clamp(v, 0, AMAX); blocks.forEach((b) => { b.drawn = ""; }); B.wake(); },
    destroy: bag.dispose,
  };
}

const plan = {
  name: "plan",
  means: "Loose blocks become a plan: as the pointer moves right they lift off in order and land on their steps.",
  rules: [1, 2, 5, 6],
  range: [6, 11, 18],
  tour: [[117, 196], [258, 196], [360, 196], null],
  mount,
};

export default plan;
