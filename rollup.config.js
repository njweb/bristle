import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';

const prodConfig = {
  inputFile: 'src/bristleUmd.js',
  nodeEnvReplacement: JSON.stringify('production'),
  extraPlugins: [uglify({}, minify)],
  format: 'umd',
  outFilename: 'bristle.min.js'
};
const moduleConfig = {
  inputFile: 'src/bristle.js',
  nodeEnvReplacement: 'process.env.NODE_ENV',
  extraPlugins: [],
  format: 'es',
  outFilename: 'bristle.module.js'
};
const devConfig = {
  inputFile: 'src/bristleUmd.js',
  nodeEnvReplacement: 'process.env.NODE_ENV',
  extraPlugins: [],
  format: 'umd',
  outFilename: 'bristle.js'
};

const configuration = (() => {
  if (process.env.NODE_ENV === 'production') {
    return prodConfig;
  } else if (process.env.NODE_ENV === 'module') {
    return moduleConfig;
  } else {
    return devConfig;
  }
})();

export default {
  input: configuration.inputFile,
  name: 'bristle',
  plugins: [
    replace({
      'process.env.NODE_ENV': configuration.nodeEnvReplacement,
    }),
    babel({exclude: 'node_modules/**'})
  ].concat(configuration.extraPlugins),
  output: {
    file: `lib/${configuration.outFilename}`,
    format: configuration.format
  }
}