/**
 * Tests: a central code module, its lid ruled with code lines, and three
 * test panels around it, each joined to it by a lead and each carrying a
 * check mark in relief. The panel under the pointer runs: it lifts, its
 * check stands up tall, and it takes the bright edge with its lead and its
 * check. The others settle, staggered from it, their checks low. At rest
 * one test is running. The slider is the lift.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each panel's resting centre on screen, so a lifting panel cannot flip it.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, poly, seg, fillet, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const CM = 14, CH = 8, PW = 10, PH = 2.6, CK0 = 0.6, CK1 = 3, REST_I = 1, STEP = 50, LMAX = 12;
const PANELS = [[-46, 2], [2, -46], [42, 42]];
const LINES = [[0, 18], [4, 13], [4, 16], [8, 9], [0, 12]];
// a check mark, drawn in the screen's own axes: a short arm down to the corner, a long arm up
const CHECK = [[-5.2, 0.6], [-1.5, 4.3], [5.2, -2.4], [3.8, -3.8], [-1.5, 1.5], [-3.8, -0.8]];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** The check's outline centred on (cx, cy), stretched along the screen's vertical, which the view halves. */
const check = (cx, cy) => fillet(CHECK.map(([a, b]) => [cx + a * A[0] + b * 2 * Bv[0], cy + a * A[1] + b * 2 * Bv[1]]), [0.6, 0.6, 0.6, 0.6, 0.4, 0.6]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-46 - PW, 2, 0], [2, -46 - PW, 0], [42 + PW, 42 + PW, 0], [42 - PW, 42 + PW, 0], [42 + PW, 42 - PW, 0], [2, -46, PH + LMAX + CK1 + 2], [0, 0, CH]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const items = PANELS.map((at, k) => ({ k, at, z: tween(0), last: NaN }));
  const addLead = (it) => { it.lead = mk("path", { class: "nf lo" }, g); };
  const addPanel = (it) => { it.el = solid(g); it.back = mk("path", { class: "lo" }, g); it.face = mk("path", { class: "sil" }, g); };
  // back to front: the far leads and panels, the module, then the near lead and panel
  addLead(items[0]); addLead(items[1]); addPanel(items[0]); addPanel(items[1]);
  const mod = solid(g);
  put(mod, prism(P, front, ...rings(-CM, -CM, CM, CM, 3.5, 1.3), 0, CH));
  mk("path", { d: LINES.map(([ind, len], i) => seg(P(-10 + ind, -9 + i * 4.5, CH), P(-10 + ind + len, -9 + i * 4.5, CH))).join(""), class: "nf lo" }, g);
  addLead(items[2]); addPanel(items[2]);

  let on = REST_I, act = null;
  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const [x, y] = it.at, top = z + PH, hc = CK0 + (CK1 - CK0) * clamp(z / Math.max(lift, 0.01), 0, 1);
    put(it.el, prism(P, front, ...rings(x - PW, y - PW, x + PW, y + PW, 2.6, 1), z, top));
    const ck = check(x, y);
    it.back.setAttribute("d", poly(ck.map(([u, v]) => P(u, v, top))));
    it.face.setAttribute("d", poly(ck.map(([u, v]) => P(u, v, top + hc))));
    // the lead: from the module's side at half its height to the panel's near side at half its own
    const d = Math.hypot(x, y), ux = x / d, uy = y / d, r0 = CM / Math.max(Math.abs(ux), Math.abs(uy)), r1 = d - PW / Math.max(Math.abs(ux), Math.abs(uy));
    it.lead.setAttribute("d", seg(P(ux * r0, uy * r0, CH * 0.5), P(ux * r1, uy * r1, z + PH * 0.5)));
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

  /** Runs test a (-1 the rest pose's, a little lower); the others settle, staggered from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = on;
    on = a >= 0 ? a : REST_I;
    act = a;
    items.forEach((it) => {
      tset(it.z, it.k === on ? (a >= 0 ? lift : lift * 0.7) : 0, now, Math.abs(it.k - from) * STEP);
      it.last = NaN;
      it.el.sil.classList.toggle("hi", it.k === on);
      it.face.setAttribute("class", it.k === on ? "hi" : "sil");
      it.lead.setAttribute("class", it.k === on ? "nf hi" : "nf lo");
    });
    read.textContent = a < 0 ? "rest" : "test " + (a + 1);
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

const tests = {
  name: "tests",
  means: "A code module and three tests round it: the test under the pointer runs, lifting as its check mark stands up.",
  rules: [1, 2, 4, 10],
  range: [4, 8, 12],
  tour: [[107, 111], [200, 236], [293, 111], null],
  mount,
};

export default tests;
