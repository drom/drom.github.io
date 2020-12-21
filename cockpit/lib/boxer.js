'use strict';

const {B612} = require('./B612.js');

const text = src => {
  const f = B612()(14);
  const w = Math.ceil(f.getWidth(src) + 2);
  const h = Math.ceil(f.getHeight());
  return ['g', {w: w, h: h}, ['text', {x: w >> 1, y: h >> 1}, src]];
};

const boxer = config => {
  config = config || {};
  config.padding = (config.padding === undefined) ? 2 : config.padding;

  let texter = e => (typeof e === 'string') ? text(e) : e;

  const style = () => {
    return 'fill:#' + (0xfff * Math.random() |0).toString(16) + '5';
  };

  let box = function (w, h) {
    w = w|0;
    h = h|0;
    return ['g', {w: w, h: h}, ['rect', {width: w, height: h, style: style()}]];
  };

  let left = function () {
    let h = config.padding;
    let w = 0;
    let res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', {transform: `translate(${config.padding},${h})`}, e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h).concat(res);
  };

  let right = function () {
    let h = config.padding;
    let w = 0;
    let res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', {transform: `translate(${config.padding + w - e[1].w},${h})`}, e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h).concat(res);
  };

  let center = function () {
    let h = config.padding;
    let w = 0;
    let res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', {transform: `translate(${config.padding + (w - e[1].w) / 2},${h})`}, e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h).concat(res);
  };

  let top = function () {
    let h = 0;
    let w = config.padding;
    let res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { h = Math.max(h, e[1].h); return e; })
      .map(e => {
        res.push(['g', {transform: `translate(${w},${config.padding})`}, e]);
        w += (e[1].w + config.padding);
      });
    h += config.padding * 2;
    return box(w, h).concat(res);
  };

  let bottom = function () {
    let h = 0;
    let w = config.padding;
    let res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { h = Math.max(h, e[1].h); return e; })
      .map(e => {
        res.push(['g', {transform: `translate(${w},${config.padding + h - e[1].h})`}, e]);
        w += e[1].w + config.padding;
      });
    h += config.padding * 2;
    return box(w, h).concat(res);
  };

  return {
    left, center, right,
    top, bottom,
    box
  };
};

module.exports = boxer;
