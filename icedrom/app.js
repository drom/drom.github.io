(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function construct (data, groups) {
    var res = {};
    var tmp = 0;
    groups.some(function (g) {
        return Object.keys(g).some(function (key) {
            if ((data & key) == key) {
                if ((tmp | key) != tmp) {
                    res[key] = g[key];
                    tmp = tmp | key;
                    if (tmp == data) {
                        return true;
                    }
                }
            }
        });
    });
    return res;
}

function simplify (data, terms) {
    var masks = Object.keys(terms);

    while (masks.some(function (mask, idx) {
        var sum = 0;
        masks.forEach(function (m1, i) {
            if (i !== idx) {
                sum = sum | m1;
            }
        });
        if (sum == data) {
            // console.log('removed: ' + mask);
            masks.splice(idx, 1);
            delete terms[mask];
            return true;
        }
    })) {}
    return terms;
}

function lut4 () {

    var g0 = {
        0xffff: '1'
    };

    var singles = [
        [0xaaaa, 'i0'],
        [0xcccc, 'i1'],
        [0xf0f0, 'i2'],
        [0xff00, 'i3']
        // [0xff00, 'C'],
        // [0xf0f0, 'D'],
        // [0xcccc, 'A'],
        // [0xaaaa, 'B']
    ];

    var arr = [];
    singles.forEach(function (e) {
        arr.push(e);
        arr.push([~e[0] & 0xffff, ['~', e[1]]]);
    });

    var g1 = {};
    arr.forEach(function (a) {
        var idx = a[0];
        if (idx && !g1[idx]) {
            g1[idx] = a[1];
        }
    });

    var g2 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            var idx = a[0] & b[0];
            if (idx && !g1[idx] && !g2[idx]) {
                g2[idx] = ['&', a[1], b[1]];
            }
        });
    });

    var g3 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            arr.forEach(function (c) {
                var idx = a[0] & b[0] & c[0];
                if (idx && !g1[idx] && !g2[idx] && !g3[idx]) {
                    g3[idx] = ['&', a[1], b[1], c[1]];
                }
            });
        });
    });

    var g4 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            arr.forEach(function (c) {
                arr.forEach(function (d) {
                    var idx = a[0] & b[0] & c[0] & d[0];
                    if (idx && !g1[idx] && !g2[idx] && !g3[idx] && !g4[idx]) {
                        g4[idx] = ['&', a[1], b[1], c[1], d[1]];
                    }
                });
            });
        });
    });
    var groups = [g0, g1, g2, g3, g4];

    // groups.forEach(function (g) {
    //     console.log(g);
    // });

    return function (data) {
        var res = construct(data, groups);
        res = simplify(data, res);
        var res1 = construct(~data & 0xffff, groups);
        res1 = simplify(~data & 0xffff, res1);
        return [res, res1];
    };
}

module.exports = lut4;

},{}],2:[function(require,module,exports){
'use strict';

var cache = {};

var xor = 'm -21,-10 c1,3 2,6 2,10 m0,0 c0,4 -1,7 -2,10 m3,-20 4,0 c6,0 12,5 14,10 -2,5 -8,10 -14,10 l-4,0 c1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z';
// var circle = ' M 4,0 C 4,1.1  3.1,2      2,2  0.9,2   0,1.1    0,0 c 0,-1.1 0.9,-2 2,-2 1.1,0 2,0.9 2,2 z';
var circle = 'm 4 0 c 0 1.1,-0.9 2,-2 2 s -2 -0.9,-2 -2 s 0.9 -2,2 -2 s 2 0.9,2 2 z';
var and    = 'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z';
var buf    = 'l-12,8 v-16 z';
var or     = 'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z';

var inputs = {
    i0t1: 'M0 4 h12 v4 h4',

    i1t1: 'M0 12 h4 v-4 h12',
    i1t2: 'M0 12 h16',

    i2t1: 'M0 20 h4 v-12 h12',
    i2t3: 'M0 20 h8 v-4 h8',

    i3t3: 'M0 28 h12 v-12 h4',
    i3t4: 'M0 28 h12 v-8 h4',
};

function group (body) {
    var res = ['g', { transform: 'translate(0.5,0.5)' }];
    body.forEach(function (e) {
        res.push(e);
    });
    return res;
}

function lut4cache () {

    cache[0xffff] = group([
        ['text', { x: 24, y: 20, 'text-anchor': 'middle' }, '1']
    ]);

    cache[0x0ff0] = group([
        ['path', {
            d: inputs.i2t1 + inputs.i3t3,
            fill: 'none', stroke: '#000'
        }],
        ['path', {
            d: 'M32 16' + xor,
            fill: '#ffb', stroke: '#000'
        }]
    ]);

    cache[0x3c3c] = group([
        ['path', {
            d: inputs.i1t1 + inputs.i2t3,
            fill: 'none', stroke: '#000'
        }],
        ['path', {
            d: 'M32 16' + xor,
            fill: '#ffb', stroke: '#000'
        }]
    ]);

    cache[0x5555] = group([
        ['path', {
            d: 'M0,4 h12 v8 h12',
            fill: 'none', stroke: '#000'
        }],
        ['path', {
            d: 'M32 16' + buf + circle,
            fill: '#ffb', stroke: '#000'
        }]
    ]);

    cache[0xaaaa] = group([
        ['path', {
            d: 'M0,4 h12 v8 h12',
            fill: 'none', stroke: '#000'
        }],
        ['path', {
            d: 'M32 16' + buf,
            fill: '#ffb', stroke: '#000'
        }]
    ]);

    var arr16 = Array.apply(null, Array(16));

    arr16.forEach(function (e, i) {
        var tt = 1 << i;
        var res = ['g', {},
            ['path', { d: 'M32 16' + and, fill: '#ffb', stroke: '#000' },
                ['title', {}, tt]
            ]
        ];
        [1, 2, 4, 8].forEach(function (mask, maski) {
            if (!(i & mask)) {
                res.push(['path', {
                    d: 'M12 ' + (4 + 8 * maski) + circle,
                    fill: '#ffb', stroke: '#000'
                }]);
            }
        });
        cache[tt] = res;
    });

    arr16.forEach(function (e, i) {
        var tt = 0xffff ^ (1 << i);
        var res = ['g', {},
            ['path', { d: 'M32 16' + or, fill: '#ffb', stroke: '#000' },
                ['title', {}, tt]
            ]
        ];
        [1, 2, 4, 8].forEach(function (mask, maski) {
            if (!(i & mask)) {
                res.push(['path', {
                    d: 'M12 ' + (4 + 8 * maski) + circle,
                    fill: '#ffb', stroke: '#000'
                }]);
            }
        });
        cache[tt] = res;
    });

    return cache;
}

module.exports = lut4cache;

},{}],3:[function(require,module,exports){
'use strict';

function isObject (o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}

function indent (txt) {
    var arr, res = [];

    if (typeof txt !== 'string') {
        return txt;
    }

    arr = txt.split('\n');

    if (arr.length === 1) {
        return '  ' + txt;
    }

    arr.forEach(function (e) {
        if (e.trim() === '') {
            res.push(e);
            return;
        }
        res.push('  ' + e);
    });

    return res.join('\n');
}

function clean (txt) {
    var arr = txt.split('\n');
    var res = [];
    arr.forEach(function (e) {
        if (e.trim() === '') {
            return;
        }
        res.push(e);
    });
    return res.join('\n');
}

function stringify (a) {
    var res, body, isEmpty, isFlat;

    body = '';
    isFlat = true;
    isEmpty = a.some(function (e, i, arr) {
        if (i === 0) {
            res = '<' + e;
            if (arr.length === 1) {
                return true;
            }
            return;
        }

        if (i === 1) {
            if (isObject(e)) {
                Object.keys(e).forEach(function (key) {
                    res += ' ' + key + '="' + e[key] + '"';
                });
                if (arr.length === 2) {
                    return true;
                }
                res += '>';
                return;
            } else {
                res += '>';
            }
        }

        switch (typeof e) {
        case 'string':
        case 'number':
        case 'boolean':
            body += e + '\n';
            return;
        }

        isFlat = false;
        body += stringify(e);
    });

    if (isEmpty) {
        return res + '/>\n'; // short form
    } else {
        if (isFlat) {
            return res + clean(body) + '</' + a[0] + '>\n';
        } else {
            return res + '\n' + indent(body) + '</' + a[0] + '>\n';
        }
    }
}

module.exports = stringify;

},{}],4:[function(require,module,exports){
'use strict';

function arizona () {

    var onLoadCall;

    function onLoad (f) {
        var myReader = new FileReader();
        'onabort onerror onload onloadstart onloadend onloadprogress'
        .split(' ')
        .forEach(function (e) {
            myReader[e] = function (p) {
                console.log(p);
                if (p.type === 'loadend') {
                    onLoadCall(p.currentTarget.result, f.name);
                }
            };
        });
        console.log(myReader.readAsText(f));
    }

    var lis = {
        dragover: function (event) { event.preventDefault(); },
        dragenter: null,
        dragleave: null,
        drop: function(event) {
            var i;
            event.preventDefault();
            var dt = event.dataTransfer;
            if (dt.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (i = 0; i < dt.items.length; i++) {
                    if (dt.items[i].kind === 'file') {
                        var f = dt.items[i].getAsFile();
                        console.log('[1] file[' + i + '].name = ' + f.name);
                        onLoad(f);
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (i = 0; i < dt.files.length; i++) {
                    console.log('[2] file[' + i + '].name=' + dt.files[i].name);
                    console.log(dt.files[i]);
                    onLoad(dt.files[i]);
                }
            }
        }
    };

    var self = {
        listen: function (el) {

            var inp = document.createElement('input');
            inp.setAttribute('type', 'file');
            el.insertBefore(inp, el.childNodes[0]);
            // el.appendChild(inp);
            inp.addEventListener('change', function () {
                console.log(onLoad(inp.files[0]));
            }, false);

            Object.keys(lis).forEach(function (key) {
                var cb;
                if (typeof lis[key] === 'function') {
                    cb = function (event) {
                        lis[key](event);
                        console.log(key);
                    };
                } else {
                    cb = function (/*event*/) {
                        console.log(key);
                    };
                }
                // document.addEventListener(key, cb, false);
                el.addEventListener(key, cb, false);
            });

            return self;
        },
        onfile: function (cb) {
            onLoadCall = cb;
            return self;
        }
    };
    return self;
}

module.exports = arizona;
/* eslint no-console:0 */

},{}],5:[function(require,module,exports){
'use strict';

function dropzone (label) {
    return ['g', { w: 256, h: 64, draggable: true },
        ['rect', { x: 0, y: 0, width: 256, height: 64, fill: '#333' }],
        ['text', { x: 128, y: 32, 'text-anchor': 'middle' },
            ['tspan', { fill: '#fff', 'font-family': 'Helvetica' }, label]
        ]
    ];
}

module.exports = dropzone;

},{}],6:[function(require,module,exports){
'use strict';

var lut4 = require('../lib/lut')(),
    lut4cache = require('../lib/lut4cache')();

function toString2_16 (data) {
    return (
        '0'.repeat(16) + data.toString(2)
    ).slice(-16);
}

function lutSimplify (data, connections) {
    var mask0 = [
        0x5555,
        0x3333,
        0x0f0f,
        0x00ff
    ];
    var mask1 = [
        0xaaaa,
        0xcccc,
        0xf0f0,
        0xff00
    ];
    var shift = [
        1,
        2,
        4,
        8
    ];

    'I0 I1 I2 I3'.split(' ').forEach(function (inp, idx) {
        if (connections[inp][0] === '0') {
            // console.log(toString2_16(data), idx);
            data = (data & mask0[idx]) |
                ((data & mask0[idx]) << shift[idx]);
            // console.log(toString2_16(data));
        }
    });
    return data;
}

function runningSum (sum, e, idx, arr) {
    sum += e;
    arr[idx] = sum;
    return sum;
}

function fpga (params) {
    var cells = params.body.modules.top.cells;

    var res = ['g', {}];

    var colV = Array.apply(null, Array(34)).map(function (e) { return 1; });
    var rowV = Array.apply(null, Array(34)).map(function (e) { return 1; });

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        // var lc = parseInt(loc2[1]);
        colV[col] = 8;
        rowV[row] = 16;
    });

    colV.reduce(runningSum, 0);
    rowV.reduce(runningSum, 0);

    colV.forEach(function (col, x) {
        rowV.forEach(function (row, y) {
            res.push(['rect', {
                x: 16 * col,
                y: 16 * row,
                width: 16,
                height: 16,
                stroke: 'none',
                opacity: 0.2,
                fill: ((x + y) & 1) ? '#fff' : '#000'
            }]);
        });
    });

    var drivers = {};

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);

        'O-48-16 COUT-4-32 D_IN_0-0-20 D_IN_1-0-28'
        .split(' ')
        .map(function (e) {
            var arr = e.split('-');
            return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
        })
        .forEach(function (pin, pindex) {
            var driver;
            var x, y;
            if (
                cell.connections &&
                cell.connections[pin.name] &&
                cell.connections[pin.name].length
            ) {
                x = 16 * (colV[col] - 8) + pin.x;
                y = 16 * (rowV[row] - 16) + 32 * lc + pin.y;
                driver = cell.connections[pin.name][0];
                drivers[driver] = { x: x, y: y };
            }
        });
    });

    console.log(drivers);

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);

        'I0-0-4 I1-0-12 I2-0-20 I3-0-28 D_OUT_0-0-4 D_OUT_1-0-12'
        .split(' ')
        .map(function (e) {
            var arr = e.split('-');
            return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
        })
        .forEach(function (pin) {
            var x, y;
            if (
                cell.connections &&
                cell.connections[pin.name] &&
                cell.connections[pin.name].length &&
                (typeof cell.connections[pin.name][0] === 'number')
            ) {
                var wireNumber = cell.connections[pin.name][0];
                x = 16 * (colV[col] - 8) + pin.x;
                y = (16 * (rowV[row] - 16) + (lc * 32)) + pin.y;
                var groupO = ['path', {
                    d: 'M' + drivers[wireNumber].x +
                        ' ' + drivers[wireNumber].y +
                        ' L ' + x + ' ' + y,
                    fill: 'none', stroke: '#000'
                }];
                res.push(groupO);
            }
        });
    });


    var LUT_INIT;

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);
        var group = ['g', {
            transform: 'translate(' +
                (16 * (colV[col] - 8)) + ',' +
                (16 * (rowV[row] - 16) + (lc * 32)) + ')'
        }];
        res.push(group);

        if (cell.type === 'SB_GB') {
            group.push(['rect', {
                x: 2, y: 2, width: 44, height: 28,
                stroke: 'none', fill: '#f51'
            }, ['title', {}, cell.attributes.loc]
            ]);
        }

        if (cell.type === 'SB_IO') {
            group.push(['rect', {
                x: 2, y: 2, width: 44, height: 28,
                stroke: 'none', fill: '#1e5'
            }, ['title', {}, cell.attributes.loc]
            ]);
        }

        if (cell.type === 'ICESTORM_LC') {
            'I0 I1 I2 I3'
            .split(' ')
            .forEach(function (pin, pindx) {
                if (typeof cell.connections[pin][0] === 'number') {
                    group.push(['path', {
                        d: 'M0.5 ' + (4.5 + 8 * pindx) + ' h8',
                        fill: 'none', stroke: '#000'
                    }]);
                }
            });

            group.push(['path', {
                 d: 'M28.5 16.5 h20',
                 fill: 'none', stroke: '#000'
            }]);

            if (cell.parameters.CARRY_ENABLE) {
                group.push(['rect', {
                    x: -4, y: 24,
                    width: 8, height: 8,
                    stroke: 'none', fill: '#333'
                }]);
            }

            LUT_INIT = cell.parameters.LUT_INIT;
            if (LUT_INIT) {
                LUT_INIT = lutSimplify(LUT_INIT, cell.connections);

                if (lut4cache[LUT_INIT] === undefined) {
                    console.log(toString2_16(LUT_INIT), LUT_INIT, lut4(LUT_INIT));
                    lut4cache[LUT_INIT] = true;
                }
                if (lut4cache[LUT_INIT] === true) {
                    group.push(['rect', {
                        x: 2, y: 2, width: 28, height: 28,
                        stroke: 'none', fill: '#f51'
                    }, ['title', {}, cell.attributes.loc + ' ' + toString2_16(LUT_INIT)]]);
                } else {
                    group.push(lut4cache[LUT_INIT]);
                }

            }

            if (cell.parameters.DFF_ENABLE) {
                group.push(['rect', {
                    x: 34, y: 2, width: 12, height: 28,
                    stroke: 'none', fill: '#15f'
                }]);
            }

        }

    });

    res[1] = { w: 16 * colV[colV.length - 1], h: 16 * rowV[rowV.length - 1] };

    return res;
}

module.exports = fpga;

},{"../lib/lut":1,"../lib/lut4cache":2}],7:[function(require,module,exports){
'use strict';

var stringify = require('onml/lib/stringify'),
    arizona = require('./arizona'),
    dropzone = require('./dropzone'),
    fpga = require('./fpga'),
    svg = require('./svg');

var icedrom = document.getElementById('icedrom');

icedrom.innerHTML = stringify(svg(dropzone('Drop post pack blif as JSON here')));

arizona()
    .listen(icedrom)
    .onfile(function (data, name) {
        var mySVG = svg(
            fpga({
                fname: name,
                body: JSON.parse(data)
            })
        );
        icedrom.innerHTML = stringify(mySVG);
    });

},{"./arizona":4,"./dropzone":5,"./fpga":6,"./svg":8,"onml/lib/stringify":3}],8:[function(require,module,exports){
'use strict';

function svg (body) {
    var opt = body[1];
    return ['svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: opt.w || 512,
        height: opt.h || 512,
        viewBox: [0, 0, opt.w || 512, opt.h || 512].join(' ')
    }, body ];
}

module.exports = svg;

},{}]},{},[7]);
