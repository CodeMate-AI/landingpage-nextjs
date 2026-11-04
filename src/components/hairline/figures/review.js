/**
 * Review and improve: a terminal window at the back, its header rule and a
 * prompt, with a straight lead from each of its two near sides to a code
 * sheet in front: the first version on the left, its lines ragged and askew,
 * the improved one on the right. Between the sheets a review marker, a round
 * puck with a chevron, rides a dashed rail. The pointer's x scrubs the
 * review: the marker runs from the old sheet to the new, and one after
 * another the new sheet's lines settle, straight and aligned. Every line
 * stays inside its sheet. The marker takes the bright edge on its way; once
 * every line is set, the improved sheet does. At rest the review has just
 * begun. The slider is the sheets' height.
 *
 * The pattern: scrub. One spring for progress, each line read from it in
 * order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, open, seg, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const REST_P = 0.2, SW = 16, HMAX = 3.5, MR = 5, MZ = 2.5;
// the sheets sit left and right on screen, the terminal behind and between them
const OLD = [-34, 34], NEW = [34, -34], TX = -42, TY = -42, TW = 15, TH = 3, LANE = -36;
// each line: [indent, length] when clean; [dx, dy, tilt in degrees, length] as written first
const CLEAN = [[0, 20], [4, 14], [4, 17], [0, 11]];
const RAGGED = [[-1, 0.5, 5, 17], [6, -0.5, -5, 15], [2, 0.6, 4, 12], [7, -0.5, -5, 14]];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** A chevron at (cx, cy), three points in the screen's own axes, pointing right. */
const chevron = (cx, cy, s) => [[-2.4, -5], [2.4, 0], [-2.4, 5]].map(([a, b]) => [cx + a * s * A[0] + b * s * Bv[0], cy + a * s * A[1] + b * s * Bv[1]]);
/** Line k's share at progress p: each starts 0.18 after the one before and takes 0.3. */
const trip = (p, k) => clamp((p - 0.12 - k * 0.18) / 0.3, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);
/** A line of code on a sheet centred at (cx, cy), as a rounded bar: row i, from its ragged pose to its clean one by t. */
function line(cx, cy, i, t) {
  const [ind, len] = CLEAN[i], [dx, dy, deg, len0] = RAGGED[i];
  const l = lerp(len0, len, t), a = lerp(deg, 0, t) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const mx = cx - SW + 4 + lerp(dx, ind, t) + l / 2, my = cy - 9 + i * 6 + lerp(dy, 0, t);
  return rings(-l / 2, -1.2, l / 2, 1.2, 1.2, 0.5).map((ring) => ring.map((q) => ({
    u: mx + q.u * c - q.v * s, v: my + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  })));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sh = value;

  const C = Cam(45, 0.5, 2.6);
  fit(C, [[OLD[0] - SW, OLD[1] + SW, 0], [OLD[0] - SW, OLD[1] - SW, 0], [NEW[0] + SW, NEW[1] - SW, 0], [NEW[0] + SW, NEW[1] + SW, 0],
    [OLD[0] + SW, OLD[1] + SW, 0], [TX - TW, TY - TW, TH]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(...OLD, 0)[0], sxR = P(...NEW, 0)[0];

  const g = mk("g", {}, svg);
  // the terminal at the back: plate, header rule, a prompt and its row
  put(solid(g), prism(P, front, ...rings(TX - TW, TY - TW, TX + TW, TY + TW, 3, 1.2), 0, TH));
  mk("path", { d: seg(P(TX - TW + 2, TY - TW + 6, TH), P(TX + TW - 2, TY - TW + 6, TH)) + seg(P(TX - TW + 10, TY + 2, TH), P(TX + 8, TY + 2, TH)), class: "nf lo" }, g);
  mk("path", { d: open(chevron(TX - TW + 5.5, TY + 2, 0.6).map(([x, y]) => P(x, y, TH))), class: "sil nf" }, g);
  // the leads: one straight run from each near side of the terminal to the back of its sheet
  mk("path", { d: seg(P(LANE, TY + TW, 0), P(LANE, OLD[1] - SW, 0)) + seg(P(TX + TW, LANE, 0), P(NEW[0] - SW, LANE, 0)), class: "nf lo" }, g);
  // the review rail between the sheets, along the screen's horizontal
  const r0 = [OLD[0] + SW + 2, OLD[1] - SW - 2], r1 = [NEW[0] - SW - 2, NEW[1] + SW + 2];
  mk("path", { d: seg(P(...r0, 0), P(...r1, 0)), class: "nf dash" }, g);

  // the sheets: the first version, set ragged, and the improved one, whose lines settle
  const old = solid(g), oldLines = CLEAN.map(() => solid(g));
  const neo = solid(g), neoLines = CLEAN.map(() => solid(g));
  // the marker: a puck with a chevron on its top
  const mark = solid(g), chev = mk("path", { class: "sil nf" }, g);

  const prog = spring(REST_P, { eps: 0.002 });
  let drawn = "", lit = null;

  function draw() {
    const p = prog.x, key = p.toFixed(4) + sh;
    if (key === drawn) return;
    drawn = key;
    put(old, prism(P, front, ...rings(OLD[0] - SW, OLD[1] - SW, OLD[0] + SW, OLD[1] + SW, 3, 1.2), 0, sh));
    oldLines.forEach((el, i) => put(el, prism(P, front, ...line(...OLD, i, 0), sh, sh + 0.6)));
    put(neo, prism(P, front, ...rings(NEW[0] - SW, NEW[1] - SW, NEW[0] + SW, NEW[1] + SW, 3, 1.2), 0, sh));
    // a settled line stands a little prouder than a ragged one
    neoLines.forEach((el, i) => { const t = ease(trip(p, i)); put(el, prism(P, front, ...line(...NEW, i, t), sh, sh + lerp(0.6, 1.2, t))); });
    // the marker runs the rail as the review goes on, never onto either sheet
    const m = ease(clamp(p / 0.9, 0, 1)), mx = lerp(r0[0] + MR * 0.75, r1[0] - MR * 0.75, m), my = lerp(r0[1] - MR * 0.75, r1[1] + MR * 0.75, m);
    const disc = circ(MR, 40).map((q) => ({ ...q, u: q.u + mx, v: q.v + my })), inner = circ(MR - 1.1, 40).map((q) => ({ ...q, u: q.u + mx, v: q.v + my }));
    put(mark, prism(P, front, disc, inner, 0, MZ));
    chev.setAttribute("d", open(chevron(mx + 0.3, my + 0.3, 0.55).map(([x, y]) => P(x, y, MZ))));
    // the bright edge, read from the spring's target: the marker under way, the improved sheet once done
    const done = trip(prog.t, CLEAN.length - 1) >= 1;
    if (done !== lit) { lit = done; mark.sil.classList.toggle("hi", !done); neo.sil.classList.toggle("hi", done); }
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
      const n = CLEAN.filter((_, i) => trip(prog.t, i) >= 1).length;
      read.textContent = n === CLEAN.length ? "improved" : trip(prog.t, 0) === 0 ? "first draft" : "review " + (n + 1);
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { sh = clamp(v, 1, HMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const review = {
  name: "review",
  means: "Code under review: as the pointer moves right, the marker crosses and the improved sheet's lines settle straight.",
  rules: [1, 5, 6, 10],
  range: [1.5, 2, 3.5],
  tour: [[75, 207], [200, 207], [325, 207], null],
  mount,
};

export default review;
