const gulp = require('gulp')
const del = require('del')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const minifyCSS = require('gulp-clean-css')
const runSequence = require('run-sequence')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

const handlers = {}

gulp.task('develop', cb => runSequence('build:clean', 'build:all', cb))
gulp.task('build:all', ['build:html', 'build:css', 'build:vendor', 'build:images', 'build:webp', 'build:assets', 'build:fonts', 'build:favicon'])
gulp.task('build:clean', buildClean)
gulp.task('build:html', buildHtml)
gulp.task('build:css', buildCss)
gulp.task('build:vendor', buildVendor)
gulp.task('build:images', buildImages)
gulp.task('build:webp', buildWebp)
gulp.task('build:assets', buildAssets)
gulp.task('build:fonts', buildFonts)
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
	del.sync('dist')
}

function buildHtml() {
	gulp.src('src/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist'))
}

function buildCss() {
	gulp.src('src/**/**/*.css')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.on('error', handlers.onStreamError)
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'))
}

// function buildJs() {
// 	gulp.src('src/**/**/*.js')
// 			.pipe(plumber())
// 			.pipe(sourcemaps.init())
// 			.pipe(uglify())
// 			.pipe(sourcemaps.write('./'))
// 			.on('error', handlers.onStreamError)
//       .pipe(gulp.dest('dist'))
// }

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
		.pipe(gulp.dest('dist/assets/vendor'))
}

function buildImages() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(imagemin())
		.pipe(gulp.dest('dist'))
}

function buildWebp() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(webp())
		.pipe(gulp.dest('dist'))
}

function buildAssets() {
	gulp.src(['src/assets/brand/*.svg', 'src/assets/flash/*.swf'])
		.pipe(gulp.dest('dist/assets'))
}

function buildFonts() {
	gulp.src('src/dist/fonts/*.*')
		.pipe(gulp.dest('dist/dist/fonts'))
}

function buildFavicon() {
	gulp.src('src/favicon.ico')
		.pipe(gulp.dest('dist'))
}

function watch() {
	gulp.watch('src/**/*.css', ['build:css'])
	gulp.watch('src/**/*.html', ['build:html'])
}
