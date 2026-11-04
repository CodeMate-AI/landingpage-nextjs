/**
 * Process monitoring: a terminal window, its header rule, and across it a process timeline, a dashed rail with three status nodes on it.
 * In front of the window lies a suggestion card, two lines on it, joined to
 * the last node by a dashed lead. The pointer's x scrubs the run: a playhead
 * rides the rail, the stretch behind it fills in, and each node it passes
 * stands up. The last node fails: when the playhead reaches it, a warning
 * tag rises over it on a stem and the suggestion card lifts and takes the
 * bright edge; until then the playhead has it. At rest the run is between
 * the first and second nodes. The slider is the tag's rise.
 *
 * The pattern: scrub. One spring for progress, each node read from it in
 * order, a spring for the failure, and a hit test on the pointer's screen x,
 * which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, poly, seg, fillet, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const TW = 36, TD = 20, TH = 3, PY = 6, X0 = -28, X1 = 13, NR = 3.4, NH0 = 1, NH1 = 3.5, REST_P = 0.42, ZMAX = 12;
const NODES = [-16, 2, 20], ERR = 2;
const CX = 20, CY = TD + 18, CW = 13, CD = 8, CH = 2;
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** A point (a, b) in the screen's own axes about (cx, cy), b doubled so the ground's foreshortening is undone. */
const scr = (cx, cy, a, b) => [cx + a * A[0] + b * 2 * Bv[0], cy + a * A[1] + b * 2 * Bv[1]];
/** A warning tag at (cx, cy), a rounded triangle in the screen's own axes, its point up. */
const tag = (cx, cy) => fillet([[0, -5], [4.6, 3], [-4.6, 3]].map(([a, b]) => scr(cx, cy, a, b)), [1, 1, 1]);
const disc = (x, y, r) => circ(r, 36).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;

  const C = Cam(45, 0.5, 3.35);
  fit(C, [[-TW, -TD, 0], [TW, TD, 0], [-TW, TD, 0], [TW, -TD, TH], [CX - CW, CY + CD, 0], [CX + CW, CY + CD, 0], [CX + CW, CY - CD, CH + 2], [NODES[ERR], PY, TH + ZMAX + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(X0, PY, TH)[0], sxR = P(X1, PY, TH)[0];

  const g = mk("g", {}, svg);
  // the window: plate, header rule, one finished row above the timeline
  put(solid(g), prism(P, front, ...rings(-TW, -TD, TW, TD, 4, 1.3), 0, TH));
  mk("path", { d: seg(P(-TW + 2, -TD + 7, TH), P(TW - 2, -TD + 7, TH)) + seg(P(-TW + 8, -5, TH), P(-2, -5, TH)), class: "nf lo" }, g);
  // the timeline, dashed ahead of the playhead; the lead from the failing node down to the card
  mk("path", { d: seg(P(X0, PY, TH), P(X1 + 6, PY, TH)), class: "nf dash" }, g);
  const lead = mk("path", { d: seg(P(NODES[ERR], PY + NR, TH), P(NODES[ERR], TD, TH)) + seg(P(NODES[ERR], TD, TH), P(NODES[ERR], TD, 0)) + seg(P(NODES[ERR], TD, 0), P(CX, CY - CD, 0)), class: "nf dash" }, g);
  // the card in front of the window
  const card = solid(g), cardLines = mk("path", { class: "nf lo" }, g);
  const done = solid(g);
  const nodes = NODES.map((x) => ({ x, sp: spring(NH0, { eps: 0.02 }), el: solid(g), drawn: NaN }));
  const head = solid(g);
  // the tag on its stem, drawn last, over everything
  const stem = mk("path", { class: "nf" }, g), tagEl = mk("path", { class: "hi" }, g), bang = mk("path", { class: "nf hi" }, g);

  const prog = spring(REST_P, { eps: 0.002 }), fail = spring(0, { eps: 0.002 });
  let drawn = "", lit = null;

  function draw() {
    for (const n of nodes) if (n.sp.x !== n.drawn) { n.drawn = n.sp.x; put(n.el, prism(P, front, disc(n.x, PY, NR), disc(n.x, PY, NR - 1), TH, TH + n.sp.x)); }
    const p = prog.x, f = fail.x, key = [p, f, rise].map((v) => v.toFixed(3)).join(",");
    if (key === drawn) return;
    drawn = key;
    // the run so far, solid behind the playhead
    const hx = lerp(X0, X1, p);
    put(done, hx - X0 < 1 ? { sil: "", crease: "" } : prism(P, front, ...rings(X0, PY - 0.9, hx, PY + 0.9, 0.9, 0.4), TH, TH + 0.7));
    put(head, prism(P, front, ...rings(hx - 1.4, PY - 2.6, hx + 1.4, PY + 2.6, 1.2, 0.5), TH, TH + NH1 + 1));
    // the card lifts as the failure is caught
    const cz = CH * (0.4 + 0.6 * f);
    put(card, prism(P, front, ...rings(CX - CW, CY - CD, CX + CW, CY + CD, 2.6, 1.1), 0, cz));
    cardLines.setAttribute("d", seg(P(CX - CW + 4, CY - 2.5, cz), P(CX + 6, CY - 2.5, cz)) + seg(P(CX - CW + 4, CY + 2.5, cz), P(CX - 1, CY + 2.5, cz)));
    // the tag rises out of the failing node
    const tz = TH + NH1 + 1 + rise * f, [ex, ey] = [NODES[ERR], PY];
    const on = f > 0.04, pts = tag(ex, ey);
    stem.setAttribute("d", on ? seg(P(ex, ey, TH + NH1), P(ex, ey, tz)) : "");
    // one outline, and inside it the mark: a short stroke and a dot, both in the screen's own axes
    tagEl.setAttribute("d", on ? poly(pts.map(([x, y]) => P(x, y, tz))) : "");
    const at = (a, b) => P(...scr(ex, ey, a, b), tz);
    const [dx, dy] = at(0, 1.5);
    bang.setAttribute("d", on ? seg(at(0, -2.4), at(0, 0)) + poly(Array.from({ length: 12 }, (_, i) => [dx + Math.cos(i * Math.PI / 6), dy + Math.sin(i * Math.PI / 6)])) : "");
    // the bright edge, read from the target: the playhead until the failure, then the card
    const failed = fail.t > 0;
    if (failed !== lit) { lit = failed; head.sil.classList.toggle("hi", !failed); card.sil.classList.toggle("hi", failed); lead.setAttribute("class", failed ? "nf hi" : "nf dash"); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const sp of [prog, fail, ...nodes.map((n) => n.sp)]) if (stepS(sp, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  /** Sets the run's progress; the nodes behind the playhead stand up, and at the last the failure is caught. */
  function run(p, live) {
    prog.t = p;
    const hx = lerp(X0, X1, p);
    // a node counts as reached once the playhead comes up to it; the run halts just short of the failing one
    nodes.forEach((n) => { n.sp.t = hx >= n.x - NR - 4 ? NH1 : NH0; });
    const n = nodes.filter((nd) => hx >= nd.x - NR - 4).length;
    fail.t = n > ERR ? 1 : 0;
    read.textContent = !live ? "rest" : n > ERR ? "error" : n === 0 ? "start" : "step " + n;
    B.wake();
  }
  run(REST_P, false);

  bag.add(pointer(stage, {
    move: ([sx]) => run(clamp((sx - sxL) / (sxR - sxL), 0, 1), true),
    leave: () => run(REST_P, false),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { rise = clamp(v, 2, ZMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const monitor = {
  name: "monitor",
  means: "A process watched in the terminal: as the pointer moves right the run goes on, and at the failing step a warning and a fix appear.",
  rules: [1, 5, 6, 10],
  range: [3, 7, 12],
  tour: [[119, 118], [170, 142], [217, 166], null],
  mount,
};

export default monitor;
