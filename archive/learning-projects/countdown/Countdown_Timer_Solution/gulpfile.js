"use strict";

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-dart-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

const files = {
  scssPath: "./scss/**/*.scss",
  jsPath: "./js/**/*.js",
  htmlPath: "./*.html"
};

const scssTask = () => {
  return src(files.scssPath)
    .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(dest("./css"))
    .pipe(browserSync.stream());
};

const watchTask = () => {
  browserSync.init({
    server: "./",
  });

  watch(files.scssPath, scssTask);
  watch(files.jsPath).on("change", browserSync.reload);
  watch(files.htmlPath).on("change", browserSync.reload);
};

exports.default = series(
  scssTask,
  watchTask
)
