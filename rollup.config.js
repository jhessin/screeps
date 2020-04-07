'use strict';

import clear from 'rollup-plugin-clear';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import screeps from 'rollup-plugin-screeps';
import flow from 'rollup-plugin-flow';

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log(
    'No destination specified - code will be compiled but not uploaded',
  );
} else if ((cfg = require('./screeps.json')[dest]) == null) {
  throw new Error('Invalid upload destination');
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true,
  },

  plugins: [
    clear({ targets: ['dist'] }),
    resolve(),
    commonjs({
      main: ['loop'],
    }),
    flow({pretty: true}),
    screeps({ config: cfg, dryRun: cfg == null }),
  ],
};
