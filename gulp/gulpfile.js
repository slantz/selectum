var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

var pkg = require('./package.json');

gulp.task('js-dev-app', function() {
  return gulp.src([
    '../src/*.js',
  ])
  .pipe(concat(pkg.name+'.js'))
  .pipe(uglify({
    options: {
    mangle: false,
    preserveComments: false
    }
  }))
  .pipe(rename({
    basename: pkg.name,
    suffix: '.min',
    extname: ".js"
  }))
  .pipe(gulp.dest('../dist/js'))
});

gulp.task('js-dev', ['js-dev-app']);

gulp.task('watch', function() {
  gulp.watch('../src/*.js', ['js-dev']);
});

gulp.task('default', ['js-dev-app']);