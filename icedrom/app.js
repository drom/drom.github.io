(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var tspan = require('tspan');

function dropzone (label) {
    var res = ['g', { w: 640, h: 128, draggable: true },
        ['rect', {
            x: 0, y: 0,
            width: 640, height: 128,
            stroke: '#000',
            fill: 'none',
            'stroke-width': '1px'
        }]
    ];
    label.forEach(function (t, y) {
        var ts = tspan.parse(t);
        res.push(
            ['text', { x: 320, y: 20 * y, 'text-anchor': 'middle'}]
            .concat(ts)
        );
    });
    return res;

}

module.exports = dropzone;

},{"tspan":18}],3:[function(require,module,exports){
'use strict';

var stringify = require('onml/lib/stringify'),
    arizona = require('./arizona'),
    dropzone = require('./dropzone'),
    fpga = require('../lib'),
    svg = require('./svg');

var icedrom = document.getElementById('icedrom');

icedrom.innerHTML = stringify(svg(dropzone([
    '',
    '<tt><b>yosys</b> -q -p "synth_ice40 -blif $PRJ.blif" $PRJ.v</tt>',
    '<tt><b>arachne-pnr</b> $PRJ.blif -d 8k -P tq144:4k --post-place-blif $PRJ.post.blif</tt>',
    '<tt><b>yosys</b> -q -o $PRJ.post.json $PRJ.post.blif</tt>',
    '',
    '<i>Drop <b>$PRJ.post.json</b> here</i>'
])));

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

},{"../lib":10,"./arizona":1,"./dropzone":2,"./svg":4,"onml/lib/stringify":17}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

module.exports = construct;

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
    origin: 'M32.5,16.5',

    mux01:  'h-4 z m-4,0 v-8 z m0,-8 h-6 z m-6,4 l-6,4 v-16 l6,4 z m10,8',
    mux02:  'h-4 z m-4,0 v-4 z m0,-4 h-6 z m-6,8 l-6,4 v-24 l6,4 z m10,-4',

    and10: 'm-16,-10 h5 c6,0 11,4 11,10 0,6 -5,10 -11,10 h-5 z',
    and8:  'm-12,-8  h4 c4,0 8,4 8,8 0,4 -4,8 -8,8 h-5 z',
    and6:  'q0 6,-8 6 v-12 q8 0,8 6 z',

    or10:  'm-18,-10' +
        'h4 c6,0 12,5 14,10 -2,5 -8,10 -14,10 h-4' +
        'c2.5,-5 2.5,-15 0,-20 z',

    or6: 'q-2 6,-8 6 q2 -6,0 -12 q6 0,8 6 z ',

    xor10: 'm-21,-10 c1,3 2,6 2,10 0,4 -1,7 -2,10' +
        'm3,-20' +
        'h4 c6,0 12,5 14,10 -2,5 -8,10 -14,10 h-4' +
        'c1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z',

    xor6: 'q-2 6,-6 6 q2 -6,0 -12 q4 0,6 6 z m-9 -6 q2 6,0 12 z m9 6',

    circle: 'm4,0 c0 1.1,-0.9 2,-2 2 s -2 -0.9,-2 -2 s 0.9 -2,2 -2 s 2 0.9,2 2 z',
    buf: 'l-12,8 v-16 z'
};

},{}],7:[function(require,module,exports){
'use strict';

function expr (desc, first, last) {
    var keys = Object.keys(desc);
    var res = keys.map(function (key) {
        return '(' +
        desc[key].map(function (sig) {
            if (typeof sig === 'string') {
                return sig;
            } else {
                return sig.join('');
            }
        }).join(first) +
        ')';
    });
    return res.join(last);
}

module.exports = expr;

},{}],8:[function(require,module,exports){

'use strict';
var d = require('./d'),
    expr = require('./expr'),
    single = require('./single');

var pinInvert = {
    i0: ' M8.5 4.5h4' + d.circle,
    i1: ' M8.5 12.5h4' + d.circle,
    i2: ' M8.5 20.5h4' + d.circle,
    i3: ' M8.5 28.5h4' + d.circle
};

var pin = {
    i0: ' M8.5 4.5h8v2',
    i1: ' M8.5 12.5h8',
    i2: ' M8.5 20.5h8',
    i3: ' M8.5 28.5h8v-2'
};

function inverters (term) {
    var res = '';
    if (typeof term === 'object') {
        term.forEach(function (inp) {
            if (typeof inp === 'string') {
                if (pin[inp]) {
                    res += pin[inp];
                }
            } else {
                if (pinInvert[inp[1]]) {
                    res += pinInvert[inp[1]];
                }
            }
        });
    }
    return res;
}

function and (desc) {
    var terms = Object.keys(desc);
    if (terms.length === 1) {
        return ['path', {
            d: 'M32.5 16.5' + d.and10 + inverters(desc[terms[0]]),
            class: 'gate'
        },
            ['title', {}, expr(desc, ' &amp; ', ' | ')]
        ];
    }
}

function or (desc) {
    var terms = Object.keys(desc);
    if (terms.length === 1) {
        return ['path', {
            d: 'M32.5 16.5' + d.or10 + inverters(desc[terms[0]]),
            class: 'gate'
        },
            ['title', {}, expr(desc, ' | ', ' &amp; ')]
        ];
    }
}

function xorer (desc) {
    // console.log(desc);
    var dd = 'M32.5 16.5' + d.xor10;
    desc.forEach(function (e, i) {
        if (e === 1) {
            dd += pin['i' + i];
        } else
        if (e === 2) {
            dd += pinInvert['i' + i];
        }
    });
    return ['path', { d: dd, class: 'gate' },
        ['title', {}, desc.join(',')]
    ];
}

function blackbox (sumOfProducts, productOfSums) {
    return ['rect', {
        x: 8.5, y: 2.5, width: 20, height: 28,
        class: 'bbox'
    }, ['title', {},
        expr(sumOfProducts, ' &amp; ', ' | ') +
        ' \n ' +
        expr(productOfSums, ' | ', ' &amp; ')
        ]
    ];
}

function gates () {
    return {
        and: and,
        or: or,
        xorer: xorer,
        single: single,
        blackbox: blackbox
    };
}

module.exports = gates;

},{"./d":6,"./expr":7,"./single":15}],9:[function(require,module,exports){
'use strict';

var lut4 = require('../lib/lut')();
var lut4cache = require('./lut4cache')();
var toString2_16 = require('./to-string2_16');
var lut4count = {};
var blackboxes = {};

function lutSimplify (data, connections) {
    var mask0 = [
        0x5555,
        0x3333,
        0x0f0f,
        0x00ff
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
    var modules = params.body.modules;
    var moduleNames = Object.keys(modules);
    var cells = modules[moduleNames[0]].cells;

    var res = ['g', {},
        ['style', { type: 'text/css' },
            '<![CDATA[' +
            ' .gate { fill: #ffb; stroke: #000; stroke-linecap: round }' +
            ' .gate:hover { stroke: #00f; stroke-width: 3px }' +
            ' .bbox { fill: #bbb; stroke: #000 }' +
            ' .bbox:hover { stroke: #00f; stroke-width: 3px }' +
            ' text { font-family: "monospace" }' +
            ']]>'
        ]
    ];

    var colV = Array.apply(null, Array(34)).map(function () { return 1; });
    var rowV = Array.apply(null, Array(34)).map(function () { return 1; });

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        // var lc = parseInt(loc2[1]);
        colV[col] = 4;
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
            }, ['title', {}, ((x + 1) + ',' + (y + 1))]]);
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
        var connections;
        var connectionNames;

        if (cell.connections) {
            connections = cell.connections;
            connectionNames = Object.keys(connections);
            '^O-48-16 ^COUT-4-32 ^D_IN_0-48-16 ^D_IN_1-48-24 ^RDATA-48-16 ^GLOBAL_BUFFER_OUTPUT-48-16'
            .split(' ')
            .map(function (e) {
                var arr = e.split('-');
                return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
            })
            .forEach(function (pin) {
                var driver;
                var x, y;
                connectionNames.forEach(function (name) {
                    if (
                        name.match(pin.name) &&
                        connections[name].length
                    ) {
                        x = 16 * (colV[col] - 4) + pin.x;
                        y = 16 * (rowV[row] - 16) + 32 * lc + pin.y;
                        driver = connections[name][0];
                        drivers[driver] = { x: x, y: y };
                    }
                });
            });
        }
    });

    // console.log(drivers);

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);
        var connections;
        var connectionNames;

        var wireGroup = ['g', {
            transform: 'translate(0.5,0.5)',
            'stroke-linecap': 'round',
            fill: 'none', stroke: '#777'
        }];

        if (cell.connections) {
            connections = cell.connections;
            connectionNames = Object.keys(connections);
            '^I0-0-4 ^I1-0-12 ^I2-0-20 ^I3-0-28 ^D_OUT_0-0-16 ^D_OUT_1-0-24 ^WDATA-0-16 ^WADDR-0-64 ^RADDR-0-128 ^WE-0-192 ^RE-0-208 ^WCLKE-0-224 ^RCLKE-0-240 ^USER_SIGNAL_TO_GLOBAL_BUFFER-0-16'
            .split(' ')
            .map(function (e) {
                var arr = e.split('-');
                return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
            })
            .forEach(function (pin) {
                var x, y;
                connectionNames.forEach(function (name) {
                    if (
                        name.match(pin.name) &&
                        connections[name].length &&
                        (typeof connections[name][0] === 'number')
                    ) {
                        var wireNumber = connections[name][0];
                        x = 16 * (colV[col] - 4) + pin.x;
                        y = (16 * (rowV[row] - 16) + (lc * 32)) + pin.y;
                        var groupO = ['path', {
                            d: 'M' + drivers[wireNumber].x +
                                ' ' + drivers[wireNumber].y +
                                ' L ' + x + ' ' + y
                        }];
                        wireGroup.push(groupO);
                    }
                });
            });

            res.push(wireGroup);
        }
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
                (16 * (colV[col] - 4)) + ',' +
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
            group.push(['g', {},
                ['rect', {
                    x: 2, y: 2, width: 44, height: 28,
                    stroke: 'none', fill: '#1e5'
                },
                    ['title', {}, cell.attributes.loc]
                ],
                ['text', { x: 24, y: 20, 'text-anchor': 'middle'}, cell.connections.PACKAGE_PIN[0]]
            ]);
        }

        if (cell.type === 'SB_RAM40_4K') {
            group.push(['rect', {
                x: 2, y: 2, width: 44, height: 252,
                stroke: 'none', fill: '#d3d'
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
                console.log(LUT_INIT);
                if (lut4cache[LUT_INIT] === undefined) {
                    lut4cache[LUT_INIT] = lut4(LUT_INIT);
                    if (lut4cache[LUT_INIT][0] === 'rect') {
                        blackboxes[LUT_INIT] = true;
                    }
                }
                if (lut4count[LUT_INIT] === undefined) {
                    lut4count[LUT_INIT] = 1;
                } else {
                    lut4count[LUT_INIT] += 1;
                }
                group.push(lut4cache[LUT_INIT]);
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

    Object.keys(blackboxes).forEach(function (key) {
        if (lut4count[key] > 0) {
            console.log(key + ' = ' + toString2_16(key) + ': ' + lut4count[key]);
        }
    });

    return res;
}

module.exports = fpga;
/* eslint no-console:1 */

},{"../lib/lut":12,"./lut4cache":13,"./to-string2_16":16}],10:[function(require,module,exports){
'use strict';

var fpga = require('./fpga');

module.exports = fpga;

},{"./fpga":9}],11:[function(require,module,exports){
'use strict';

function isXor4 (data) {
    var i0s = [0x0000, 0x5555, 0xaaaa],
        i1s = [0x0000, 0x3333, 0xcccc],
        i2s = [0x0000, 0x0f0f, 0xf0f0],
        i3s = [0x0000, 0x00ff, 0xff00];

    var i0, i1, i2, i3;
    for (i0 = 0; i0 < 3; i0++) {
        for (i1 = 0; i1 < 3; i1++) {
            for (i2 = 0; i2 < 3; i2++) {
                for (i3 = 0; i3 < 3; i3++) {
                    if ((i0s[i0] ^ i1s[i1] ^ i2s[i2] ^ i3s[i3]) === data) {
                        return [i0, i1, i2, i3];
                    }
                }
            }
        }
    }
}

module.exports = isXor4;

},{}],12:[function(require,module,exports){
'use strict';

var gates = require('./fpga-gates')(),
    simplify = require('./simplify'),
    construct = require('./construct'),
    isXor4 = require('./is-xor4');

function toString2_16 (data) {
    return (
        '0000000000000000' +
        parseInt(data, 10).toString(2)
    ).slice(-16);
}

function invertInputs (desc) {
    var res = {};
    Object.keys(desc).forEach(function (key) {
        res[key] = desc[key].map(function (term) {
            if (typeof term === 'string') {
                return ['~', term];
            } else {
                return term[1];
            }
        });
    });
    return res;
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
            g1[idx] = [a[1]];
        }
    });

    var g2 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            var idx = a[0] & b[0];
            if (idx && !g1[idx] && !g2[idx]) {
                g2[idx] = [a[1], b[1]];
            }
        });
    });

    var g3 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            arr.forEach(function (c) {
                var idx = a[0] & b[0] & c[0];
                if (idx && !g1[idx] && !g2[idx] && !g3[idx]) {
                    g3[idx] = [a[1], b[1], c[1]];
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
                        g4[idx] = [a[1], b[1], c[1], d[1]];
                    }
                });
            });
        });
    });
    var groups = [g0, g1, g2, g3, g4];

    return function (data) {
        console.log(toString2_16(data));

        var sumOfProducts = construct(data, groups);
        sumOfProducts = simplify(data, sumOfProducts);
        console.log(JSON.stringify(sumOfProducts, null, 4));

        var resSingle = gates.single(sumOfProducts);
        if (resSingle) {
            return resSingle;
        }

        var resAnd = gates.and(sumOfProducts);
        if (resAnd) {
            return resAnd;
        }

        var productOfSums = construct(~data & 0xffff, groups);
        productOfSums = simplify(~data & 0xffff, productOfSums);
        productOfSums = invertInputs(productOfSums);
        console.log(JSON.stringify(productOfSums, null, 4));

        var resOr = gates.or(productOfSums);
        if (resOr) {
            return resOr;
        }

        var xorer = isXor4(data);
        if (xorer) {
            return gates.xorer(xorer);
        }

        console.log('BLACKBOX!');

        return gates.blackbox(sumOfProducts, productOfSums);
    };
}

module.exports = lut4;
/* eslint no-console:1 */

},{"./construct":5,"./fpga-gates":8,"./is-xor4":11,"./simplify":14}],13:[function(require,module,exports){
'use strict';

var d = require('./d');

// var xor = 'm -21,-10 c1,3 2,6 2,10 m0,0 c0,4 -1,7 -2,10 m3,-20 4,0 c6,0 12,5 14,10 -2,5 -8,10 -14,10 l-4,0 c1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z';
// var circle = ' M 4,0 C 4,1.1  3.1,2      2,2  0.9,2   0,1.1    0,0 c 0,-1.1 0.9,-2 2,-2 1.1,0 2,0.9 2,2 z';
// var circle = 'm 4 0 c 0 1.1,-0.9 2,-2 2 s -2 -0.9,-2 -2 s 0.9 -2,2 -2 s 2 0.9,2 2 z';
// var and    = 'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z';
// var buf    = 'l-12,8 v-16 z';
// var or     = 'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z';
//
// var inputs = {
//     i0t1: 'M0 4 h12 v4 h4',
//
//     i1t1: 'M0 12 h4 v-4 h12',
//     i1t2: 'M0 12 h16',
//
//     i2t1: 'M0 20 h4 v-12 h12',
//     i2t3: 'M0 20 h8 v-4 h8',
//
//     i3t3: 'M0 28 h12 v-12 h4',
//     i3t4: 'M0 28 h12 v-8 h4'
// };
//
// function group (body) {
//     var res = ['g', { transform: 'translate(0.5,0.5)' }];
//     body.forEach(function (e) {
//         res.push(e);
//     });
//     return res;
// }

function lut4cache () {

    var cache = {};

    cache[0xcaca] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 -4  h8 z m24 4 ' +
            'm-24  4 h10 z m10 0 v-5 z m14 -4 ' +
            d.mux01,
        class: 'gate'
    },
        ['title', {}, 'i2 ? i1 : i0']
    ];

    cache[0x3caa] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 12 h10 z m10 0 v-5 z m14 -12' +
            d.mux02 +
            'm-16,0' + d.xor6,
        class: 'gate'
    },
        ['title', {}, 'i3 ? (i1 ^ i2) : i0']
    ];

    cache[0xccca] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 -4  h8 z m24 4 ' +
            'm-16 8 h2 z m2 0 v-9 z m14 -8' +
            d.mux01 +
            'm-16 4' + d.or6,
        class: 'gate'
    },
        ['title', {}, '(i2 | i3) ? i1 : i0']
    ];

    cache[0xf800] = ['path', {
        d: d.origin +
            'm-24 4  h4  z m4  0 v-4 z m0 -4 h4 z m20 0' +
            'm-24 12 h12 z m12 0 v-8 z m0 -8 h4 z m12 -4' +
            d.and6 + ' m-8 -4' + d.or6 + 'm-8 -4' + d.and6,
        class: 'gate'
    },
        ['title', {}, '((i0 &amp; i1) | i2) &amp; i3']
    ];


    // cache[0xffff] = group([
    //     ['text', { x: 24, y: 20, 'text-anchor': 'middle' }, '1']
    // ]);
    //
    // cache[0x0ff0] = group([
    //     ['path', {
    //         d: inputs.i2t1 + inputs.i3t3,
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + xor,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0x3c3c] = group([
    //     ['path', {
    //         d: inputs.i1t1 + inputs.i2t3,
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + xor,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0x5555] = group([
    //     ['path', {
    //         d: 'M0,4 h12 v8 h12',
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + buf + circle,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0xaaaa] = group([
    //     ['path', {
    //         d: 'M0,4 h12 v8 h12',
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + buf,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // var arr16 = Array.apply(null, Array(16));
    //
    // arr16.forEach(function (e, i) {
    //     var tt = 1 << i;
    //     var res = ['g', {},
    //         ['path', { d: 'M32 16' + and, fill: '#ffb', stroke: '#000' },
    //             ['title', {}, tt]
    //         ]
    //     ];
    //     [1, 2, 4, 8].forEach(function (mask, maski) {
    //         if (!(i & mask)) {
    //             res.push(['path', {
    //                 d: 'M12 ' + (4 + 8 * maski) + circle,
    //                 fill: '#ffb', stroke: '#000'
    //             }]);
    //         }
    //     });
    //     cache[tt] = res;
    // });
    //
    // arr16.forEach(function (e, i) {
    //     var tt = 0xffff ^ (1 << i);
    //     var res = ['g', {},
    //         ['path', { d: 'M32 16' + or, fill: '#ffb', stroke: '#000' },
    //             ['title', {}, tt]
    //         ]
    //     ];
    //     [1, 2, 4, 8].forEach(function (mask, maski) {
    //         if (!(i & mask)) {
    //             res.push(['path', {
    //                 d: 'M12 ' + (4 + 8 * maski) + circle,
    //                 fill: '#ffb', stroke: '#000'
    //             }]);
    //         }
    //     });
    //     cache[tt] = res;
    // });

    return cache;
}

module.exports = lut4cache;

},{"./d":6}],14:[function(require,module,exports){
'use strict';

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
    }));
    return terms;
}

module.exports = simplify;

},{}],15:[function(require,module,exports){
'use strict';

var d = require('./d'),
    expr = require('./expr');

var wires = {
    i0: 'M8.5 4.5  v12  h24',
    i1: 'M8.5 12.5 v4   h24',
    i2: 'M8.5 20.5 v-4  h24',
    i3: 'M8.5 28.5 v-12 h24'
};

function constant (val) {
    return ['text', {
        x: 24, y: 20,
        'text-anchor': 'middle'
    }, val];
}

function single (desc) {
    var term, res;
    var keys = Object.keys(desc);

    if (keys.length === 0) {
        return constant(0);
    }

    if (keys.length === 1) {
        term = desc[keys[0]];

        if (typeof term === 'string') { // TODO check for value?
            return constant(1);
        } else

        if (term.length === 1) {
            res = ['g', { class: 'gate' },
                ['title', {}, expr(desc, ' &amp; ', ' | ')],
                ['path', {
                    d: wires[
                        (typeof term[0] === 'string') ?
                        term[0] :
                        term[0][1]
                    ] || '',
                    fill: 'none'
                }]
            ];
            if (typeof term[0] !== 'string') {
                res.push(['path', {
                    d: 'M24.5 16.5' + d.buf + d.circle
                }]);
            } else {
                res.push(['rect', {
                    x: 8, y: 0, width: 24, height: 32,
                    'fill-opacity': 0.1, stroke: 'none'
                }]);
            }
            return res;
        }
    }
}

module.exports = single;

},{"./d":6,"./expr":7}],16:[function(require,module,exports){
'use strict';

function toString2_16 (num) {
    var res = '0000000000000000';
    if (typeof num === 'string') {
        num = parseInt(num, 10);
    }
    res += num.toString(2);
    res = res.slice(-16);
    res = res.slice(0,4) +
        '_' + res.slice(4,8) +
        '_' + res.slice(8,12) +
        '_' + res.slice(12,16);
    return res;
}

module.exports = toString2_16;

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
'use strict';

var token = /<o>|<ins>|<s>|<sub>|<sup>|<b>|<i>|<tt>|<\/o>|<\/ins>|<\/s>|<\/sub>|<\/sup>|<\/b>|<\/i>|<\/tt>/;

function update (s, cmd) {
    if (cmd.add) {
        cmd.add.split(';').forEach(function (e) {
            var arr = e.split(' ');
            s[arr[0]][arr[1]] = true;
        });
    }
    if (cmd.del) {
        cmd.del.split(';').forEach(function (e) {
            var arr = e.split(' ');
            delete s[arr[0]][arr[1]];
        });
    }
}

var trans = {
    '<o>'    : { add: 'text-decoration overline' },
    '</o>'   : { del: 'text-decoration overline' },

    '<ins>'  : { add: 'text-decoration underline' },
    '</ins>' : { del: 'text-decoration underline' },

    '<s>'    : { add: 'text-decoration line-through' },
    '</s>'   : { del: 'text-decoration line-through' },

    '<b>'    : { add: 'font-weight bold' },
    '</b>'   : { del: 'font-weight bold' },

    '<i>'    : { add: 'font-style italic' },
    '</i>'   : { del: 'font-style italic' },

    '<sub>'  : { add: 'baseline-shift sub;font-size .7em' },
    '</sub>' : { del: 'baseline-shift sub;font-size .7em' },

    '<sup>'  : { add: 'baseline-shift super;font-size .7em' },
    '</sup>' : { del: 'baseline-shift super;font-size .7em' },

    '<tt>'   : { add: 'font-family monospace' },
    '</tt>'  : { del: 'font-family monospace' }
};

function dump (s) {
    return Object.keys(s).reduce(function (pre, cur) {
        var keys = Object.keys(s[cur]);
        if (keys.length > 0) {
            pre[cur] = keys.join(' ');
        }
        return pre;
    }, {});
}

function parse (str) {
    var state, res, i, m, a;

    if (str === undefined) {
        return [];
    }

    if (typeof str === 'number') {
        return [str + ''];
    }

    if (typeof str !== 'string') {
        return [str];
    }

    res = [];

    state = {
        'text-decoration': {},
        'font-weight': {},
        'font-style': {},
        'baseline-shift': {},
        'font-size': {},
        'font-family': {}
    };

    while (true) {
        i = str.search(token);

        if (i === -1) {
            res.push(['tspan', dump(state), str]);
            return res;
        }

        if (i > 0) {
            a = str.slice(0, i);
            res.push(['tspan', dump(state), a]);
        }

        m = str.match(token)[0];

        update(state, trans[m]);

        str = str.slice(i + m.length);

        if (str.length === 0) {
            return res;
        }
    }
}

exports.parse = parse;

},{}]},{},[3]);
