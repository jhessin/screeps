const gulp = require('gulp');
const screeps = require('gulp-screeps');

gulp.task('screeps', () => {
  gulp.src('./dist/main.js')
  .pipe(screeps(options))
})

