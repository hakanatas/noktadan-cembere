/* SAHNE 6 — ÇEMBER (70–86 s)             MAT.5.3.1 (a–c) · MAT.5.3.2 (b, c)
   The compass hops in, plants its needle at the centre O, opens to 3 cm
   (checked on the ruler) and turns once: a circle. Every point is 3 cm
   from O (radius); the diameter is twice the radius. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inCubic, inOut, hump } = LI.E;
  const G = LI.Geo, S = LI.Stage, CM = LI.CM;
  const O = [-60, 30], R = 3 * CM;

  function camera(t, env) {
    return LI.Camera.breathe(S.track(env, [[70, { x: 60, y: -60, zoom: 1.05 }], [73.6, { x: 40, y: -40, zoom: 1.12 }], [76.4, { x: -20, y: 0, zoom: 1.3 }], [86, { x: -40, y: 10, zoom: 1.35 }]], t), t, 0.4);
  }

  /** compass pose: hops in (closed), plants at O, opens, turns, leaves */
  function compassPose(t) {
    if (t < 72.2) {
      // three hops from the right
      const k = seg(t, 70.4, 72.2), x = lerp(900, O[0], k), hop = Math.abs(Math.sin(k * Math.PI * 3)) * 120;
      return { pivot: [x, O[1] - hop], r: 34, th: -0.15 + 0.3 * Math.sin(k * 18), a: seg(t, 70.4, 70.7) };
    }
    const open = lerp(34, R, outCubic(seg(t, 72.4, 73.5)));
    const th = t < 73.8 ? 0 : lerp(0, Math.PI * 2, inOut(seg(t, 73.8, 76.3)));
    const leave = seg(t, 76.4, 77.2);
    return { pivot: [O[0] + leave * 700, O[1] - leave * 500], r: open, th, a: 1 - leave };
  }

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10);
    // centre
    G.point(ctx, O[0], O[1], { r, grow: outBack(seg(t, 70.2, 70.5)) });
    G.label(ctx, 'O', O[0] - 36, O[1] + 44, { p: seg(t, 70.4, 70.8) });
    G.label(ctx, 'merkez', O[0] - 24, O[1] + 64, { size: 32, color: G.red(1 - seg(t, 76, 76.6)), p: seg(t, 70.6, 71.2), align: 'right' });
    // ruler checks the opening: 3 cm
    const ra = seg(t, 72.2, 72.5) * (1 - seg(t, 73.7, 74.1));
    G.ruler(ctx, O[0], O[1] + 3, { alpha: ra, cm: 6, highlight: t > 72.5 ? Math.floor(3 * seg(t, 72.5, 73.4) + 1e-6) : -1 });
    G.label(ctx, 'r = 3 cm', O[0] + R / 2, O[1] - 60, { size: 42, color: G.red(1 - seg(t, 76.2, 76.6)), p: seg(t, 73.2, 73.8) });
    // the circle being drawn
    const cp = compassPose(t);
    const circP = t < 73.8 ? 0 : inOut(seg(t, 73.8, 76.3));
    G.circle(ctx, O, R, { p: circP, w: 5.5 });
    // radii: all equal
    for (let i = 0; i < 8; i++) {
      const t0 = 76.6 + i * 0.22, a = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.2;
      const q = [O[0] + Math.cos(a) * R, O[1] + Math.sin(a) * R];
      const k = seg(t, t0, t0 + 0.35) * (1 - seg(t, 80.3, 80.8));
      if (k <= 0) continue;
      G.pen(ctx, O, q, { p: k, w: 3.2, color: LI.RED_RGB, seed: 30 + i });
      G.point(ctx, q[0], q[1], { r: r * 0.8, color: LI.RED_RGB, alpha: k, seed: 40 + i });
      if (k >= 1) G.label(ctx, '3 cm', O[0] + Math.cos(a) * (R + 58), O[1] + Math.sin(a) * (R + 58), { size: 30, color: G.red(1 - seg(t, 80.3, 80.8)) });
    }
    G.label(ctx, 'yarıçap', O[0] + R + 200, O[1] - 130, { size: 40, color: G.red(1 - seg(t, 80.3, 80.8)), p: seg(t, 78.4, 79.0), align: 'left' });
    // diameter = 2 × radius
    const dp = inOut(seg(t, 80.8, 81.8));
    if (dp > 0) {
      const L = [O[0] - R, O[1]], Rr = [O[0] + R, O[1]];
      G.pen(ctx, L, Rr, { p: dp, w: 6, seed: 50 });
      G.point(ctx, L[0], L[1], { r, seed: 51 }); G.point(ctx, Rr[0], Rr[1], { r, seed: 52 });
      G.label(ctx, 'r', O[0] - R / 2, O[1] - 34, { size: 42, color: G.red(1), p: seg(t, 81.8, 82.2) });
      G.label(ctx, 'r', O[0] + R / 2, O[1] - 34, { size: 42, color: G.red(1), p: seg(t, 82.0, 82.4) });
      G.dimension(ctx, L, Rr, 'çap = 6 cm', { off: -(R + 70), p: seg(t, 82.4, 83.4), size: 42 });
    }
    // the compass (on top)
    const res = G.compass(ctx, cp.pivot, cp.r, cp.th, { alpha: cp.a });
    void res;
    if (t > 85.3) { LI.Camera.screen(ctx); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${seg(t, 85.3, 86) * 0.85})`; ctx.fillRect(0, 0, env.W, env.H); }
  }

  LI.registerScene({ id: 6, start: 70, end: 86, name: 'Circle', nameTr: 'Çember',
    concept: 'Compass: centre O, radius r; diameter = 2r', conceptTr: 'Pergel: merkez O, yarıçap r; çap = 2r', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
