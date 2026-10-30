/**
 * Actionable improvements: on the left an original structure, three blocks of
 * uneven height set askew on a plate; on the right the same three blocks as
 * dashed footprints on a neat grid; between them a suggestion node on short
 * leads. The pointer's x scrubs the suggestions: one after another a block
 * rises out of its footprint, square and level, and a check lands on it,
 * while the block it replaces on the left dims and sinks flat. The rising block takes the
 * bright edge; once all three are up, the plate does. At rest the first
 * suggestion is applied. The slider is the improved blocks' height.
 *
 * The pattern: scrub. One spring for progress, each block read from it in
 * order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, ringAt, poly, open, seg, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

/** The world point at screen-across h and screen-down v. */
const at = (h, v) => [h + v, v - h];
const REST_P = 0.39, PW = 20, PH = 2, NR = 6.5, NH = 2.6, HMAX = 5;
const OLD = at(-31, -10), NEW = at(31, 10);
// the same three blocks: askew on the left as [x, y, half w, half d, tilt, height]; on the grid on the right as [x, y, half w, half d]
const ASKEW = [[-3, -10, 12, 4.5, -9, 2.6], [-8, 8, 5.5, 6, 11, 3], [8, 7, 6, 5.5, -7, 1.6]];
const GRID = [[0, -9, 15, 5], [-8, 6, 7, 7], [8, 6, 7, 7]];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** Three points in the screen's own axes about (x, y): a check mark. */
const check = (x, y, s) => [[-3.4, 0.2], [-1, 2.4], [3.6, -2.4]].map(([a, b]) => [x + a * s * A[0] + b * s * 2 * Bv[0], y + a * s * A[1] + b * s * 2 * Bv[1]]);
/** A chevron in the screen's own axes about (x, y), pointing right. */
const chevron = (x, y, s) => [[-2.2, -3.2], [2.2, 0], [-2.2, 3.2]].map(([a, b]) => [x + a * s * A[0] + b * s * 2 * Bv[0], y + a * s * A[1] + b * s * 2 * Bv[1]]);
/** Block k's share at progress p: each starts 0.27 after the one before and takes 0.27. */
const trip = (p, k) => clamp((p - 0.12 - k * 0.27) / 0.27, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);
/** A rounded block at (cx, cy), turned by deg, as [ring, inner]. */
function turned(cx, cy, hw, hd, deg) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return rings(-hw, -hd, hw, hd, 1.6, 0.8).map((ring) => ring.map((q) => ({
    u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  })));
}
const NONE = { sil: "", crease: "" };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let bh = value;

  const C = Cam(45, 0.5, 2.6);
  fit(C, [OLD, NEW].flatMap(([x, y]) => [[x - PW, y - PW, 0], [x + PW, y - PW, 0], [x - PW, y + PW, 0], [x + PW, y + PW, 0]]).concat([[OLD[0], OLD[1] - 10, PH + 5], [NEW[0], NEW[1] - 9, PH + HMAX + 1]]), 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(...OLD, 0)[0], sxR = P(...NEW, 0)[0] + 30;

  const g = mk("g", {}, svg);
  // the leads between the plates and the node, centre to centre, hidden under both
  mk("path", { d: seg(P(...OLD, 0), P(0, 0, 0)), class: "nf lo" }, g);
  const out = mk("path", { d: seg(P(0, 0, 0), P(...NEW, 0)), class: "nf" }, g);

  // the original: plate and blocks, back to front
  put(solid(g), prism(P, front, ...rings(OLD[0] - PW, OLD[1] - PW, OLD[0] + PW, OLD[1] + PW, 3.5, 1.3), 0, PH));
  const olds = ASKEW.map(([x, y, hw, hd, deg, h]) => ({ h, ring: turned(OLD[0] + x, OLD[1] + y, hw, hd, deg), el: solid(g) }));

  // the improved: plate, the grid's footprints, then the blocks and their checks
  const plate = solid(g);
  put(plate, prism(P, front, ...rings(NEW[0] - PW, NEW[1] - PW, NEW[0] + PW, NEW[1] + PW, 3.5, 1.3), 0, PH));
  const news = GRID.map(([x, y, hw, hd]) => {
    const cx = NEW[0] + x, cy = NEW[1] + y, ring = rings(cx - hw, cy - hd, cx + hw, cy + hd, 1.6, 0.8);
    mk("path", { d: poly(ringAt(P, ring[0], PH)), class: "nf dash" }, g);
    return { cx, cy, ring, el: solid(g), tick: mk("path", { class: "sil nf" }, g) };
  });

  // the node, a puck with a chevron on it
  const node = solid(g);
  put(node, prism(P, front, circ(NR, 40), circ(NR - 1.4, 40), 0, NH));
  mk("path", { d: open(chevron(0, 0, 0.62).map(([x, y]) => P(x, y, NH))), class: "sil nf" }, g);

  const prog = spring(REST_P, { eps: 0.002 });
  let drawn = "";

  function draw() {
    const p = prog.x, key = p.toFixed(4) + bh;
    if (key === drawn) return;
    drawn = key;
    let live = -1;
    news.forEach((b, k) => {
      const t = trip(p, k), z = PH + bh * ease(t);
      if (t > 0) live = k;
      put(b.el, t > 0.02 ? prism(P, front, ...b.ring, PH, z) : NONE);
      // the check lands as the block arrives
      b.tick.setAttribute("d", t >= 0.85 ? open(check(b.cx, b.cy, 0.62).map(([x, y]) => P(x, y, z))) : "");
      put(olds[k].el, prism(P, front, ...olds[k].ring, PH, PH + lerp(olds[k].h, 0.5, ease(t))));
      olds[k].el.sil.classList.toggle("lo", t >= 1);
    });
    const done = trip(p, news.length - 1) >= 1;
    news.forEach((b, k) => b.el.sil.classList.toggle("hi", k === live && !done));
    plate.sil.classList.toggle("hi", done);
    node.sil.classList.toggle("hi", live >= 0 && !done);
    out.setAttribute("class", live >= 0 && !done ? "nf hi" : "nf");
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
      const n = news.filter((_, k) => trip(prog.t, k) >= 1).length;
      read.textContent = n === news.length ? "improved" : "applied " + n;
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { bh = clamp(v, 1.5, HMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const prsuggest = {
  name: "prsuggest",
  means: "Messy blocks become a neat grid: as the pointer moves right, suggestions apply one by one and each improved block rises with a check.",
  rules: [1, 5, 6, 10],
  range: [2, 3.5, 5],
  tour: [[70, 166], [200, 166], [345, 166], null],
  mount,
};

export default prsuggest;
