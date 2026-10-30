/**
 * Agent: a round agent puck inside a dashed orbit, a needle on its lid, joined by rails to a
 * code panel and two smaller task modules, each module with a box on its lid.
 * The target under the pointer is where the agent works next: the needle
 * turns to it, a token runs out along its rail and stops at its edge, and
 * the target lifts, taking the bright edge with its rail. The others settle.
 * At rest the agent is at work on the code panel. The slider is the lift.
 *
 * The pattern: discrete items. Tweens for the lift, the needle's turn and
 * the token's run, and a hit test on each target's resting centre on screen.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, circ, prism, ringAt, poly, seg, clamp,
  tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer,
} = HL;

const AR = 11, AH = 6, TK = 2.2, REST_I = 0, STEP = 50, LMAX = 12;
// the targets: the code panel, then the two task modules: centre, half size, height
const TARGETS = [
  { at: [40, -36], hw: 16, hd: 18, h: 3, code: true },
  { at: [-40, -8], hw: 9, hd: 9, h: 6 },
  { at: [-6, 40], hw: 9, hd: 9, h: 6 },
];
const NAMES = ["code", "task 1", "task 2"];
const LINES = [[0, 20], [4, 14], [4, 18], [8, 9], [4, 12], [0, 16]];
/** Turns a ring by angle a round the origin, normals and all. */
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.95);
  fit(C, [...TARGETS.flatMap(({ at: [x, y], hw, hd, h }) => [[x - hw, y - hd, 0], [x + hw, y + hd, 0], [x - hw, y + hd, 0], [x + hw, y - hd, h + LMAX]]), [-AR, AR, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  // each target's rail: from the agent's rim to the target's near edge, along the line between centres
  const ends = TARGETS.map(({ at: [x, y], hw, hd }) => {
    const d = Math.hypot(x, y), ux = x / d, uy = y / d, reach = Math.min(hw / Math.abs(ux || 1e-6), hd / Math.abs(uy || 1e-6));
    return { a: [ux * (AR + 1), uy * (AR + 1)], b: [x - ux * reach, y - uy * reach], ang: Math.atan2(y, x) };
  });

  const g = mk("g", {}, svg);
  const rails = ends.map(({ a, b }) => mk("path", { d: seg(P(...a, 0.6), P(...b, 0.6)), class: "nf lo" }, g));
  const items = TARGETS.map((t, k) => ({ k, ...t, z: tween(0), last: NaN }));
  const addItem = (it) => { it.el = solid(g); it.mk = mk("path", { class: "nf lo" }, g); };
  // back to front by x + y: task 1, the agent and its needle, the code panel, the token, task 2
  addItem(items[1]);
  // the agent's orbit on the ground, then the agent
  mk("path", { d: poly(ringAt(P, circ(AR + 5, 56), 0)), class: "nf dash" }, g);
  put(solid(g), prism(P, front, circ(AR, 48), circ(AR - 1.4, 48), 0, AH));
  const needle = solid(g);
  addItem(items[0]);
  const token = solid(g);
  addItem(items[2]);

  const ang = tween(ends[REST_I].ang);
  let run = tween(1), on = REST_I, act = null;
  // where the token set off from: its run goes back to the agent's rim, then out along the chosen rail
  let src = [...ends[REST_I].a, 0.6], tok = [...ends[REST_I].b, 0.6];
  const [nr, ni] = rings(1, -1.6, AR - 2.5, 1.6, 1.6, 0.6);

  function drawItem(it, z) {
    if (z === it.last) return;
    it.last = z;
    const [x, y] = it.at;
    put(it.el, prism(P, front, ...rings(x - it.hw, y - it.hd, x + it.hw, y + it.hd, 2.6, 1), z, z + it.h));
    const top = z + it.h;
    it.mk.setAttribute("d", it.code
      ? LINES.map(([ind, len], i) => seg(P(x - 12 + ind, y - 13 + i * 5.2, top), P(x - 12 + ind + len, y - 13 + i * 5.2, top))).join("")
      : poly(ringAt(P, rings(x - 4, y - 4, x + 4, y + 4, 1.2, 0.5)[0], top)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { drawItem(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    if (!tdone(ang, now) || !tdone(run, now)) moving = true;
    put(needle, prism(P, front, turn(nr, tval(ang, now)), turn(ni, tval(ang, now)), AH, AH + 1));
    // the token runs from the agent's rim along the rail to the target, at its height when it gets there
    const t = tval(run, now), e = ends[on], f = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const [p0, p1] = t < 0.5 ? [src, [...e.a, 0.6]] : [[...e.a, 0.6], [...e.b, 0.6]];
    tok = p0.map((v, i) => v + (p1[i] - v) * f);
    const [px, py, zt] = tok;
    put(token, prism(P, front, ...rings(px - 2.2, py - 2.2, px + 2.2, py + 2.2, 1, 0.5), zt, zt + TK));
    return moving;
  });
  bag.add(B.unregister);

  // hit targets: each target's resting centre on screen; they never move
  const targets = items.map((it) => P(...it.at, it.h));
  /** The target nearest the pointer, within reach; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = 52;
    targets.forEach(([tx, ty], k) => { const d = Math.hypot(sx - tx, (sy - ty) * 1.5); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  /** Sends the agent to target a (-1 the rest pose's): the needle turns, the token runs back and out again. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), next = a >= 0 ? a : REST_I;
    act = a;
    if (next !== on) { on = next; src = tok; run = tween(0); tset(run, 1, now, 0); }
    tset(ang, ends[on].ang, now, 0);
    items.forEach((it) => {
      tset(it.z, it.k === on ? (a >= 0 ? lift : lift * 0.6) : 0, now, Math.abs(it.k - on) * STEP);
      it.last = NaN;
      it.el.sil.classList.toggle("hi", it.k === on);
      rails[it.k].setAttribute("class", it.k === on ? "nf hi" : "nf lo");
    });
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

const agent = {
  name: "agent",
  means: "An agent at work: pointing at a task turns its needle there, and a token runs out along the rail as the task lifts.",
  rules: [1, 2, 4, 8],
  range: [4, 8, 12],
  tour: [[85, 122], [56, 207], [311, 183], null],
  mount,
};

export default agent;
