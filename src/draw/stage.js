/* Shared helpers for the scenes: camera fitting for 16:9 / 9:16,
   screen-constant points (a point has no size), and common positions. */
(function (LI) {
  'use strict';
  LI.Stage = {
    /** the vertical frame is 1080 wide: widen the view instead of cropping */
    cam(env, x, y, z, extra = {}) { return Object.assign({ x, y: env.V ? y + (extra.vy ?? 40) : y, zoom: env.V ? z * (extra.vf ?? 0.74) : z, rot: 0, tilt: 1 }, extra.o || {}); },
    /** point radius that stays ~9 px on screen at any zoom */
    pr(cam, px = 9) { return px / cam.zoom; },
    A: [-240, 0], B: [240, 0],
  };
  /** time-keyed camera with fitting */
  LI.Stage.track = function (env, keys, t, vf) {
    return LI.Camera.track(keys.map(([tt, c, e]) => [tt, LI.Stage.cam(env, c.x, c.y, c.zoom, { vf, o: { rot: c.rot || 0 } }), e]), t);
  };
  /** position along the pencil tip path: keys [[t,[x,y]],...] */
  LI.Stage.path = (keys, t) => LI.E.track(keys, t);
  /** standard render prologue: grid + camera */
  LI.Stage.begin = function (ctx, env, cam, t) {
    LI.Grid.draw(ctx, env, cam);
    LI.Camera.apply(ctx, env, cam);
  };
})(window.LI = window.LI || {});
