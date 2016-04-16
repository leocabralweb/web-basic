// Required
var gulp = require("gulp"),
    path = require("path"),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    uglify = require("gulp-uglify"),
    plumber = require("gulp-plumber"),
    autoprefixer = require("gulp-autoprefixer"),
    compass = require("gulp-compass"),
    cleanCSS = require('gulp-clean-css'),
    bower = require('main-bower-files');

var src_dir = 'src';
var src = {
    js: [src_dir + "/js/**/*.js"],
    css: [src_dir + "/sass/**/*.sass", src_dir + "/sass/**/*.scss"],
};

var dist_dir = 'static';
var dist = {
    js: dist_dir + '/js',
    css: dist_dir + '/css',
    vendor: dist_dir + '/vendor'
};

// Bower
gulp.task("bower-files", function(){
    gulp.src(bower("**/*.js"))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(dist.js))
});

// Scripts Task
gulp.task("scripts", function() {
    gulp.src(src.js)
        .pipe(plumber())
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(dist.js));
});

// Styles Task
gulp.task("styles", function() {
    gulp.src(src.css)
        .pipe(plumber())
        .pipe(compass({
	      project: path.join(__dirname, 'src'),
	      css: '../static/css',
	      sass: 'sass'
	    }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(dist.css));

    if(argv.production) {
        gulp.src(dist.css + "/*.css")
            .pipe(cleanCSS())
            .pipe(gulp.dest(dist.css));
    }
});

// Watch Task
gulp.task("watch", function() {
    gulp.watch(src.js, ["scripts"]);
    gulp.watch(src.css, ["styles"]);
    gulp.watch("bower.json", ["bower-files"]);
});

gulp.task("build", ["bower-files", "scripts", "styles"]);

// Default Task
gulp.task("default", ["build", "watch"]); // dev