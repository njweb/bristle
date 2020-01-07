import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const commonPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  resolve(),
  babel({exclude: 'node_modules/**'})
];

const rollupConfig = [
  {
    input: 'src/bristle.js',
    plugins: commonPlugins,
    output: {
      format: 'esm',
      file: 'lib/bristle.js',
    },
  },
  {
    input: 'src/bristle.js',
    plugins: [...commonPlugins, terser()],
    output: {
      format: 'umd',
      name: 'bristle',
      file: 'lib/bristle.min.js',
    },
  },
];

export default rollupConfig;
