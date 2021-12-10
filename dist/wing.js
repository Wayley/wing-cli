#!/usr/bin/env node

/*!
 * wingjs-cli v0.0.11
 * Copyright © 2017-2021 Robben Wadlay
 * Released under the MIT License
 *
 */ (() => {
  'use strict';
  var e = {
      306: (e) => {
        e.exports = JSON.parse(
          '{"u2":"wingjs-cli","i8":"0.0.11","h$":{"d":"^10.12.0 || ^12.0.0 || >= 14.0.0"}}'
        );
      },
      242: (e) => {
        e.exports = require('chalk');
      },
      647: (e) => {
        e.exports = require('commander');
      },
      513: (e) => {
        e.exports = require('semver');
      },
    },
    o = {};
  function r(s) {
    var n = o[s];
    if (void 0 !== n) return n.exports;
    var t = (o[s] = { exports: {} });
    return e[s](t, t.exports, r), t.exports;
  }
  (() => {
    const e = r(513).satisfies,
      o = r(242);
    const s = r(306).u2;
    var n, t;
    (n = r(306).h$.d),
      (t = s),
      e(process.version, n) ||
        (console.log(
          o.red(
            `You are using Node ${process.version}, but this version of ${t} requires Node ${n}'.\n\nPlease upgrade your Node version.`
          )
        ),
        process.exit(1));
    const i = ['8.x', '9.x', '11.x', '13.x'];
    for (const r of i)
      e(process.version, r) &&
        console.log(
          o.red(
            `You are using Node ${process.version}.\nNode.js ${r} has already reached end-of-life and will not be supported in future major releases.\nIt's strongly recommended to use an active LTS version instead.`
          )
        );
    const a = r(647);
    a.version(`${r(306).i8}`).usage('<command> [options]'),
      a
        .command('create <app-name>')
        .description(`create a new project powered by ${s} service`)
        .option('-p, --port [presetName]', 'locale running port', 3e3)
        .action((e, o) => {
          const r = (function (e) {
            const o = {};
            return (
              e.options.forEach((r) => {
                const s = r.long
                  .replace(/^--/, '')
                  .replace(/-(\w)/g, (e, o) => (o ? o.toUpperCase() : ''));
                'function' != typeof e[s] && void 0 !== e[s] && (o[s] = e[s]);
              }),
              o
            );
          })(o);
          console.log('Create33', e, r);
        }),
      a.parse(process.argv);
  })();
})();
