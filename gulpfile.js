'use strict';


//*** Plugins

// base
const {src, dest, series, parallel, watch} = require('gulp');
const browserSync = require('browser-sync').create();

// html
// const pug = require('pug');
const pug = require('gulp-pug');
// const htmlmin = require('gulp-htmlmin');

// css
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// js
const terser = require('gulp-terser');
const babel = require('gulp-babel');

// img
// const imagemin = require('gulp-imagemin');

// other
const concat = require('gulp-concat');
// const rename = require("gulp-rename");
const clean = require('gulp-clean');


//*** Options

const path = {
  devPug:   './src/pug/**/*.pug',
  devPugNo:   '!./**/_*.pug',
  devScss:  './src/scss/*.scss',
  devJs:    './src/js/**/*.js',
  devImg:    './src/img/**/*',
  project: 'dist'
}

const options = {
  pug: {
    locals: {
      h1: 'New TITLE',
    }
  }
}


//*** Functions

function clear() {
  return src(
    path.project,
    {
      read: false,
      allowEmpty: true
    })
    .pipe(clean());
}

function html() {
  return src([path.devPug, path.devPugNo])
    .pipe(
      pug(options.pug)
    )
    .pipe(dest(path.project));
}

function css() {
  return src(path.devScss)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(path.project));
};

function js(){
  return src(path.devJs)
    .pipe(terser())
    .pipe(dest(path.project));
}

function es5() {
  return src(path.devJs)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(path.project))
}

function img() {
  return src(path.devImg)
    .pipe(dest(path.project + '/img'))
}

function server() {
  watch(path.devPug, parallel(html)).on('change', browserSync.reload)
  watch(path.devScss, parallel('css')).on('change', browserSync.reload)
  watch(path.devJs, parallel('js')).on('change', browserSync.reload)

  return browserSync.init({
    server: {
      baseDir: path.project
    }
  })
}


// Exports

exports.clear = clear
exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.server = server

exports.default = series(clear, html, css, js, server)
exports.prod = series(clear, html, css, js)