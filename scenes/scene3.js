/* SAHNE 3 — IŞIN (27–40 s)              MAT.5.3.1 (c) · MAT.5.3.2 (b, c)
   Past B the pencil keeps going, the camera chases it, the ruler keeps
   sliding… it never ends. Notation [AB: one endpoint (A), endless in one
   direction, so it cannot be measured. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inCubic, inOut, hump } = LI.E;
  const G = LI.Geo, S = LI.Stage, CM = LI.CM;
  const A = S.A, B = S.B;
  const FAR = 5200;

  const endX = (t) => lerp(B[0], FAR, Math.pow(seg(t, 27.6, 31.6), 2.2));

  function camera(t, env) {
    const E = endX(t);
    const follow = LI.Stage.cam(env, Math.max(20, E - 480), 30, lerp(1.25, 0.95, seg(t, 27.6, 30)));
    const start = LI.Stage.cam(env, 20, 40, 1.25);
    const over = LI.Stage.cam(env, 760, 20, 0.55);
    let cam = LI.Camera.mix(start, follow, seg(t, 27.2, 28.2));
    cam = LI.Camera.mix(cam, over, inOut(seg(t, 31.5, 33.0)));
    return LI.Camera.breathe(cam, t, 0.4);
  }
  const viewRight = (cam, env) => cam.x + env.W / 2 / cam.zoom;

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10), z = cam.zoom, w = 5.5 / Math.max(0.55, Math.min(1, z)) * Math.min(1, z / 0.55) ;
    const lw = 6 / z; // screen-constant pen width
    const E = endX(t);
    // the ray
    G.pen(ctx, A, [E, 0], { w: Math.max(5.5, lw) });
    const vr = viewRight(cam, env);
    const tipX = Math.min(E, vr - 70 / z);
    if (E > vr - 40 / z || t > 31.6) G.arrow(ctx, [tipX, 0], 0, { len: 34 / z, w: Math.max(5, lw) });
    // the old segment's labels fade away
    const fade = 1 - seg(t, 27, 27.6);
    G.label(ctx, '[AB]', 0, -78, { size: 60, alpha: fade });
    G.dimension(ctx, A, B, '|AB| = 8 cm', { off: 150, p: fade, size: 42 });
    // points
    G.point(ctx, A[0], A[1], { r, seed: 1 }); G.point(ctx, B[0], B[1], { r, seed: 2 });
    const ls = Math.max(50, 46 / z);
    G.label(ctx, 'A', A[0] - ls * 0.7, A[1] - ls * 0.95, { size: ls }); G.label(ctx, 'B', B[0] + ls * 0.6, B[1] - ls * 0.95, { size: ls });
    // ruler sliding along with the pencil (it can never keep up)
    const chase = seg(t, 27.4, 27.8) * (1 - seg(t, 31.2, 31.7));
    G.ruler(ctx, E - 9 * CM, 3, { alpha: chase, cm: 10 });
    G.pencil(ctx, E, -2, { alpha: chase });
    // overview: notation and the start point
    const s2 = 40 / z;
    G.label(ctx, '[AB', A[0] + 240, -2.1 * s2, { size: s2 * 1.5, p: seg(t, 33.1, 33.8) });
    G.ping(ctx, A[0], A[1], seg(t, 33.4, 34.3), { r: 18 / z, grow: 40 / z });
    G.label(ctx, 'başlangıç noktası', A[0] - 0.9 * s2, A[1] + 0.15 * s2, { size: s2, color: G.red(1), p: seg(t, 33.6, 34.4), align: 'right' });
    // try to measure it…
    const m = seg(t, 35.4, 35.9) * (1 - seg(t, 39.3, 39.9));
    const hi = t > 35.9 ? Math.floor(12 * seg(t, 35.9, 36.9)) : -1;
    G.ruler(ctx, A[0], 3, { alpha: m, cm: 12, highlight: hi });
    const q = seg(t, 37.0, 37.6);
    if (q > 0) {
      G.label(ctx, 'sonsuz → ölçülemez', tipX - 30 / z, -2.2 * s2, { size: s2 * 1.1, color: G.red(1 - seg(t, 39.4, 40)), p: q, align: 'right' });
      G.ping(ctx, tipX, 0, seg(t, 37.2, 38.2), { r: 20 / z, grow: 50 / z });
    }
  }

  LI.registerScene({ id: 3, start: 27, end: 40, name: 'Ray', nameTr: 'Işın',
    concept: '[AB: one endpoint, endless one way, not measurable', conceptTr: '[AB: bir ucu var, bir yönde sonsuz, ölçülemez', outcome: 'MAT.5.3.1 · MAT.5.3.2', render, endX, camera });
})(window.LI = window.LI || {});
