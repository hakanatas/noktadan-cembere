/* ─────────────────────────────────────────────────────────────
   Master timeline.
   renderFrame(t) is a PURE function of t (plus format/caption settings):
   it never reads the previous frame, so any timestamp can be rendered
   in any order — this is what makes scrubbing and export deterministic.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  LI.FPS = 30;
  LI.DURATION = 100;
  LI.scenes = [];
  // fountain-pen blue on squared notebook paper; red pencil for names, measures, highlights
  LI.INK = '#1D3F8F';
  LI.INK_RGB = '29,63,143';
  LI.PAPER = '#F6F4EC';
  LI.PAPER_RGB = '246,244,236';
  LI.RED = '#D6452F';
  LI.RED_RGB = '214,69,47';
  LI.TOOL_RGB = '74,82,99';     // graphite line-art for the drawing tools
  LI.GRID_RGB = '120,160,205';  // printed notebook grid

  LI.registerScene = function (def) {
    LI.scenes.push(def);
    LI.scenes.sort((a, b) => a.start - b.start);
  };
  LI.sceneAt = function (t) {
    const S = LI.scenes;
    for (let i = S.length - 1; i >= 0; i--) if (t >= S[i].start) return S[i];
    return S[0];
  };

  const env = (LI.env = { W: 1920, H: 1080, V: false, format: 'horizontal', captions: 'bi', ctx: null, canvas: null, t: 0 });

  LI.init = function (canvas, opts = {}) {
    env.canvas = canvas;
    env.ctx = canvas.getContext('2d', { alpha: false });
    LI.setFormat(opts.format || env.format);
    if (opts.captions) env.captions = opts.captions;
  };
  LI.setFormat = function (fmt) {
    env.format = fmt === 'vertical' ? 'vertical' : 'horizontal';
    env.V = env.format === 'vertical';
    env.W = env.V ? 1080 : 1920;
    env.H = env.V ? 1920 : 1080;
    if (env.canvas) { env.canvas.width = env.W; env.canvas.height = env.H; }
  };
  LI.setCaptions = function (mode) { env.captions = mode; };

  LI.renderFrame = function (t) {
    t = LI.E.clamp(t, 0, LI.DURATION - 1e-6);
    const ctx = env.ctx;
    env.t = t;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    LI.Paper.draw(ctx, env);
    const sc = LI.sceneAt(t);
    ctx.save();
    try { sc.render(ctx, t - sc.start, env, t); }
    catch (e) { console.error('Scene', sc.id, 'failed at', t.toFixed(2), e); }
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    LI.Paper.overlay(ctx, env); // grain + vignette on top so ink sits IN the paper
    if (LI.Captions && env.captions !== 'off') LI.Captions.draw(ctx, env, t);
    // opening & closing fades to paper
    const f = Math.max(1 - LI.E.seg(t, 0, 0.35), LI.E.seg(t, LI.DURATION - 1.4, LI.DURATION - 0.2));
    if (f > 0) { ctx.globalAlpha = f; ctx.fillStyle = LI.PAPER; ctx.fillRect(0, 0, env.W, env.H); ctx.globalAlpha = 1; }
    return sc;
  };

  LI.frameCount = () => Math.round(LI.DURATION * LI.FPS);
})(window.LI = window.LI || {});
