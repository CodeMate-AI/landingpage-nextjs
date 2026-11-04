/**
 * Connectors: a round hub with four ports, and three tools of different
 * shapes (a box with a knob, a can, a shallow tray) each joined to it by a
 * cable rail. The tool under the pointer slides in along its rail and docks,
 * and its cable and port light; the other two ease back out, staggered from
 * it. One port stays free. At rest the box is docked. The slider is how far
 * the other tools ease back, in world units.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on each tool's lane, fixed in the world, unprojected at the tool's own
 * height, so a tool sliding along it cannot flip the choice.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, unproj, rings, rrect, prism, ringAt, run, poly, open, clamp,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, register, pointer, disposer,
} = HL;

const HR = 15, HH = 10, CW = 1.6, CH = 1.4, GAP = 20, REST_I = 0, STEP = 50;
// dir on the ground, half its size along that dir, height, and how far out it rests
const TOOLS = [
  { dir: [0, -1], kind: "box", half: 11, h: 18, out: 64 },
  { dir: [1, 0], kind: "can", half: 11, h: 24, out: 60 },
  { dir: [0, 1], kind: "tray", half: 10, h: 8, out: 54 },
];
const DOCK = (t) => HR + GAP + t.half;

/** The tool's paths centred on (cx, cy): its body first, then what sits on it, each as [d, class]. */
function shape(P, front, t, cx, cy) {
  const out = [];
  const body = (ring, inner) => { const s = prism(P, front, ring, inner, 0, t.h); out.push([s.sil, "sil"], [s.crease, "nf lo"]); };
  if (t.kind === "box") {
    body(...rings(cx - 11, cy - 11, cx + 11, cy + 11, 4, 1.2));
    const k = prism(P, front, rrect(cx - 3, cy - 3, cx + 3, cy + 3, 3, 6), rrect(cx - 2.2, cy - 2.2, cx + 2.2, cy + 2.2, 2.2, 6), t.h, t.h + 3);
    out.push([k.sil, ""], [k.crease, "nf lo"]);
  } else if (t.kind === "can") {
    const ring = rrect(cx - 11, cy - 11, cx + 11, cy + 11, 11, 14);
    body(ring, rrect(cx - 9.8, cy - 9.8, cx + 9.8, cy + 9.8, 9.8, 14));
    out.push([open(ringAt(P, run(ring, front), t.h * 0.3)), "nf lo"]);
  } else {
    body(...rings(cx - 15, cy - 10, cx + 15, cy + 10, 4, 1.2));
    const well = rrect(cx - 12, cy - 7, cx + 12, cy + 7, 2.6, 6);
    out.push([poly(ringAt(P, well, t.h)), "nf"], [open(ringAt(P, run(well, (q) => !front(q)), 2.5)), "nf lo"]);
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let back = value;

  // fitted with every tool at its farthest, so nothing leaves the frame at any setting
  const C = Cam(45, 0.5, 2.5);
  const far = TOOLS.flatMap((t) => [[t.dir[0] * (t.out + 16 + t.half + 5), t.dir[1] * (t.out + 16 + t.half + 5), 0], [t.dir[0] * DOCK(t), t.dir[1] * DOCK(t), t.h + 3]]);
  fit(C, [...far, [-HR, -HR, 0], [-HR, HR, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const mkTool = (t) => ({ t, cable: solid(g), z: tween(t === TOOLS[REST_I] ? DOCK(t) : t.out), paths: [], last: -1 });
  const tools = TOOLS.map((t) => ({ t }));
  // back to front: the far tool and its cable, the hub, then the two near cables and tools
  const order = [0, "hub", 1, 2];
  for (const o of order) {
    if (o === "hub") {
      put(solid(g), prism(P, front, rrect(-HR, -HR, HR, HR, HR, 14), rrect(-HR + 1.5, -HR + 1.5, HR - 1.5, HR - 1.5, HR - 1.5, 14), 0, HH));
      // four ports round the lid: one per tool, one left free
      for (const d of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const k = TOOLS.findIndex((t) => t.dir[0] === d[0] && t.dir[1] === d[1]);
        const dot = flatDot(g, C, 1.4, "dot off");
        place(dot, P(d[0] * 9.5, d[1] * 9.5, HH));
        if (k >= 0) tools[k].port = dot;
      }
      continue;
    }
    Object.assign(tools[o], mkTool(TOOLS[o]));
    tools[o].body = mk("g", {}, g);
  }

  function draw(tl, dist) {
    if (Math.abs(dist - tl.last) < 0.01) return;
    tl.last = dist;
    const { t } = tl, [dx, dy] = t.dir, a = HR - 1, b = dist - t.half + 1;
    // the cable: a low rail from the hub's rim to the tool's near face, along an axis
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const [cr, ci] = dx ? rings(dx * lo, -CW / 2, dx * hi, CW / 2, CW / 2, 0.5) : rings(-CW / 2, dy * lo, CW / 2, dy * hi, CW / 2, 0.5);
    put(tl.cable, prism(P, front, cr, ci, 0, CH));
    const paths = shape(P, front, t, dx * dist, dy * dist);
    while (tl.paths.length < paths.length) tl.paths.push(mk("path", {}, tl.body));
    paths.forEach(([d, cls], k) => { const el = tl.paths[k]; el.setAttribute("d", d); el.setAttribute("class", cls + (cls === "sil" && tl.on ? " hi" : "")); });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const tl of tools) { draw(tl, tval(tl.z, now)); if (!tdone(tl.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The tool whose lane, from the hub to past its resting place, holds the pointer at the tool's own height; -1 elsewhere. */
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    TOOLS.forEach((t, i) => {
      const [x, y] = unproj(C, sx, sy, t.h * 0.6);
      const along = x * t.dir[0] + y * t.dir[1], across = Math.abs(x * t.dir[1] - y * t.dir[0]);
      if (along < HR - 2 || along > t.out + t.half + 12 || across > t.half + 8) return;
      if (across < bd) { bd = across; best = i; }
    });
    return best;
  }

  let act = null;
  /** Docks tool a (-1 docks the rest pose's tool); the others ease back, staggered outwards from it. */
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), on = a >= 0 ? a : REST_I;
    act = a;
    tools.forEach((tl, i) => {
      tl.on = i === on;
      tl.last = -1;
      tset(tl.z, tl.on ? DOCK(tl.t) : tl.t.out + (a >= 0 ? back : 0), now, Math.abs(i - on) * STEP);
      tl.cable.sil.classList.toggle("hi", tl.on);
      tl.port.setAttribute("class", tl.on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "tool " + (a + 1);
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { back = clamp(v, 0, 16); setActive(act, true); },
    destroy: bag.dispose,
  };
}

const connectors = {
  name: "connectors",
  means: "Three tools on cables round a hub: the one under the pointer slides in and docks, and the others ease back out.",
  rules: [1, 2, 4, 9],
  range: [0, 8, 16],
  tour: [[296, 191], [80, 214], [305, 90], null],
  mount,
};

export default connectors;
