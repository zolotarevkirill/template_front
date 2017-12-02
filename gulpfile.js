const gulp = require('gulp');
const sass = require('gulp-sass');
var notify = require( 'gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');

// PostCSS with plugins
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');




//Обработка SASS
gulp.task('css', () => {
    return gulp.src('sass/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on( 'error', notify.onError(
	      {
	        message: "<%= error.message %>",
	        title  : "Sass Error!"
	      } ) )
        .pipe(postCss([
            autoprefixer(),
            mqpacker()
        ]))
        .pipe(gulp.dest('css'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('../dist/css'))
        .pipe(browsersync.stream())
});


//Обработка JS
gulp.task('js', () => {
    return gulp.src(['js/*.js', '!js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../dist/js'))
        .pipe(browsersync.stream())
});

//Обработка HTML
gulp.task('html', () => {
    return gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('../dist'))
        .pipe(browsersync.stream())
});

//Обработка картинок
gulp.task('img', () => {
    return gulp.src('/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('../dist/img'))
});

//Запуск проекта
gulp.task('sync', () => {
    browsersync.init({
    	 server: {
            baseDir: "../dist"
        },
        files: ["../dist/js/*.js", "../dist/*.html", "../dist/*.php", "../dist/css/*.css"]
        //proxy: 'myproject.loc',
        //notify: false,
        //port: 8080
    })
});

gulp.task('build', ['html', 'css', 'js', 'img']);

gulp.task('watch', () => {
    gulp.watch(['sass/*.sass'], ['css']);
    gulp.watch(['js/*.js'], ['js']);
    gulp.watch(['*.html'], ['html']);
    gulp.watch(['../dist/**/*.html',
                '../dist/**/*.css',
                '../dist/**/*.js'
                ]).on('change', browsersync.reload);
});

gulp.task('default', ['sync', 'watch']);

