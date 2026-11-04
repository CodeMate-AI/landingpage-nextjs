/**
 * Dependency graph: a central source file with four files around it, one on
 * each side, each joined to it by a dependency rail with a node at its middle.
 * Every file shows its own code lines. The file under the pointer lifts, and its rail and node light: this
 * one depends on the centre. The others settle back, staggered from it. At
 * rest the far right file is lifted a little. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each file's resting centre on screen, so a lifting file cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, register, pointer, disposer,
} = HL;

const D = 46, FW = 9, FD = 11, FH = 2.4, CW = 12, CD = 15, CH = 4, REST_I = 0, STEP = 50, LMAX = 14;
// the files round the centre: where each sits, and its code lines as [indent, length]
const FILES = [
  { at: [0, -D], lines: [[0, 12], [3, 9], [3, 11]] },
  { at: [D, 0], lines: [[0, 10], [0, 13], [3, 7]] },
  { at: [0, D], lines: [[0, 13], [3, 8], [6, 6]] },
  { at: [-D, 0], lines: [[0, 9], [3, 12], [0, 6]] },
];
const CLINES = [[0, 16], [3, 12], [6, 10], [3, 14], [0, 8]];

/** Code lines on a file's top, running along x, stacked along y. */
const marks = (P, cx, cy, hw, hd, lines, z) => lines.map(([ind, len], i) => {
  const y = cy - hd + 4 + i * ((2 * hd - 8) / Math.max(1, lines.length - 1));
  return seg(P(cx - hw + 3 + ind, y, z), P(cx - hw + 3 + ind + len, y, z));
}).join("");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-D - FW, 0, 0], [D + FW, 0, 0], [0, -D - FD, 0], [0, D + FD, 0], [0, -D, FH + LMAX + 2], [-D, 0, FH + LMAX]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const files = FILES.map((f, k) => ({ k, ...f, z: tween(0), last: NaN }));
  const centre = { at: [0, 0] };
  /** A file's rail: a cable from the centre's top edge to the file's near side, with its node at the middle. */
  const addRail = (f) => { f.rail = mk("path", { class: "nf lo" }, g); f.node = flatDot(g, C, 1.6, "dot off"); };
  const addPlate = (it) => { it.el = solid(g); it.ln = mk("path", { class: "nf lo" }, g); };
  // back to front: the far rails and files, the centre, then the near rails and files, so each rail meets its file honestly
  addRail(files[0]); addRail(files[3]);
  addPlate(files[0]); addPlate(files[3]); addPlate(centre);
  addRail(files[1]); addRail(files[2]);
  addPlate(files[1]); addPlate(files[2]);
  put(centre.el, prism(P, front, ...rings(-CW, -CD, CW, CD, 3, 1.2), 0, CH));
  centre.ln.setAttribute("d", marks(P, 0, 0, CW, CD, CLINES, CH));

  function draw(f, z) {
    if (z === f.last) return;
    f.last = z;
    const [x, y] = f.at;
    put(f.el, prism(P, front, ...rings(x - FW, y - FD, x + FW, y + FD, 2.4, 1), z, z + FH));
    f.ln.setAttribute("d", marks(P, x, y, FW, FD, f.lines, z + FH));
    const ux = Math.sign(x), uy = Math.sign(y), a = ux ? CW : CD, b = D - (ux ? FW : FD);
    const p0 = P(ux * a, uy * a, CH * 0.6), p1 = P(ux * b, uy * b, z + FH * 0.5);
    f.rail.setAttribute("d", seg(p0, p1));
    place(f.node, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of files) { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each file's resting centre on screen; they never move
  const targets = files.map((f) => P(...f.at, FH));
  /** The file nearest the pointer, within reach; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 44;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.5); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = null;
  /** Lifts file a and lights its rail (-1 lifts the rest pose's a little); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), on = a >= 0 ? a : REST_I, from = a >= 0 ? a : act >= 0 ? act : REST_I;
    act = a;
    files.forEach((f) => {
      const ring = Math.min(Math.abs(f.k - from), 4 - Math.abs(f.k - from));
      tset(f.z, f.k === on ? (a >= 0 ? lift : lift * 0.55) : 0, now, ring * STEP);
      f.last = NaN;
      f.el.sil.classList.toggle("hi", f.k === on);
      f.rail.setAttribute("class", f.k === on ? "nf hi" : "nf lo");
      f.node.setAttribute("class", f.k === on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "file " + (a + 1);
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

const depgraph = {
  name: "depgraph",
  means: "A central file joined to four others: the file under the pointer lifts and its dependency rail lights up.",
  rules: [1, 2, 4, 5],
  range: [4, 9, 14],
  tour: [[304, 231], [96, 127], [96, 231], null],
  mount,
};

export default depgraph;
