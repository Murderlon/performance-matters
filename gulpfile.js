const gulp = require('gulp')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const imageminWebp = require('imagemin-webp')
const runSequence = require('run-sequence')

const handlers = {}
gulp.task('develop', cb => runSequence('build:images', 'build:webp', cb))
gulp.task('build:images', buildImages)
gulp.task('build:webp', buildWebp)

handlers.onStreamError = function (error) {
	console.error(error.message)
	this.emit('end')
}

function buildImages() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo(), imageminWebp({quality: 70})]))
		.on('error', handlers.onStreamError)
		.pipe(gulp.dest('src'))
}

function buildWebp() {
	gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.jpeg'])
		.pipe(webp())
		.pipe(gulp.dest('src'))
}
