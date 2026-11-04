/**
 * Debug & Fix: an execution path that zigzags across the ground, a square
 * start, two steps and a round end, joined by rails. Its last rail is
 * broken: two stubs and a dashed slot between them where a piece is missing.
 * Beside the break waits the repair piece, a short rail of its own, and it
 * takes the bright edge. The nearer the pointer comes to the break, the
 * further the piece travels over to it on an arc and down into the slot;
 * seated, it closes the path, and the whole path takes the bright edge. At
 * rest the piece waits beside the break. The slider is the arc's height.
 *
 * The pattern: a continuous field. One spring for how far the fix has come,
 * read from the pointer's distance to the break on screen, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, ringAt, poly, clamp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const NH = 8, NZ = 5, RW = 1.7, RZ = 1.8, SIDE = 22, WAIT = 3, AMAX = 16;
// the path's nodes, the start first; each rail joins a node to the next along one axis
const NODES = [[-42, 20], [0, 20], [0, -22], [44, -22]];
const BREAK = 2, PIECE = 14;
/** A rail between two points on one axis, w its half width, as [ring, inner]. */
const rail = ([x0, y0], [x1, y1], w) => (y0 === y1
  ? rings(Math.min(x0, x1), y0 - w, Math.max(x0, x1), y0 + w, w, w * 0.45)
  : rings(x0 - w, Math.min(y0, y1), x0 + w, Math.max(y0, y1), w, w * 0.45));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let arc = value;

  // the broken rail runs along x; the slot is its middle, the piece waits SIDE nearer the viewer
  const [ax, ay] = NODES[BREAK], [bx] = NODES[BREAK + 1], mx = (ax + bx) / 2;
  const s0 = [mx - PIECE / 2, ay], s1 = [mx + PIECE / 2, ay];
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-42 - NH, 20 + NH, 0], [44 + NH, -22 - NH, 0], [0 + NH, 20 + NH, 0], [0 - NH, -22 - NH, NZ + 2],
    [mx, ay + SIDE + 3, 0], [mx, ay, AMAX + WAIT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const gx = P(mx, ay, 0);

  const g = mk("g", {}, svg);
  // the rails, the broken one as two stubs with the dashed slot between them, then the nodes
  const lit = [];
  NODES.slice(0, -1).forEach((n, k) => {
    const m = NODES[k + 1], sx = Math.sign(m[0] - n[0]), sy = Math.sign(m[1] - n[1]);
    const a = [n[0] + sx * NH, n[1] + sy * NH], b = [m[0] - sx * NH, m[1] - sy * NH];
    const parts = k === BREAK ? [[a, s0], [s1, b]] : [[a, b]];
    for (const [p, q] of parts) { const el = solid(g); put(el, prism(P, front, ...rail(p, q, RW), 0, RZ)); lit.push(el); }
  });
  mk("path", { d: poly(ringAt(P, rail(s0, s1, RW)[0], 0)), class: "nf dash" }, g);
  NODES.forEach(([x, y], k) => {
    const el = solid(g), end = k === NODES.length - 1;
    const ring = end ? [circ(NH + 1, 40).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), circ(NH - 0.4, 40).map((q) => ({ ...q, u: q.u + x, v: q.v + y }))]
      : rings(x - NH, y - NH, x + NH, y + NH, k === 0 ? 1.4 : 2.8, 1.1);
    put(el, prism(P, front, ...ring, 0, k === 0 ? NZ + 2 : NZ));
    lit.push(el);
  });
  // where the piece waits, dashed, then the piece, last: it starts nearer than everything
  mk("path", { d: poly(ringAt(P, rail([s0[0], ay + SIDE], [s1[0], ay + SIDE], RW * 1.6)[0], 0)), class: "nf dash" }, g);
  const patch = solid(g);
  patch.sil.classList.add("hi");

  const fix = spring(0, { eps: 0.002 });
  let drawn = "", fixed = null;

  function draw() {
    const f = clamp(fix.x, 0, 1), e = f * f * (3 - 2 * f);
    const y = ay + SIDE * (1 - e), z = WAIT * (1 - e) + arc * Math.sin(Math.PI * e);
    const key = y.toFixed(2) + "," + z.toFixed(2);
    if (key !== drawn) { drawn = key; put(patch, prism(P, front, ...rail([s0[0], y], [s1[0], y], RW * 1.6), z, z + RZ + 1.4)); }
    // fixed once the target is the slot: the whole path is the bright thing, the piece with it
    const now = fix.t >= 0.95;
    if (now !== fixed) { fixed = now; for (const el of lit) el.sil.classList.toggle("hi", now); }
  }

  const B = register(stage, (dt) => {
    const m = stepS(fix, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const dist = Math.hypot(sx - gx[0], (sy - gx[1]) * 1.4);
      fix.t = clamp(1 - (dist - 20) / 100, 0, 1);
      read.textContent = fix.t >= 0.95 ? "fixed" : fix.t > 0 ? "fixing" : "rest";
      B.wake();
    },
    leave: () => { fix.t = 0; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { arc = clamp(v, 0, AMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const debug = {
  name: "debug",
  means: "A path with one broken rail: as the pointer nears the break, a repair piece arcs over and seats, closing the path.",
  rules: [1, 3, 5, 6],
  range: [4, 9, 16],
  tour: [[55, 153], [230, 160], [295, 178], null],
  mount,
};

export default debug;
