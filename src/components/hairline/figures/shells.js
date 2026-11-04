/**
 * Your own shell: a central terminal window, a header rule and a prompt, and
 * around it three smaller shell panels on leads, each framed a little
 * differently: one with a tab over its header rule, one with a full title
 * bar and its title, one bare with a single thin top rule and tighter
 * corners. Each carries a prompt chevron and one row. The panel under
 * the pointer is in use: it lifts, its lead goes bright with it, and the
 * cursor on the centre window lights. The others settle, staggered from
 * it. At rest one shell is in use. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each panel's resting centre on screen, so a lifting panel cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, open, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const CW = 18, CD = 14, CH = 4, PW = 12, PD = 9, PH = 2.4, REST_I = 1, STEP = 50, LMAX = 8;
const PANELS = [[-48, 0], [0, -46], [44, 40]];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** A prompt chevron at (cx, cy), one open stroke in the screen's own axes, pointing right. */
const chev = (cx, cy, s) => [[-2.4, -5], [2.4, 0], [-2.4, 5]].map(([a, b]) => [cx + a * s * A[0] + b * s * Bv[0], cy + a * s * A[1] + b * s * Bv[1]]);

/** The window furniture of shell k, at (x, y) on a top at z: each frame its own, and no window buttons. */
function frame(k, x, y, z, P) {
  const x0 = x - PW, y0 = y - PD, x1 = x + PW;
  // a tab standing on the header rule
  if (k === 0) return seg(P(x0 + 1.5, y0 + 4.5, z), P(x1 - 1.5, y0 + 4.5, z)) + open([[x0 + 2.5, y0 + 4.5], [x0 + 2.5, y0 + 1.6], [x0 + 10, y0 + 1.6], [x0 + 10, y0 + 4.5]].map(([u, v]) => P(u, v, z)));
  // a full title bar, its title centred on it
  if (k === 1) return seg(P(x0 + 1.5, y0 + 5.5, z), P(x1 - 1.5, y0 + 5.5, z)) + seg(P(x - 4, y0 + 2.8, z), P(x + 4, y0 + 2.8, z));
  // bare: one thin top rule
  return seg(P(x0 + 4, y0 + 2.6, z), P(x1 - 4, y0 + 2.6, z));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.8);
  // every corner of every panel, at rest and fully lifted, so a lifted panel never leaves the frame
  fit(C, PANELS.flatMap(([x, y]) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].flatMap(([a, b]) => [[x + a * PW, y + b * PD, 0], [x + a * PW, y + b * PD, PH + LMAX]])), 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const items = PANELS.map((at, k) => ({ k, at, z: tween(0), last: NaN }));
  const addLead = (it) => { it.lead = mk("path", { class: "nf lo" }, g); };
  const addPanel = (it) => { it.el = solid(g); it.lines = mk("path", { class: "nf lo" }, g); it.ch = mk("path", { class: "sil nf" }, g); it.row = mk("path", { class: "nf lo" }, g); };
  // back to front: the far leads and panels, the centre window, then the near lead and panel
  addLead(items[0]); addLead(items[1]); addPanel(items[0]); addPanel(items[1]);
  put(solid(g), prism(P, front, ...rings(-CW, -CD, CW, CD, 3.5, 1.3), 0, CH));
  mk("path", { d: seg(P(-CW + 2, -CD + 6, CH), P(CW - 2, -CD + 6, CH)) + seg(P(-CW + 11, -2, CH), P(CW - 5, -2, CH)), class: "nf lo" }, g);
  mk("path", { d: open(chev(-CW + 6, 5, 0.65).map(([x, y]) => P(x, y, CH))), class: "sil nf" }, g);
  // the cursor: a flat underscore after the prompt
  const cursor = solid(g);
  put(cursor, prism(P, front, ...rings(-CW + 10, 4.4, -CW + 15, 5.6, 0.5, 0.2), CH, CH + 0.4));
  addLead(items[2]); addPanel(items[2]);

  let on = REST_I, act = null;
  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const [x, y] = it.at, top = z + PH;
    put(it.el, prism(P, front, ...rings(x - PW, y - PD, x + PW, y + PD, it.k === 2 ? 1.2 : 2.6, 0.9), z, top));
    it.lines.setAttribute("d", frame(it.k, x, y, top, P));
    it.ch.setAttribute("d", open(chev(x - PW + 4.5, y + 3, 0.45).map(([u, v]) => P(u, v, top))));
    it.row.setAttribute("d", seg(P(x - PW + 8, y + 3, top), P(x + PW - 4, y + 3, top)));
    // the lead: from the foot of the centre window's side to the panel's near side at half its height
    const d = Math.hypot(x, y), ux = x / d, uy = y / d;
    const r0 = Math.min(CW / Math.abs(ux || 1e-9), CD / Math.abs(uy || 1e-9)), r1 = d - Math.min(PW / Math.abs(ux || 1e-9), PD / Math.abs(uy || 1e-9));
    it.lead.setAttribute("d", seg(P(ux * r0, uy * r0, 0), P(ux * r1, uy * r1, z + PH * 0.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each panel's resting centre on screen; they never move
  const targets = items.map((it) => P(...it.at, PH));
  /** The panel nearest the pointer, within reach; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 48;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.5); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Puts shell a in use (-1 the rest pose's, a little lower); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    items.forEach((it) => {
      tset(it.z, it.k === on ? (a >= 0 ? lift : lift * 0.7) : 0, now, Math.abs(it.k - from) * STEP);
      it.last = NaN;
      it.el.sil.classList.toggle("hi", it.k === on);
      it.lead.setAttribute("class", it.k === on ? "nf hi" : "nf lo");
    });
    cursor.sil.classList.toggle("hi", a >= 0);
    read.textContent = a < 0 ? "rest" : "shell " + (a + 1);
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

const shells = {
  name: "shells",
  means: "One assistant, three shells: the shell under the pointer is in use, lifting on its lead from the central terminal.",
  rules: [1, 2, 4, 10],
  range: [3, 5, 8],
  tour: [[107, 107], [210, 238], [293, 109], null],
  mount,
};

export default shells;
