/**
 * Debug from the terminal: a terminal window, its header rule, a finished row, and below it an execution path of four steps joined by rails,
 * the last rail broken. A loupe floats over the window and follows the
 * pointer along the path on springs, its glass framing the point it looks at; the steps under it rise, falling off
 * with distance. When the loupe comes over the break, the repair rises out
 * of it, a short rail held just over the gap on a dashed lead, and takes the
 * bright edge; elsewhere the loupe's rim has it. At rest the loupe is over
 * the break, the repair raised. The slider is the loupe's radius.
 *
 * The pattern: a continuous field. Springs, a falloff by distance, and a hit
 * test on the window's top plane, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, unproj, rings, circ, prism, ringAt, poly, seg, clamp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const TW = 40, TD = 21, TH = 3, PY = 5, NH = 4, HMIN = 2.4, HRISE = 2.4, LZ = 8, RZ = 2, RY = 0, RMAX = 8;
// the last stretch is the longest, so the loupe fits over its break clear of both steps
const STEPS = [-32, -18, -4, 28];
const BX = (STEPS[2] + STEPS[3]) / 2, GAP = 5, REST_X = BX;
/** A rail along x on row y, from x0 to x1, as [ring, inner]. */
const rail = (x0, x1, w = 1.2, y = PY) => rings(x0, y - w, x1, y + w, w, w * 0.45);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;

  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-TW, -TD, 0], [TW, TD, 0], [-TW, TD, 0], [TW, -TD, TH], [STEPS[0] - 14, PY, TH + LZ + 2], [STEPS[3] + 12, PY + 14, TH + LZ + 2], [BX, PY - 34, TH + LZ + 2], [BX, PY + RY, TH + RZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the window: plate, header rule, one finished row
  put(solid(g), prism(P, front, ...rings(-TW, -TD, TW, TD, 4, 1.3), 0, TH));
  mk("path", { d: seg(P(-TW + 2, -TD + 7, TH), P(TW - 2, -TD + 7, TH)) + seg(P(-TW + 12, -7, TH), P(6, -7, TH)), class: "nf lo" }, g);

  // the path: rails, the last broken into two stubs, then the steps
  STEPS.slice(0, -1).forEach((x, k) => {
    const a = x + NH, b = STEPS[k + 1] - NH;
    for (const [p, q] of k === 2 ? [[a, BX - GAP / 2], [BX + GAP / 2, b]] : [[a, b]]) put(solid(g), prism(P, front, ...rail(p, q), TH, TH + 1.2));
  });
  const steps = STEPS.map((x) => ({ x, ring: rings(x - NH, PY - NH, x + NH, PY + NH, 1.6, 0.8), sp: spring(HMIN, { eps: 0.03 }), el: solid(g), drawn: NaN }));
  // the repair: a dashed lead from the gap, then the piece held just over it, seen through the glass
  const lead = mk("path", { class: "nf dash" }, g);
  const fix = solid(g);
  const up = spring(1, { eps: 0.002 });
  // the loupe: rim, glass and handle, last
  const rim = mk("path", { class: "sil nf" }, g), glass = mk("path", { class: "nf lo" }, g), handle = solid(g);
  const lx = spring(REST_X, { eps: 0.05 }), ly = spring(PY, { eps: 0.05 });
  let drawn = "", atBreak = null;

  function draw() {
    const cx = lx.x, cy = ly.x, key = [cx, cy, up.x, R].map((v) => v.toFixed(2)).join(",");
    for (const st of steps) { const h = st.sp.x; if (h !== st.drawn) { st.drawn = h; put(st.el, prism(P, front, ...st.ring, TH, TH + h)); } }
    if (key === drawn) return;
    drawn = key;
    const z = TH + 1.2 + RZ * up.x;
    const ry = PY + RY * up.x;
    lead.setAttribute("d", up.x > 0.05 ? seg(P(BX, PY, TH + 1.2), P(BX, ry, z)) : "");
    put(fix, up.x > 0.05 ? prism(P, front, ...rail(BX - GAP / 2 - 1, BX + GAP / 2 + 1, 1.6, ry), z, z + 2) : { sil: "", crease: "" });
    // the loupe hangs over its target as the eye sees it: its centre at its height is the point on screen over the target
    const [ox, oy] = unproj(C, ...P(cx, cy, TH + 1.2 + RZ + 1), TH + LZ);
    const outer = circ(R, 40).map((q) => ({ ...q, u: q.u + ox, v: q.v + oy }));
    rim.setAttribute("d", prism(P, front, outer, outer, TH + LZ - 1, TH + LZ + 1).sil);
    glass.setAttribute("d", poly(ringAt(P, circ(R - 2, 40).map((q) => ({ ...q, u: q.u + ox, v: q.v + oy })), TH + LZ + 1)));
    put(handle, prism(P, front, ...rings(ox - 2, oy - R - 10, ox + 2, oy - R + 1, 2, 0.8), TH + LZ - 1, TH + LZ + 1));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const sp of [lx, ly, up, ...steps.map((s) => s.sp)]) if (stepS(sp, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  /** Aims the loupe at a point on the path's row; the steps under it rise, and over the break the repair comes up. */
  function aim(x, y, live) {
    lx.t = x; ly.t = y;
    steps.forEach((st) => { const u = Math.hypot(st.x - x, PY - y) / (R * 1.8); st.sp.t = HMIN + HRISE * (u >= 1 ? 0 : 1 - u); });
    const now = Math.hypot(x - BX, y - PY) < R * 0.8;
    up.t = now ? 1 : 0;
    if (now !== atBreak) { atBreak = now; fix.sil.classList.toggle("hi", now); rim.setAttribute("class", now ? "sil nf" : "hi nf"); }
    read.textContent = !live ? "rest" : now ? "fix" : "step " + (1 + steps.reduce((b, st, i) => (Math.abs(st.x - x) < Math.abs(steps[b].x - x) ? i : b), 0));
    B.wake();
  }
  const rest = () => aim(REST_X, PY, false);
  rest();

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], TH); aim(clamp(x, STEPS[0], STEPS[3]), clamp(y, PY - 6, PY + 6), true); },
    leave: rest,
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = clamp(v, 5, RMAX); drawn = ""; aim(lx.t, ly.t, read.textContent !== "rest"); },
    destroy: bag.dispose,
  };
}

const termdebug = {
  name: "termdebug",
  means: "A loupe over a terminal's broken run: it follows the pointer along the path, and over the break the repair rises.",
  rules: [1, 3, 4, 5],
  range: [5, 6.5, 8],
  tour: [[114, 133], [179, 166], [216, 184], null],
  mount,
};

export default termdebug;
