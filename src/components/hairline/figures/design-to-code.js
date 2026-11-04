/**
 * Design to Code: a wireframe panel on the left (a header bar, a media card,
 * a pill button) and a code panel on the right, opened by a pair of tag
 * chevrons, its lines indented into three blocks, one per component. The
 * row under the pointer, on either panel, lifts both its component and its
 * block of code, and a bright bridge joins the two: this part became these
 * lines. The others settle back, staggered from it. At rest the card and its
 * block are lifted. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on the rows' resting centres on screen, so a lifting row cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, rrect, prism, ringAt, poly, seg, fillet, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const WX = -34, WY = 0, CX = 34, CY = 0, PZ = 2.2, REST_I = 1, STEP = 50, LMAX = 12;
// the components, in the wireframe's own coordinates: [x0, y0, x1, y1, radius, height]
const COMP = [[-14, -23, 14, -16, 2, 2], [-14, -11, 14, 9, 2.6, 3.4], [-14, 13, 3, 20, 3.5, 2.4]];
// each component's block of code, level with it: [indent, y, length] per line
const CODE = [
  [[0, -19.5, 22]],
  [[4, -9, 20], [8, -4, 13], [8, 1, 17], [4, 6, 9]],
  [[4, 16.5, 15]],
];

/** A chevron at (cx, cy), drawn in the screen's own axes: pointing left, or right when dir is -1. */
function chevron(cx, cy, dir) {
  const A = [Math.SQRT1_2 * dir, -Math.SQRT1_2 * dir], Bv = [Math.SQRT1_2, Math.SQRT1_2];
  const pts = [[2.4, -5], [-2.4, 0], [2.4, 5], [2.4, 2.4], [0, 0], [2.4, -2.4]];
  return fillet(pts.map(([a, b]) => [cx + a * A[0] + b * Bv[0], cy + a * A[1] + b * Bv[1]]), [0.6, 0.6, 0.6, 0.4, 0.4, 0.4]);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.85);
  fit(C, [[WX - 18, WY - 27, 0], [WX - 18, WY + 25, 0], [WX + 18, WY + 25, 0], [CX + 18, CY - 41, 0],
    [CX + 18, CY + 25, 0], [WX - 14, WY - 23, PZ + 2 + LMAX], [CX - 18, CY - 41, PZ + LMAX]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the wireframe: its panel, then its components back to front, the card with its media frame
  put(solid(g), prism(P, front, ...rings(WX - 18, WY - 27, WX + 18, WY + 25, 3.5, 1.2), 0, PZ));
  const comps = COMP.map(([x0, y0, x1, y1, r, h]) => ({
    ring: rings(WX + x0, WY + y0, WX + x1, WY + y1, r, 0.8), h, el: solid(g), edge: [WX + x1, WY + (y0 + y1) / 2],
  }));
  const media = mk("path", { class: "nf lo" }, g);
  const mediaRing = rrect(WX - 11, WY - 8, WX + 11, WY + 2, 1.6, 4);

  // the code panel: its plate, the tag chevrons, then its lines block by block
  put(solid(g), prism(P, front, ...rings(CX - 18, CY - 41, CX + 18, CY + 25, 3.5, 1.2), 0, PZ));
  // side by side along the screen's horizontal, so they read as a pair
  [[-8, -29, 1], [-1, -36, -1]].forEach(([dx, dy, dir]) => {
    const ch = chevron(CX + dx, CY + dy, dir);
    mk("path", { d: poly(ch.map(([x, y]) => P(x, y, PZ))), class: "lo" }, g);
    mk("path", { d: poly(ch.map(([x, y]) => P(x, y, PZ + 1))), class: "sil" }, g);
  });
  const blocks = CODE.map((lines) => lines.map(([ind, y, len]) => ({
    ring: rings(CX - 14 + ind, CY + y - 1.1, CX - 14 + ind + len, CY + y + 1.1, 1.1, 0.45), el: solid(g),
  })));
  const ends = CODE.map((lines) => [CX - 14 + lines[0][0], CY + lines.reduce((s, l) => s + l[1], 0) / lines.length]);
  // the bridge, drawn last: level with its row, it runs through the gap between the panels
  const bridge = mk("path", { class: "nf hi" }, g);

  const rows = COMP.map(() => ({ z: tween(0), last: NaN }));
  let act = null, on = REST_I;

  function draw(k, z) {
    const r = rows[k], c = comps[k];
    if (z === r.last) return false;
    r.last = z;
    put(c.el, prism(P, front, ...c.ring, PZ + z, PZ + z + c.h));
    if (k === 1) media.setAttribute("d", poly(ringAt(P, mediaRing, PZ + z + c.h)));
    blocks[k].forEach((ln) => put(ln.el, prism(P, front, ...ln.ring, PZ + z, PZ + z + 0.9)));
    return true;
  }
  function drawBridge(now) {
    const z = tval(rows[on].z, now), c = comps[on];
    bridge.setAttribute("d", seg(P(...c.edge, PZ + z + c.h / 2), P(...ends[on], PZ + z + 0.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, changed = false;
    rows.forEach((r, k) => { if (draw(k, tval(r.z, now))) changed = true; if (!tdone(r.z, now)) moving = true; });
    if (changed) drawBridge(now);
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each row's component and code block, at rest, on screen; they never move
  const targets = COMP.flatMap(([x0, y0, x1, y1], k) => [[k, P(WX + (x0 + x1) / 2, WY + (y0 + y1) / 2, PZ)], [k, P(ends[k][0] + 8, ends[k][1], PZ)]]);
  /** The row whose component or code is nearest the pointer, within reach; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 36;
    targets.forEach(([k, [tx, ty]]) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.6); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Lifts row a and its code (-1 lifts the rest pose's row a little); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : REST_I;
    on = a >= 0 ? a : REST_I;
    act = a;
    rows.forEach((r, k) => {
      tset(r.z, k === on ? (a >= 0 ? lift : lift * 0.6) : 0, now, Math.abs(k - from) * STEP);
      r.last = NaN;
      comps[k].el.sil.classList.toggle("hi", k === on);
    });
    read.textContent = a < 0 ? "rest" : ["header", "card", "button"][a];
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

const designToCode = {
  name: "design-to-code",
  means: "A wireframe and its code: the row under the pointer lifts a component and its lines together, joined by a bridge.",
  rules: [1, 2, 4, 10],
  range: [4, 8, 12],
  tour: [[155, 124], [72, 155], [242, 205], null],
  mount,
};

export default designToCode;
