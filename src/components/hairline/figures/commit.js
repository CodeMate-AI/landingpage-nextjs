/**
 * Commit: three small change panels on the left, each ruled with a long and
 * a short diff line, on branches that merge into one round commit node, and
 * a trunk from the node to the commit document on the right, its heading
 * bar and one summary line per change. The pointer's x scrubs the merge:
 * one after another each panel runs down its branch, shrinking into the
 * node, leaving a dashed footprint, and its summary line writes itself on
 * the document. The change on the move takes the bright edge; once all
 * three are in, the document does. At rest one change is in and one is on
 * its way. The slider is the change panels' height.
 *
 * The pattern: scrub. One spring for progress, each change's run read from
 * it in order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, ringAt, poly, seg, clamp, lerp,
  spring, stepS, mk, solid, put, flatDot, place, register, pointer, disposer,
} = HL;

const REST_P = 0.5, CW = 8, CD = 9, NR = 6, NZ = 4, DW = 13, DD = 17, DZ = 2.5, HMAX = 6;
const AX = [Math.SQRT1_2, -Math.SQRT1_2], DX = [Math.SQRT1_2, Math.SQRT1_2];
/** A world point from screen-row coordinates: a along the row, d toward the viewer. */
const W = (a, d) => [a * AX[0] + d * DX[0], a * AX[1] + d * DX[1]];
const CHANGES = [W(-64, -34), W(-70, 0), W(-64, 34)];
const NODE = W(0, 0), DOC = W(54, 0);
// each change's summary line on the document: [y offset, length]
const SUMS = [[-4, 18], [2, 14], [8, 20]];
/** Change k's share of its run at progress p: each starts 0.22 after the one before and takes 0.45. */
const trip = (p, k) => clamp((p - k * 0.22) / 0.45, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ch = value;

  const C = Cam(45, 0.5, 2.35);
  fit(C, [...CHANGES.flatMap(([x, y]) => [[x - CW, y - CD, 0], [x + CW, y + CD, 0], [x - CW, y + CD, 0], [x + CW, y - CD, HMAX]]),
    [DOC[0] + DW, DOC[1] - DD, 0], [DOC[0] + DW, DOC[1] + DD, 0], [DOC[0] - DW, DOC[1] - DD, DZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(...CHANGES[1], 0)[0], sxR = P(...W(36, 0), 0)[0];

  const g = mk("g", {}, svg);
  // the branches and the trunk on the ground, then where each change lay, dashed once it has gone
  /** Where a branch leaves its change: the edge of the change's footprint, toward the node. */
  const edge = ([x, y]) => { const f = Math.min(CW / Math.abs(NODE[0] - x), CD / Math.abs(NODE[1] - y)); return [x + (NODE[0] - x) * f, y + (NODE[1] - y) * f]; };
  mk("path", { d: CHANGES.map((c) => seg(P(...edge(c), 0), P(...NODE, 0))).join("") + seg(P(...NODE, 0), P(...DOC, 0)), class: "nf lo" }, g);
  // a commit on each branch, on the line, a little past halfway to the merge
  CHANGES.forEach(([x, y]) => place(flatDot(g, C, 1.5, "dot off"), P(x + (NODE[0] - x) * 0.55, y + (NODE[1] - y) * 0.55, 0)));
  const feet = CHANGES.map(([x, y]) => mk("path", { d: poly(ringAt(P, rings(x - CW, y - CD, x + CW, y + CD, 2.2, 1)[0], 0)), class: "nf dash" }, g));
  // the document: its plate, heading bar, and the summary lines it writes as changes arrive
  const doc = solid(g);
  put(doc, prism(P, front, ...rings(DOC[0] - DW, DOC[1] - DD, DOC[0] + DW, DOC[1] + DD, 3, 1.2), 0, DZ));
  put(solid(g), prism(P, front, ...rings(DOC[0] - 9, DOC[1] - 13, DOC[0] + 6, DOC[1] - 9.4, 1.6, 0.6), DZ, DZ + 0.9));
  const sums = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, front, circ(NR, 32).map((q) => ({ ...q, u: q.u + NODE[0], v: q.v + NODE[1] })), circ(NR - 1.2, 32).map((q) => ({ ...q, u: q.u + NODE[0], v: q.v + NODE[1] })), 0, NZ));
  const items = CHANGES.map(([x, y], k) => ({ k, x, y, el: solid(g), marks: mk("path", { class: "nf lo" }, g), drawn: "" }));

  const prog = spring(REST_P, { eps: 0.002 });
  let lit = null;

  function draw() {
    const p = prog.x;
    items.forEach((it) => {
      const t = ease(trip(p, it.k)), cx = lerp(it.x, NODE[0], t), cy = lerp(it.y, NODE[1], t), s = lerp(1, 0.35, t);
      const key = t.toFixed(3);
      if (key === it.drawn) return;
      it.drawn = key;
      feet[it.k].setAttribute("class", t > 0.02 ? "nf dash" : "nf");
      if (t > 0.97) { put(it.el, { sil: "", crease: "" }); it.marks.setAttribute("d", ""); return; }
      const hw = CW * s, hd = CD * s, top = ch * (1 - t * 0.6);
      put(it.el, prism(P, front, ...rings(cx - hw, cy - hd, cx + hw, cy + hd, 2.2 * s, 0.9 * s), 0, top));
      it.marks.setAttribute("d", seg(P(cx - hw + 3 * s, cy - 3 * s, top), P(cx + hw - 3 * s, cy - 3 * s, top)) + seg(P(cx - hw + 3 * s, cy + 3 * s, top), P(cx + 1 * s, cy + 3 * s, top)));
    });
    // each summary line is as long as its change is far along
    sums.setAttribute("d", SUMS.map(([v, len], k) => {
      const t = ease(clamp((trip(p, k) - 0.6) / 0.4, 0, 1));
      return t < 0.02 ? "" : seg(P(DOC[0] - 9, DOC[1] + v, DZ), P(DOC[0] - 9 + len * t, DOC[1] + v, DZ));
    }).join(""));
    // what is bright, read from the spring's target: the change on the move, or the document once all are in
    let f = -1;
    items.forEach((it) => { if (trip(prog.t, it.k) > 0) f = it.k; });
    if (trip(prog.t, items.length - 1) >= 1) f = items.length;
    if (f !== lit) {
      lit = f;
      items.forEach((it) => it.el.sil.classList.toggle("hi", it.k === f));
      doc.sil.classList.toggle("hi", f === items.length);
    }
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
      read.textContent = trip(prog.t, items.length - 1) >= 1 ? "commit" : f < 0 ? "changes" : "change " + (f + 1);
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { ch = clamp(v, 1.5, HMAX); items.forEach((it) => { it.drawn = ""; }); B.wake(); },
    destroy: bag.dispose,
  };
}

const commit = {
  name: "commit",
  means: "Changes merge into one commit: as the pointer moves right, each change runs into the node and writes a line on the document.",
  rules: [1, 2, 5, 6],
  range: [2, 3.5, 6],
  tour: [[60, 166], [170, 166], [293, 166], null],
  mount,
};

export default commit;
