/**
 * Automated PR reviews: two code panels on the left, the base and the change,
 * on leads into a central review node, and on the right the dashed footprints
 * of three feedback rows. The pointer's x scrubs the review: a scan line
 * crosses both panels and each flagged row takes a small issue marker as it
 * passes; then the node takes a check and the bright edge, and three branches grow out of
 * it one at a time, each raising its feedback row, a marker and two lines. At
 * rest the scan is done and the first row is out. The slider is the rows'
 * height.
 *
 * The pattern: scrub. One spring for progress, each part read from it in
 * order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, ringAt, poly, open, seg, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

/** The world point at screen-across h and screen-down v. */
const at = (h, v) => [h + v, v - h];
const REST_P = 0.58, SCAN = 0.35, PW = 15, PD = 10, PH = 2, NR = 8, NH = 3, CW = 13, CD = 5, HMAX = 3;
const PANELS = [at(-38, -15), at(-38, 15)], CARDS = [at(38, -20), at(38, 0), at(38, 20)];
// each panel's rows: [y, length], and the rows it flags
const ROWS = [[-5.5, 15], [0, 9], [5.5, 12]], FLAGS = [[0, 2], [1]];
/** Branch k's share at progress p: each starts 0.2 after the one before and takes 0.2. */
const trip = (p, k) => clamp((p - 0.38 - k * 0.2) / 0.2, 0, 1);
const disc = (x, y, r) => [circ(r, 24), circ(r * 0.55, 24)].map((c) => c.map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
/** From a to b, the distance across a's half-size box along the way, and the unit direction. */
function exit([ax, ay], [bx, by], hw, hd) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  return { d, ux, uy, r: Math.min(hw / Math.abs(ux || 1e-9), hd / Math.abs(uy || 1e-9)) };
}
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** A check mark at the origin, three points in the screen's own axes. */
const CHECK = [[-3.4, 0.2], [-1, 2.4], [3.6, -2.4]].map(([a, b]) => [a * A[0] + b * 2 * Bv[0], a * A[1] + b * 2 * Bv[1]]);
const NONE = { sil: "", crease: "" };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ch = value;

  const C = Cam(45, 0.5, 2.8);
  fit(C, [...PANELS, ...CARDS].flatMap(([x, y], i) => {
    const w = i < 2 ? PW : CW, d = i < 2 ? PD : CD, z = i < 2 ? PH + 2 : HMAX;
    return [[x - w, y - d, 0], [x + w, y - d, z], [x - w, y + d, 0], [x + w, y + d, 0]];
  }), 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(...PANELS[0], 0)[0] - 30, sxR = P(...CARDS[1], 0)[0] + 10;

  const g = mk("g", {}, svg);
  // the panels' leads into the node, on the ground
  mk("path", { d: PANELS.map((a) => {
    const { d, ux, uy, r } = exit(a, [0, 0], PW, PD);
    return seg(P(a[0] + ux * r, a[1] + uy * r, 0), P(a[0] + ux * (d - NR), a[1] + uy * (d - NR), 0));
  }).join(""), class: "nf lo" }, g);
  // the feedback rows' footprints and the branches that reach them
  const cards = CARDS.map((a) => {
    const [x, y] = a, { d, ux, uy, r } = exit([0, 0], a, CW, CD), ring = rings(x - CW, y - CD, x + CW, y + CD, 2.4, 1);
    mk("path", { d: poly(ringAt(P, ring[0], 0)), class: "nf dash" }, g);
    return { x, y, ring, from: [ux * NR, uy * NR], to: [ux * (d - r), uy * (d - r)], lead: mk("path", { class: "nf" }, g) };
  });
  cards.forEach((c) => { c.el = solid(g); c.mark = solid(g); c.lines = mk("path", { class: "nf lo" }, g); });

  // the panels: plate, rows, the flags that rise on them, and the scan line
  const panels = PANELS.map(([x, y], k) => {
    put(solid(g), prism(P, front, ...rings(x - PW, y - PD, x + PW, y + PD, 3, 1.2), 0, PH));
    ROWS.forEach(([v, l]) => put(solid(g), prism(P, front, ...rings(x - 12, y + v - 1, x - 12 + l, y + v + 1, 1, 0.4), PH, PH + 0.5)));
    const flags = FLAGS[k].map((r) => ({ x: x - 12 + ROWS[r][1] + 3, y: y + ROWS[r][0], el: solid(g) }));
    return { x, y, flags, scan: mk("path", { class: "nf hi" }, g) };
  });

  // the node, last of the ground parts
  const node = solid(g);
  put(node, prism(P, front, circ(NR, 40), circ(NR - 1.6, 40), 0, NH));
  const check = mk("path", { class: "sil nf" }, g);

  const prog = spring(REST_P, { eps: 0.002 });
  let drawn = "";

  function draw() {
    const p = prog.x, key = p.toFixed(4) + ch;
    if (key === drawn) return;
    drawn = key;
    // the scan crosses each panel; a flag stands up as the line passes it
    const s = clamp(p / SCAN, 0, 1);
    panels.forEach((pn) => {
      const sx = pn.x + lerp(-PW + 1.5, PW - 1.5, s);
      pn.scan.setAttribute("d", s > 0 && s < 1 ? seg(P(sx, pn.y - PD + 1.5, PH + 0.6), P(sx, pn.y + PD - 1.5, PH + 0.6)) : "");
      pn.flags.forEach((f) => put(f.el, sx >= f.x || s >= 1 ? prism(P, front, ...disc(f.x, f.y, 1.5), PH, PH + 0.9) : NONE));
    });
    // a branch grows out of the node, and the row it reaches rises with its marker and lines
    let live = -1;
    cards.forEach((c, k) => {
      const t = trip(p, k), rise = clamp((t - 0.6) / 0.4, 0, 1), z = ch * rise;
      if (t > 0) live = k;
      c.lead.setAttribute("d", t > 0 ? seg(P(...c.from, 0), P(lerp(c.from[0], c.to[0], Math.min(1, t / 0.6)), lerp(c.from[1], c.to[1], Math.min(1, t / 0.6)), 0)) : "");
      put(c.el, rise > 0 ? prism(P, front, ...c.ring, 0, Math.max(z, 0.2)) : NONE);
      put(c.mark, rise > 0.3 ? prism(P, front, ...disc(c.x - CW + 4, c.y, 1.6), z, z + 0.8) : NONE);
      c.lines.setAttribute("d", rise > 0.3 ? seg(P(c.x - CW + 8, c.y - 1.6, z), P(c.x + CW - 3, c.y - 1.6, z)) + seg(P(c.x - CW + 8, c.y + 1.6, z), P(c.x + 3, c.y + 1.6, z)) : "");
    });
    // the bright edge: the node once the scan is done, until a row is out; then the latest row
    node.sil.classList.toggle("hi", s >= 1 && live < 0);
    check.setAttribute("d", s >= 1 ? open(CHECK.map(([x, y]) => P(x, y, NH))) : "");
    cards.forEach((c, k) => { c.el.sil.classList.toggle("hi", k === live); c.lead.setAttribute("class", k === live ? "nf hi" : "nf"); });
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
      const n = cards.filter((_, k) => trip(prog.t, k) > 0).length;
      read.textContent = prog.t < SCAN ? "scan" : n === 0 ? "analysed" : "feedback " + n;
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { ch = clamp(v, 1, HMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const prreview = {
  name: "prreview",
  means: "Two code panels feed a review node: as the pointer moves right, a scan flags issues and structured feedback rows branch out.",
  rules: [1, 5, 6, 10],
  range: [1, 2, 3],
  tour: [[67, 160], [200, 165], [346, 165], null],
  mount,
};

export default prreview;
