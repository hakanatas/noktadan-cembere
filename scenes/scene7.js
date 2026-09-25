/* SAHNE 7 — HANGİ ARAÇ? (86–100 s)        MAT.5.3.1 (b) · MAT.5.3.2 (a, c)
   Reflection: which tool made which drawing? Ruler → segment, ray, line;
   set square → perpendicular; compass → circle. Then everything we learned
   becomes one picture: a sailboat under the sun, begun from a single point. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inCubic, inOut, hump, along } = LI.E;
  const G = LI.Geo, S = LI.Stage;

  function camera(t, env) {
    return LI.Camera.breathe(S.track(env, [[86, { x: -80, y: -10, zoom: 1.0 }], [91.5, { x: -80, y: -10, zoom: 1.04 }], [92.4, { x: 0, y: -30, zoom: 0.98 }], [100, { x: 0, y: -30, zoom: 1.04 }]], t, 0.64), t, 0.4);
  }

  // the final picture, stroke by stroke (each entry: points, start time, duration, kind)
  const SUN = [560, -250], SR = 80;
  const PIC = [];
  (function build() {
    let t = 92.4;
    const add = (pts, dur, kind = 'line', o = {}) => { PIC.push(Object.assign({ pts, t0: t, dur, kind }, o)); t += dur + 0.06; };
    add([[-1100, 210], [1100, 210]], 0.6, 'line', { arrows: 2 });                                        // sea: a line
    add([[-300, 110], [300, 110], [210, 210], [-210, 210], [-300, 110]], 0.8);                           // hull: segments
    add([[0, 110], [0, -330]], 0.45, 'line', { right: true });                                             // mast ⊥ deck
    add([[0, -300], [250, 70], [0, 70]], 0.6);                                                            // sail: a triangle
    add([[0, -330], [80, -300], [0, -272]], 0.3);                                                          // flag
    add(null, 0.8, 'circle');                                                                               // sun: a circle
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.2; add([[SUN[0] + Math.cos(a) * (SR + 18), SUN[1] + Math.sin(a) * (SR + 18)], [SUN[0] + Math.cos(a) * (SR + 88), SUN[1] + Math.sin(a) * (SR + 88)]], 0.09, 'ray'); } // sunbeams: rays
    add([[-560, -250], [-500, -205], [-440, -250]], 0.3, 'angle');                                        // a gull: an angle
    add([[-360, -150], [-320, -120], [-280, -150]], 0.25, 'angle');
  })();

  function strokeP(s, t) { return seg(t, s.t0, s.t0 + s.dur); }

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10);

    // ── part 1: tools and what they draw
    const pa = 1 - seg(t, 91.5, 92.2);
    if (pa > 0) {
      ctx.globalAlpha = pa;
      const bob = (t0) => -18 * hump(t, t0, t0 + 0.5);
      // cetvel
      G.ruler(ctx, -840, -300 + bob(87.0), { cm: 6, alpha: seg(t, 86.2, 86.6) });
      G.label(ctx, 'cetvel', -660, -360 + bob(87.0), { size: 40, p: seg(t, 86.4, 86.9) });
      // gönye
      G.setSquare(ctx, -200, -170 + bob(87.3), { l1: 260, l2: 190, alpha: seg(t, 86.4, 86.8) });
      G.label(ctx, 'gönye', -70, -390 + bob(87.3), { size: 40, p: seg(t, 86.6, 87.1) });
      // pergel
      G.compass(ctx, [470, -150 + bob(87.6)], 110, 0, { alpha: seg(t, 86.6, 87.0), leg: 250 });
      G.label(ctx, 'pergel', 525, -400 + bob(87.6), { size: 40, p: seg(t, 86.8, 87.3) });
      // what each one draws
      const k1 = seg(t, 88.0, 88.5), k2 = seg(t, 88.5, 89.0), k3 = seg(t, 89.0, 89.5);
      G.pen(ctx, [-800, 40], [-520, 40], { p: k1, w: 5 }); if (k1 > 0.9) { G.point(ctx, -800, 40, { r }); G.point(ctx, -520, 40, { r }); }
      G.pen(ctx, [-800, 130], [-500, 130], { p: k2, w: 5 }); if (k2 > 0.9) { G.point(ctx, -800, 130, { r }); G.arrow(ctx, [-500, 130], 0, { len: 24 }); }
      G.pen(ctx, [-820, 220], [-480, 220], { p: k3, w: 5 }); if (k3 > 0.9) { G.arrow(ctx, [-480, 220], 0, { len: 24 }); G.arrow(ctx, [-820, 220], Math.PI, { len: 24 }); }
      G.label(ctx, 'doğru parçası', -440, 40, { size: 30, color: G.red(1), p: seg(t, 88.3, 88.8), align: 'left' });
      G.label(ctx, 'ışın', -440, 130, { size: 30, color: G.red(1), p: seg(t, 88.8, 89.3), align: 'left' });
      G.label(ctx, 'doğru', -440, 220, { size: 30, color: G.red(1), p: seg(t, 89.3, 89.8), align: 'left' });
      const k4 = seg(t, 89.5, 90.1);
      G.pen(ctx, [-230, 220], [90, 220], { p: k4, w: 5 });
      G.pen(ctx, [-70, 40], [-70, 220], { p: seg(t, 89.9, 90.4), w: 5 });
      if (t > 90.4) { G.rightMark(ctx, [-70, 220], [1, 0], [0, -1], { p: seg(t, 90.4, 90.7) }); G.point(ctx, -70, 40, { r }); }
      G.label(ctx, 'dikme', 0, 90, { size: 30, color: G.red(1), p: seg(t, 90.4, 90.9), align: 'left' });
      G.circle(ctx, [520, 120], 100, { p: seg(t, 90.2, 90.9), w: 5 }); if (t > 90.2) G.point(ctx, 520, 120, { r });
      G.label(ctx, 'çember', 520, 270, { size: 30, color: G.red(1), p: seg(t, 90.8, 91.2) });
      ctx.globalAlpha = 1;
    }

    // ── part 2: one picture from everything
    let tip = null;
    for (const s of PIC) {
      const p = strokeP(s, t);
      if (p <= 0) continue;
      if (s.kind === 'circle') {
        G.circle(ctx, SUN, SR, { p, w: 5.5, a0: -Math.PI / 2 });
        if (p < 1) tip = [SUN[0] + Math.cos(-Math.PI / 2 + p * Math.PI * 2) * SR, SUN[1] + Math.sin(-Math.PI / 2 + p * Math.PI * 2) * SR];
        continue;
      }
      LI.Ink.path(ctx, s.pts, { w: 5.5, p, taper: [0.02, 0.02], wob: 0.06, minW: 0.8, seed: s.t0 * 10 });
      if (p < 1) tip = along(s.pts, p);
      const last = s.pts[s.pts.length - 1], prev = s.pts[s.pts.length - 2];
      const ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
      if (p >= 1 && s.kind === 'ray') G.arrow(ctx, last, ang, { len: 18, w: 4 });
      if (p >= 1 && s.arrows === 2) { G.arrow(ctx, [980, 210], 0, { len: 28 }); G.arrow(ctx, [-980, 210], Math.PI, { len: 28 }); }
      if (p >= 1 && s.right) G.rightMark(ctx, [0, 110], [1, 0], [0, -1], { s: 26 });
    }
    if (t > 92.3 && t < 97.4) {
      const tp = tip || [0, -330];
      G.pencil(ctx, tp[0], tp[1], { alpha: seg(t, 92.3, 92.5) * (1 - seg(t, 97.0, 97.4)) });
    }
    // it all began with a point
    if (t > 97.2) {
      G.point(ctx, 0, -330, { r: r * 1.2, seed: 9 });
      G.ping(ctx, 0, -330, seg(t, 97.3, 98.2), { r: 18, grow: 40 });
      G.label(ctx, 'bir nokta', 110, -372, { size: 40, color: G.red(1), p: seg(t, 97.4, 98.0), align: 'left' });
    }
  }

  LI.registerScene({ id: 7, start: 86, end: 100, name: 'Which tool?', nameTr: 'Hangi araç?',
    concept: 'Reflect: ruler, set square, compass → one drawing', conceptTr: 'Yansıtma: cetvel, gönye, pergel → tek bir resim', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
