/**
 * PR documentation: a pull request's code panel on the left, on a lead to a
 * document on the right, its four sections stacked and each visibly its own:
 * a description of a title and two lines, a walkthrough of numbered steps as
 * round markers with lines, a row of label pills, and a changelog of rows
 * marked with a plus. The section under the pointer is being written: it
 * lifts inside the document's footprint, its lines run out to full length,
 * and it takes the bright edge with the lead. The others settle, staggered from it. At rest the description is
 * up. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each section's resting centre on screen, so a lifting one cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, rrect, circ, prism, ringAt, poly, open, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

/** The world point at screen-across h and screen-down v. */
const at = (h, v) => [h + v, v - h];
const REST_I = 0, STEP = 55, LMAX = 3.5, PW = 18, PD = 12, PH = 2, DW = 20, DD = 26, DH = 2, SW = 18, SD = 5, SH = 0.8;
const PANEL = at(-35, 0), DOC = at(26, 0);
const ROWS = [[-6, 20], [-1.5, 13], [3, 22], [7.5, 10]], NAMES = ["description", "walkthrough", "labels", "changelog"];
const SECTIONS = [-18, -6, 6, 18];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** What section k carries at (x0, y) on a top at z, its lines written to share f: its marks and its dim lines, as path strings. */
function contents(k, x0, y, z, P, f) {
  const line = (u0, u1, v) => seg(P(x0 + u0, y + v, z), P(x0 + u0 + (u1 - u0) * f, y + v, z));
  const dot = (u, v) => poly(ringAt(P, circ(1.2, 16).map((q) => ({ ...q, u: q.u + x0 + u, v: q.v + y + v })), z));
  if (k === 0) return { marks: line(0, 14, -2.6), lines: line(0, 29, 0.4) + line(0, 21, 3) };
  if (k === 1) return { marks: dot(1, -2.2) + dot(1, 2.2), lines: line(5, 28, -2.2) + line(5, 20, 2.2) };
  if (k === 2) return { marks: [[0, 9], [11, 7], [20, 10]].map(([u, l]) => poly(ringAt(P, rrect(x0 + u, y - 1.8, x0 + u + l, y + 1.8, 1.6, 5), z))).join(""), lines: "" };
  // a plus in the screen's own axes, so it reads as a plus and not a cross
  const plus = (v) => { const sp = (a, b) => P(x0 + 1.3 + a * A[0] + b * 2 * Bv[0], y + v + a * A[1] + b * 2 * Bv[1], z); return seg(sp(-1.2, 0), sp(1.2, 0)) + seg(sp(0, -1.2), sp(0, 1.2)); };
  return { marks: plus(-2.7) + plus(2.7), lines: line(5, 26, -2.7) + line(5, 18, 2.7) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.8);
  const [px, py] = PANEL, [dx, dy] = DOC;
  fit(C, [[px - PW, py - PD, 0], [px + PW, py + PD, 0], [px - PW, py + PD, 0], [px + PW, py - PD, PH],
    [dx - DW, dy - DD, 0], [dx + DW, dy - DD, DH + SH + LMAX], [dx + DW, dy + DD, 0], [dx - DW, dy + DD, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the lead from the panel to the document, tucked under both
  const lead = mk("path", { d: seg(P(...at(-35 + (PW + PD) / 2 - 3, 0), 0), P(...at(26 - (DW + DD) / 2 + 3, 0), 0)), class: "nf" }, g);
  // the panel: plate, header rule, its rows
  put(solid(g), prism(P, front, ...rings(px - PW, py - PD, px + PW, py + PD, 3.5, 1.3), 0, PH));
  ROWS.forEach(([v, l]) => put(solid(g), prism(P, front, ...rings(px - 8, py + v - 1, px - 8 + l, py + v + 1, 1, 0.4), PH, PH + 0.5)));
  // the pull request's mark in the panel's left column: a branch leaving a line and joining it again
  const mp = (u, v) => P(px - 13.5 + u, py + 0.7 + v, PH), ball = (u, v) => poly(ringAt(P, circ(1.1, 14).map((q) => ({ ...q, u: q.u + px - 13.5 + u, v: q.v + py + 0.7 + v })), PH));
  mk("path", { d: seg(mp(0, -5.2), mp(0, 5.2)) + open([mp(0, -3), mp(3.4, -1), mp(3.4, 1), mp(0, 3)]), class: "nf" }, g);
  mk("path", { d: ball(0, -6.2) + ball(0, 6.2), class: "sil" }, g);
  // the document, then its sections, back to front
  put(solid(g), prism(P, front, ...rings(dx - DW, dy - DD, dx + DW, dy + DD, 3.5, 1.3), 0, DH));
  const items = SECTIONS.map((v, k) => ({
    k, y: dy + v, z: tween(0), last: NaN, ring: rings(dx - SW, dy + v - SD, dx + SW, dy + v + SD, 1.8, 0.7),
    el: solid(g), lines: mk("path", { class: "nf lo" }, g), marks: mk("path", { class: "nf" }, g),
  }));

  let on = REST_I, act = null;
  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const base = DH + z, top = base + SH, c = contents(it.k, dx - SW + 3.5, it.y, top, P, 0.5 + 0.5 * clamp(z / lift, 0, 1));
    put(it.el, prism(P, front, ...it.ring, DH, top));
    it.lines.setAttribute("d", c.lines);
    it.marks.setAttribute("d", c.marks);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each section's resting centre on screen; they never move
  const targets = items.map((it) => P(dx, it.y, DH + SH));
  /** The section nearest the pointer; -1 only when the pointer is far from all four. */
  function hit([sx, sy]) {
    let best = -1, bd = 150;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot((sx - tx) * 0.35, sy - ty); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Lifts section a (-1 the rest pose's, a little lower); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    items.forEach((it) => {
      tset(it.z, it.k === on ? (a >= 0 ? lift : lift * 0.45) : 0, now, Math.abs(it.k - from) * STEP);
      it.last = NaN;
      it.el.sil.classList.toggle("hi", it.k === on);
      it.marks.setAttribute("class", it.k === on ? "nf hi" : "nf");
    });
    lead.setAttribute("class", a >= 0 ? "nf hi" : "nf");
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

const prdocs = {
  name: "prdocs",
  means: "A pull request written up: the document section under the pointer lifts, a description, a walkthrough, labels or a changelog.",
  rules: [1, 2, 4, 10],
  range: [1.5, 2.5, 3.5],
  tour: [[341, 141], [317, 153], [293, 165], [269, 177], null],
  mount,
};

export default prdocs;
