/**
 * Lens: a small network of paths on a board, branching from one square root
 * post into round posts, with a loupe floating over it. The loupe follows the
 * pointer on springs; the posts under it rise, falling off with distance, and
 * the path from the root to the post nearest its centre takes the bright
 * stroke: one direction found among several. At rest the loupe hangs over a
 * far leaf with its path lit. The slider is the loupe's radius.
 *
 * The pattern: a continuous field. Springs, a falloff by distance, a hit test
 * on the board's plane (which never moves), and a dashed guide on the board
 * under the loupe.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, unproj, rings, rrect, prism, ringAt, poly, seg, clamp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const BX = 122, BY = 98, PB = 5, LZ = 17, INSET = 14, HMIN = 3, HRISE = 11, REST_N = 7;
// the network: [x, y, parent]; node 0 is the root
const NODES = [
  [14, 48, -1], [44, 26, 0], [44, 70, 0], [76, 12, 1], [78, 40, 1],
  [76, 66, 2], [82, 88, 2], [108, 30, 4], [106, 60, 5],
];
/** The share of full rise at u radii from the loupe's centre: 1 → .3 at half → 0 beyond. */
const falloff = (u) => (u >= 1 ? 0 : u <= 0.5 ? 1 - u * 1.4 : 0.3 * (1 - (u - 0.5) / 0.5));
/** The path from the root to node i, as the list of its nodes. */
const pathTo = (i) => (i < 0 ? [] : [...pathTo(NODES[i][2]), i]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;

  const C = Cam(45, 0.5, 1.95);
  // the loupe's aim is kept INSET inside the board; the fit holds it at its widest there, handle and all
  const RM = 24, lens = [[INSET - RM, INSET - RM], [BX - INSET + RM + 16, INSET - RM], [INSET - RM, BY - INSET + RM], [BX - INSET + RM + 16, BY - INSET + RM]];
  fit(C, [[-6, -6, -PB], [BX + 6, BY + 6, -PB], [BX + 6, -6, -PB], [-6, BY + 6, -PB], ...lens.map(([x, y]) => [x, y, LZ + 1])], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-6, -6, BX + 6, BY + 6, 9, 2.2), -PB, 0));
  // the paths: lines on the board between each node and its parent
  const edges = NODES.map(([x, y, p]) => (p < 0 ? null : mk("path", { d: seg(P(x, y, 0), P(NODES[p][0], NODES[p][1], 0)), class: "nf lo" }, g)));
  const shadow = mk("path", { class: "nf dash" }, g);

  // posts back to front, by x + y
  const posts = NODES.map(([x, y], i) => {
    const r = i === 0 ? 6 : 4.5;
    const ring = i === 0 ? rrect(x - r, y - r, x + r, y + r, 2, 4) : rrect(x - r, y - r, x + r, y + r, r, 8);
    const inner = i === 0 ? rrect(x - r + 1, y - r + 1, x + r - 1, y + r - 1, 1, 4) : rrect(x - r + 1, y - r + 1, x + r - 1, y + r - 1, r - 1, 8);
    return { i, x, y, ring, inner, sp: spring(HMIN, { eps: 0.04 }), drawn: NaN };
  });
  for (const pt of posts.slice().sort((a, b) => a.x + a.y - (b.x + b.y))) pt.el = solid(g);

  // the loupe: a rim with a short handle, drawn last, floating above everything
  const rim = mk("path", { class: "sil nf" }, g), glass = mk("path", { class: "nf lo" }, g);
  const handle = solid(g);
  const lx = spring(NODES[REST_N][0], { eps: 0.05 }), ly = spring(NODES[REST_N][1], { eps: 0.05 });
  let drawnLens = "";

  function drawLens() {
    const cx = lx.x, cy = ly.x, key = cx.toFixed(2) + "," + cy.toFixed(2) + "," + R;
    if (key === drawnLens) return;
    drawnLens = key;
    const outer = rrect(cx - R, cy - R, cx + R, cy + R, R, 14);
    rim.setAttribute("d", prism(P, front, outer, outer, LZ - 1, LZ + 1).sil);
    glass.setAttribute("d", poly(ringAt(P, rrect(cx - R + 2.2, cy - R + 2.2, cx + R - 2.2, cy + R - 2.2, R - 2.2, 14), LZ + 1)));
    shadow.setAttribute("d", poly(ringAt(P, outer, 0)));
    put(handle, prism(P, front, ...rings(cx + R - 1, cy - 2.2, cx + R + 16, cy + 2.2, 2.2, 0.8), LZ - 1, LZ + 1));
  }
  function drawPost(pt) {
    const h = Math.max(1, pt.sp.x);
    if (h === pt.drawn) return;
    pt.drawn = h;
    put(pt.el, prism(P, front, pt.ring, pt.inner, 0, h));
  }

  const B = register(stage, (dt) => {
    let m = false;
    if (stepS(lx, dt)) m = true;
    if (stepS(ly, dt)) m = true;
    for (const pt of posts) { if (stepS(pt.sp, dt)) m = true; drawPost(pt); }
    drawLens();
    return m;
  });
  bag.add(B.unregister);

  /** Aims the loupe at a board point and lights the path to the post nearest that aim, the spring's target, not its position. */
  function aim(x, y, live) {
    lx.t = x; ly.t = y;
    let near = 0;
    posts.forEach((pt) => { if (Math.hypot(pt.x - x, pt.y - y) < Math.hypot(posts[near].x - x, posts[near].y - y)) near = pt.i; });
    const lit = new Set(pathTo(near));
    posts.forEach((pt) => {
      pt.sp.t = HMIN + HRISE * falloff(Math.hypot(pt.x - x, pt.y - y) / (R * 1.6));
      pt.el.sil.classList.toggle("hi", lit.has(pt.i));
      if (edges[pt.i]) edges[pt.i].setAttribute("class", lit.has(pt.i) ? "nf hi" : "nf lo");
    });
    read.textContent = live ? "node " + near : "rest";
    B.wake();
  }
  const rest = () => aim(NODES[REST_N][0], NODES[REST_N][1], false);
  rest();

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(clamp(x, INSET, BX - INSET), clamp(y, INSET, BY - INSET), true); },
    leave: rest,
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; drawnLens = ""; aim(lx.t, ly.t, read.textContent !== "rest"); },
    destroy: bag.dispose,
  };
}

const lens = {
  name: "lens",
  means: "A loupe over a network of paths: the posts under it rise, and the path from the root to the one it finds lights up.",
  rules: [1, 3, 4, 5],
  range: [12, 17, 24],
  tour: [[137, 182], [225, 185], [164, 221], null],
  mount,
};

export default lens;
