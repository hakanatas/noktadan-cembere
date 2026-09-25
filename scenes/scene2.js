/* SAHNE 2 — DOĞRU PARÇASI (11–27 s)     MAT.5.3.1 (b, c) · MAT.5.3.2 (b)
   Many curvy lines join A and B; the straight one needs a ruler.
   Notation [AB]; two endpoints; its length can be measured: 8 cm. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inOut, hump } = LI.E;
  const G = LI.Geo, S = LI.Stage, CM = LI.CM;
  const A = S.A, B = S.B;

  const WAVY = [
    [A, [-120, -150], [60, -40], [150, -170], B],
    [A, [-160, 90], [-60, 150], [60, 60], [150, 130], B],
    [A, [-150, -40], [-90, 40], [-20, -45], [60, 45], [130, -40], [190, 30], B],
  ];

  function camera(t, env) {
    return S.track(env, [[11, { x: 0, y: 10, zoom: 1.2 }], [13, { x: 0, y: 40, zoom: 1.3 }], [19, { x: 0, y: 60, zoom: 1.35 }], [27, { x: 20, y: 40, zoom: 1.25 }]], t);
  }

  /** where the ruler sits: first for drawing (zero left of A), then measuring (zero at A) */
  function rulerPose(t) {
    const inK = outCubic(seg(t, 12.5, 13.4));
    const shift = inOut(seg(t, 18.9, 19.7));
    const out = inOut(seg(t, 24.6, 25.6));
    return { x: A[0] - CM + shift * CM, y: A[1] + 3 + (1 - inK) * 420 + out * 480, alpha: inK * (1 - out) };
  }

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10);
    // curvy lines: also join A and B, but they are not straight
    const wav = 1 - seg(t, 14.2, 15.0);
    WAVY.forEach((pts, i) => {
      const t0 = 11.0 + i * 0.45;
      G.free(ctx, pts, { p: seg(t, t0, t0 + 0.7), alpha: 0.42 * wav, seed: 40 + i, color: LI.TOOL_RGB, w: 3.2 });
    });
    // ruler
    const rp = rulerPose(t);
    const hi = t > 19.9 ? Math.floor(8 * seg(t, 19.9, 21.5) + 1e-6) : -1;
    G.ruler(ctx, rp.x, rp.y, { alpha: rp.alpha, cm: 10, highlight: hi });
    // the segment, drawn along the ruler edge
    const dp = inOut(seg(t, 13.5, 14.7));
    G.pen(ctx, A, B, { p: dp, w: 5.5 });
    // endpoints
    G.point(ctx, A[0], A[1], { r, seed: 1 }); G.point(ctx, B[0], B[1], { r, seed: 2 });
    G.label(ctx, 'A', A[0] - 34, A[1] - 46, { size: 50 }); G.label(ctx, 'B', B[0] + 32, B[1] - 46, { size: 50 });
    G.ping(ctx, A[0], A[1], seg(t, 15.0, 15.8), { r: 16 / cam.zoom, grow: 30 / cam.zoom });
    G.ping(ctx, B[0], B[1], seg(t, 15.3, 16.1), { r: 16 / cam.zoom, grow: 30 / cam.zoom });
    G.ping(ctx, A[0], A[1], seg(t, 22.2, 23.0), { r: 16 / cam.zoom, grow: 30 / cam.zoom });
    G.ping(ctx, B[0], B[1], seg(t, 22.5, 23.3), { r: 16 / cam.zoom, grow: 30 / cam.zoom });
    // notation [AB]
    const nA = 1 - seg(t, 26.4, 27);
    G.label(ctx, '[AB]', 0, -78, { p: seg(t, 17.9, 18.7), size: 60, alpha: nA });
    // measured length
    if (t > 21.3) G.dimension(ctx, A, B, '|AB| = 8 cm', { off: 150, p: seg(t, 21.3, 22.2) * nA, size: 42 });
    // pencil: walks in, draws along the ruler edge, lifts off
    const tip = track([[12.9, [B[0] + 500, -420]], [13.45, [A[0], A[1] - 2]], [14.7, [B[0], B[1] - 2]], [15.3, [B[0] + 460, -440]]], t, inOut);
    const pa = seg(t, 12.9, 13.2) * (1 - seg(t, 15.0, 15.3));
    G.pencil(ctx, tip[0], tip[1], { alpha: pa });
  }

  LI.registerScene({ id: 2, start: 11, end: 27, name: 'Line segment', nameTr: 'Doğru parçası',
    concept: 'Ruler joins two points: [AB], two endpoints, measurable', conceptTr: 'Cetvelle iki nokta birleşir: [AB], iki uç, ölçülebilir', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
