/**
 * Design Mode: a canvas holding a few interface parts, a two-column layout
 * block, a card with its media frame and two lines, a pill button and a thin
 * text row. One part is selected: it stands lifted, wrapped in a bright
 * selection frame with four square handles at its corners, and two dashed
 * guides run from it to the canvas's edges. The part under the pointer takes
 * the selection: the frame and guides travel to it, it lifts, and the last
 * one settles back. At rest the card is selected. The slider is the lift.
 *
 * The pattern: discrete items. Tweens for the lift and for the frame's
 * travel, and a hit test on each part's resting top, unprojected at its own
 * height, so a part that lifts cannot flip the choice.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, unproj, rings, rrect, prism, ringAt, poly, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const CW = 50, CD = 40, CZ = 2, PAD = 3, HS = 1.6, REST_I = 1, STEP = 45, LMAX = 12;
// the parts: [x0, y0, x1, y1, radius, height], back to front
const PARTS = [[-44, -34, -6, 4, 2.4, 2.4], [2, -34, 42, -4, 2.8, 4], [-44, 12, -6, 24, 1.6, 1.4], [8, 6, 34, 16, 5, 3]];
const NAMES = ["layout", "card", "row", "button"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-CW, -CD, 0], [CW, CD, 0], [-CW, CD, 0], [CW, -CD, 0], [2 - PAD, -34 - PAD, CZ + 4 + LMAX]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-CW, -CD, CW, CD, 5, 1.6), 0, CZ));
  // the guides lie on the canvas, under every part
  const guides = mk("path", { class: "nf dash" }, g);

  const parts = PARTS.map(([x0, y0, x1, y1, r, h], k) => {
    const grp = mk("g", {}, g);
    const pt = { k, box: [x0, y0, x1, y1], h, ring: rings(x0, y0, x1, y1, r, 0.8), el: solid(grp), marks: mk("path", { class: "nf lo" }, grp), z: tween(0), last: NaN };
    return pt;
  });
  /** What each part carries on its top: the layout's column split, the card's media frame and lines, the row's line. */
  const marks = [
    (z) => seg(P(-25, -31, z), P(-25, 1, z)),
    (z) => poly(ringAt(P, rrect(6, -30, 38, -18, 1.6, 4), z)) + seg(P(6, -13, z), P(34, -13, z)) + seg(P(6, -9, z), P(24, -9, z)),
    (z) => seg(P(-41, 18, z), P(-18, 18, z)),
    () => "",
  ];

  // the selection: a frame and four handles, moved to sit just after the selected part
  const sel = mk("g", {}, g);
  const frame = mk("path", { class: "nf hi" }, sel);
  const handles = [0, 1, 2, 3].map(() => solid(sel));
  const at = [0, 1, 2, 3].map((i) => tween(PARTS[REST_I][i]));
  const az = tween(0);
  let on = REST_I, act = null;

  function drawSel(now) {
    const [x0, y0, x1, y1] = at.map((tw) => tval(tw, now)), z = CZ + tval(az, now) + 0.4;
    const box = [x0 - PAD, y0 - PAD, x1 + PAD, y1 + PAD];
    frame.setAttribute("d", poly(ringAt(P, rrect(...box, 2, 4), z)));
    [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]].forEach(([x, y], i) => {
      put(handles[i], prism(P, front, ...rings(x - HS, y - HS, x + HS, y + HS, 0.5, 0.4), z - 0.4, z + 0.8));
    });
    // guides from the frame's back corner along both edges to the canvas's edges
    guides.setAttribute("d", seg(P(box[0], box[1], CZ), P(-CW + 2, box[1], CZ)) + seg(P(box[0], box[1], CZ), P(box[0], -CD + 2, CZ)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    parts.forEach((pt) => {
      const z = tval(pt.z, now);
      if (!tdone(pt.z, now)) moving = true;
      if (z === pt.last) return;
      pt.last = z;
      put(pt.el, prism(P, front, ...pt.ring, CZ + z, CZ + z + pt.h));
      pt.marks.setAttribute("d", marks[pt.k](CZ + z + pt.h));
    });
    if (moving || at.some((tw) => !tdone(tw, now)) || !tdone(az, now)) moving = true;
    drawSel(now);
    return moving;
  });
  bag.add(B.unregister);

  /** The part that puts the pointer nearest its middle, on its own resting top; -1 off every part. */
  function hit([sx, sy]) {
    let best = -1, bd = 1.25;
    parts.forEach((pt) => {
      const [x, y] = unproj(C, sx, sy, CZ + pt.h), [x0, y0, x1, y1] = pt.box;
      const d = Math.max(Math.abs(x - (x0 + x1) / 2) / ((x1 - x0) / 2 + PAD), Math.abs(y - (y0 + y1) / 2) / ((y1 - y0) / 2 + PAD));
      if (d < bd) { bd = d; best = pt.k; }
    });
    return best;
  }

  /** Selects part a (-1 the rest pose's): it lifts and the frame travels to it; the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    parts.forEach((pt) => {
      tset(pt.z, pt.k === on ? (a >= 0 ? lift : lift * 0.6) : 0, now, Math.abs(pt.k - from) * STEP);
      pt.el.sil.classList.toggle("hi", false);
    });
    PARTS[on].slice(0, 4).forEach((v, i) => tset(at[i], v, now, 0));
    tset(az, PARTS[on][5] + (a >= 0 ? lift : lift * 0.6), now, 0);
    // the frame belongs to the selected part: paint it just after that part, before anything nearer
    parts[on].el.g.parentNode.after(sel);
    read.textContent = a < 0 ? "rest" : NAMES[a];
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

const designMode = {
  name: "design-mode",
  means: "A design canvas: the part under the pointer takes the selection, lifting inside a frame with handles and guides.",
  rules: [1, 2, 6, 8],
  range: [3, 7, 12],
  tour: [[182, 120], [218, 184], [122, 152], null],
  mount,
};

export default designMode;
