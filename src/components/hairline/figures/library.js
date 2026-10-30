/**
 * Library: an open folder, its back cover tabbed on the near edge, holding a
 * neat stack of five documents. Each document has an index tab at its own
 * place along the front edge, like filed pages. The document whose tab is
 * nearest the pointer slides out of the stack, showing its lines, and takes
 * the bright edge; the others settle back, staggered from it. At rest the
 * middle one is already offset. The slider is how far a document slides out.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, identity
 * carried by where each tab sits, and a hit test on the tabs' resting places
 * on screen, so a document sliding out cannot flip the choice.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, fillet, poly, seg, clamp,
  tween, tset, tval, tdone, mk, register, pointer, disposer,
} = HL;

const N = 5, W = 58, D = 76, X0 = 6, Y0 = 6, Z0 = 2.4, DZ = 3.2, TK = 1.4;
const TW = 10, TH = 5, TABS = [8, 22, 36, 50, 62], JIT = [0, -1.6, 0.8, -0.6, 1.2];
const REST_I = 2, REST_K = 0.55, STEP = 45, SMAX = 40;

/** A document's outline in its own plane, its tab on the front (+x) edge at t0. */
const outline = (t0) => fillet(
  [[0, 0], [W, 0], [W, t0], [W + TH, t0], [W + TH, t0 + TW], [W, t0 + TW], [W, D], [0, D]],
  [1.6, 2.2, 1, 1.6, 1.6, 1, 2.2, 1.6],
);
/** Its lines: a heading near the front edge, then text lines of different lengths, as [u, v0, v1]. */
const LINES = [[W - 7, 8, 44], [W - 14, 8, 66], [W - 19, 8, 60], [W - 24, 8, 68], [W - 29, 8, 52], [W - 36, 8, 64], [W - 41, 8, 40]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slide = value;

  const C = Cam(45, 0.5, 2.55);
  const zTop = Z0 + N * DZ;
  fit(C, [[-4, -12, 0], [X0 + W + TH + SMAX + 2, D + 17, 0], [X0 + W + TH + SMAX + 2, -4, 0], [-4, D + 17, 0], [X0, Y0, zTop], [X0 + W + SMAX, Y0, zTop]], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  // the folder's back cover, lying under the stack, its tab on the near edge where the stack cannot hide it
  const cover = fillet([[-4, -4], [X0 + W + 8, -4], [X0 + W + 8, D + 10], [38, D + 10], [36, D + 17], [14, D + 17], [12, D + 10], [-4, D + 10]], [4, 4, 4, 1.5, 2.5, 2.5, 1.5, 4]);
  mk("path", { d: poly(cover.map(([u, v]) => P(u, v, 0))), class: "lo" }, g);
  mk("path", { d: poly(cover.map(([u, v]) => P(u, v, 1.6))), class: "sil" }, g);

  const docs = [];
  for (let i = 0; i < N; i++) {
    const shape = outline(TABS[i]), z = Z0 + i * DZ;
    const el = {
      back: mk("path", { class: "lo" }, g), face: mk("path", { class: "sil" }, g),
      head: mk("path", { class: "nf" }, g), lines: mk("path", { class: "nf lo" }, g),
    };
    docs.push({ i, shape, z, el, x: tween(i === REST_I ? REST_K * slide : 0), last: NaN });
  }

  function draw(dc, dx) {
    if (dx === dc.last) return;
    dc.last = dx;
    const ox = X0 + JIT[dc.i] + dx, at = (u, v, z) => P(ox + u, Y0 + v, z);
    dc.el.back.setAttribute("d", poly(dc.shape.map(([u, v]) => at(u, v, dc.z))));
    dc.el.face.setAttribute("d", poly(dc.shape.map(([u, v]) => at(u, v, dc.z + TK))));
    const [hu, h0, h1] = LINES[0];
    dc.el.head.setAttribute("d", seg(at(hu, h0, dc.z + TK), at(hu, h1, dc.z + TK)));
    dc.el.lines.setAttribute("d", LINES.slice(1).map(([u, v0, v1]) => seg(at(u, v0, dc.z + TK), at(u, v1, dc.z + TK))).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const dc of docs) { draw(dc, tval(dc.x, now)); if (!tdone(dc.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each tab's resting centre on screen; they never move, and nothing draws them
  const tabs = docs.map((dc) => P(X0 + JIT[dc.i] + W + TH / 2, Y0 + TABS[dc.i] + TW / 2, dc.z + TK));
  /** The document whose resting tab is nearest the pointer, within reach of the stack's front; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 34;
    tabs.forEach(([tx, ty], i) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.6); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  let act = null;
  /** Slides document a out (-1 offsets the rest pose's one a little); the others settle back, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), on = a >= 0 ? a : REST_I, from = a >= 0 ? a : act >= 0 ? act : REST_I;
    act = a;
    docs.forEach((dc, i) => {
      tset(dc.x, i === on ? (a >= 0 ? slide : REST_K * slide) : 0, now, Math.abs(i - from) * STEP);
      dc.el.face.classList.toggle("hi", i === on);
      dc.el.head.classList.toggle("hi", i === on);
    });
    read.textContent = a < 0 ? "rest" : "doc " + (a + 1);
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { slide = clamp(v, 0, SMAX); setActive(act, true); },
    destroy: bag.dispose,
  };
}

const library = {
  name: "library",
  means: "A folder holding a stack of documents: the one whose tab is under the pointer slides out to show its lines.",
  rules: [1, 2, 6, 10],
  range: [14, 24, 36],
  tour: [[193, 175], [269, 157], [175, 179], null],
  mount,
};

export default library;
