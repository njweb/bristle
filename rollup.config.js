import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  name: 'bristle',
  plugins: [
    babel({exclude: 'node_modules/**'})
  ],
  output: {
    file: 'lib/index.js',
    format: 'umd'
  }
}