// Globals
var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    autoPrefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten');
cssNano = require('gulp-cssnano'),
    fileInclude = require('gulp-file-include'),
    imageMin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence');

// Paths
var paths = {
    dist: './dist/',
    src: './assets/'
};

// Clean
gulp.task('clean', require('del').bind(null, [paths.dist]));

// Styles
gulp.task('styles', function() {
    return gulp.src(paths.src + 'styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            browsers: [
                'last 2 version',
                'android 2.3',
                'android 4',
                'opera 12'
            ]
        }))
        .pipe(cssNano())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.dist + 'styles'))
        .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(paths.src + 'scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.dist + 'scripts'))
        .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src(paths.src + 'images/*')
        .pipe(imageMin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(paths.dist + 'images'))
        .pipe(browserSync.stream());
});

// Html
gulp.task('fileInclude', function() {
    return gulp.src(paths.src + 'templates/*.html')
        .pipe(fileInclude())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('html', function(callback) {
    runSequence('fileInclude',
        callback);
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(paths.src + 'fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(paths.dist + 'fonts'))
        .pipe(browserSync.stream());
});

// Default Gulp Build
gulp.task('default', function(callback) {
    runSequence(
        'styles',
        'scripts',
        'fonts',
        'images',
        callback);
});
gulp.task('refresh', function(callback) {
    browserSync.reload();
});
// Gulp Build - Same as Default, but with a clean up beforehand
gulp.task('build', ['clean'], function() {
    gulp.start('default');
});

/* Gulp watch - watch changes of files in 'src' folder (run it by 'gulp watch') */
gulp.task('watch', function() {
    browserSync.init({
        proxy: 'localhost/toymail',
        port: 8080,
        ui: {
            port: 8081
        },
        files: [
            "./assets/**/*.{html,js,scss}",
            "./index.html"
        ]
    });
    gulp.watch('./**', 'refresh');
});
