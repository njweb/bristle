'use strict';
let gulp = require('gulp');
let uglify = require('gulp-uglify');
let rollup = require('rollup-stream');
let babel = require('rollup-plugin-babel');
let replace = require('rollup-plugin-replace');
let babelRegister = require('babel-register');
let rename = require('gulp-rename');
let streamify = require('gulp-streamify');
let concat = require('gulp-concat');
let mocha = require('gulp-mocha');
let gutil = require('gulp-util');
let source = require('vinyl-source-stream');

let pkg = require('./package.json');

gulp.task('build_lib', function () {
  return rollup({
    entry: './src/index.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'bristle',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        __DEV__: true
      })
    ]
  }).pipe(source(pkg.name + '.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build_min_lib', function () {
  return rollup({
    entry: './src/index.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'bristle',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        __DEV__: false
      })
    ]
  }).pipe(source(pkg.name + '.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./lib'));
});

gulp.task('spec', function () {
  return gulp.src(['./spec/*.spec.js'], {read: false})
    .pipe(mocha({reporter: 'min', compilers: {js: babelRegister}}));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['spec']);
  gulp.watch('./spec/*.js', ['spec']);
});

gulp.task('default', ['build_lib', 'build_min_lib'], function () {});