const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');

gulp.task('minify_css', () => {
    return gulp.src('./public/**/*.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./public'));
  });

gulp.task('minify_html', function() {
    return gulp.src(['./public/**/*.html', '!./public/{lib,lib/**}'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('minify_js', function() {
    return gulp.src(['./public/**/*.js', '!./public/**/*.min.js', '!./public/{lib,lib/**}'])
        .pipe(terser())
        .pipe(gulp.dest('./public'));
});

gulp.task('one', gulp.parallel('minify_html', 'minify_css', 'minify_js'));
gulp.task('default', gulp.series('one'));
