'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');

const gitignore = require('gitignore-to-glob')();
gitignore.push();

const paths = {
  ts: gitignore.concat('**/*.ts'),
  styl: gitignore.concat('**/*.styl')
};

// Code linting
const tslint = require('gulp-tslint');

gulp.task('tslint', () =>
  gulp.src(paths.ts)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: true,
      summarizeFailureOutput: true,
      reportLimit: 50
    }))
);

gulp.task('stylus', function () {
  return gulp.src(paths.styl)
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['tslint']);
