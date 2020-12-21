'use strict';

const onml = require('onml');
const genSVG = require('./gen-svg.js');
const boxer = require('./boxer.js');

const {left, center, right, top, bottom, box} = boxer({padding: 0});

const boxes = () => left(
  box(480, 20),
  box(420, 30),
  top(
    box(80,  260),
    box(260, 260),
    box(80,  260),
    box(60,  260)
  ),
  top(
    left(
      box(80, 50),
      top(
        box(40, 170),
        box(40, 170)
      )
    ),
    box(260, 220),
    left(
      box(80, 50),
      box(140, 120),
      box(140, 50)
    )
  ),
  bottom(
    left(
      box(60, 40), // AMPERAGE
      box(60, 40)  // VOLTAGE
    ),
    box(5, 60),
    box(45, 80), // OIL P
    box(45, 80), // OIL C/F
    box(5, 60),
    box(45, 80), // EGT
    box(45, 80), // CHT
    box(45, 80), // ??
    box(45, 80), // temp
    box(5, 60),
    box(45, 80), // TR
    box(45, 80), // ??
    box(45, 80) // temp
  )
  // bottom(box(20, 40), box(20, 20), 'Bob who?', box(20, 30)),
  // // box(20, 250),
  // center(box(20,20), 'Hello', box(40,40), 'Alice Copper', box(20,20), box(20,20), box(20,20)),
  // right(box(32,32), 'John', box(8,64), 'Lennon', box(64,8)),
  // left('Paul', 'McCartney', box(40,200))
);

const container = (body) => genSVG(body[1].w, body[1].h, [body]);

const main = () => {
  const content = document.getElementById('content');
  const ml = container(boxes());
  ml[1].class = 'panel';
  console.log(JSON.stringify(ml, null, 2));
  const html = onml.stringify(ml);
  content.innerHTML = html;
};

window.onload = main;

/* eslint-env browser */
