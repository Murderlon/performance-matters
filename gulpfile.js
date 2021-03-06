const gulp = require('gulp')
const del = require('del')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const minifyCSS = require('gulp-clean-css')
const runSequence = require('run-sequence')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const imageminWebp = require('imagemin-webp')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

const handlers = {}

gulp.task('develop', cb => runSequence('build:clean', 'build:all', cb))
gulp.task('build:all', cb => runSequence(['build:html', 'build:css', 'build:vendor', 'build:images', 'build:webp', 'build:assets', 'build:fonts', 'build:fontcss', 'build:favicon'], cb))
gulp.task('build:clean', buildClean)
gulp.task('build:html', buildHtml)
gulp.task('build:css', buildCss)
gulp.task('build:vendor', buildVendor)
gulp.task('build:images', buildImages)
gulp.task('build:webp', buildWebp)
gulp.task('build:assets', buildAssets)
gulp.task('build:fonts', buildFonts)
gulp.task('build:fontcss', buildFontCss)
gulp.task('build:favicon', buildFavicon)
gulp.task('watch', watch)

handlers.onStreamError = function (error) {
	console.error(error.message)
	this.emit('end')
}

handlers.onPromiseError = function (error) {
	console.error(error.constructor.name + ': ' + error.message)
}

function buildClean() {
	del.sync('build')
}

function buildHtml() {
	gulp.src('src/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('build'))
}

function buildCss() {
	gulp.src(['src/dist/css/bootstrap.css', 'src/assets/css/src/docs.css', 'src/dist/css/bootstrap-theme.css'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.on('error', handlers.onStreamError)
		.pipe(minifyCSS())
		.pipe(concat('index.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/dist/css'))
}

function buildFontCss() {
	gulp.src('src/dist/css/fonts.css')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.on('error', handlers.onStreamError)
	.pipe(minifyCSS())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('build/dist/css'))
}

function buildVendor() {
	gulp.src([
		'src/assets/js/vendor/jquery.min.js',
		'src/dist/js/bootstrap.js',
		'src/assets/js/docs.min.js',
		'src/assets/js/ie10-viewport-bug-workaround.js'
	]).pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.on('error', handlers.onStreamError)
		.pipe(gulp.dest('build/assets/vendor'))
}

function buildImages() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo(), imageminWebp({quality: 70})]))
		.on('error', handlers.onStreamError)
		.pipe(gulp.dest('build'))
}

function buildWebp() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(webp())
		.pipe(gulp.dest('build'))
}

function buildAssets() {
	gulp.src(['src/assets/brand/*.svg', 'src/assets/flash/*.swf'])
		.pipe(gulp.dest('build/assets'))
}

function buildFonts() {
	gulp.src('src/dist/fonts/*.*')
		.pipe(gulp.dest('build/dist/fonts'))
}

function buildFavicon() {
	gulp.src('src/favicon.ico')
		.pipe(gulp.dest('build'))
}

function watch() {
	gulp.watch('src/**/*.css', ['build:css'])
	gulp.watch('src/**/*.html', ['build:html'])
}
