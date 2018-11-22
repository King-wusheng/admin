const gulp = require('gulp')
const server = require('gulp-webserver')

gulp.task('serve', () => {
  gulp.src('./dist')
    .pipe(server({
      host: 'localhost',
      port: 6677
    }))
})