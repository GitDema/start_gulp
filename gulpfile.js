var gulp 					=	require('gulp'),
		sass 					=	require('gulp-sass'),
		browserSync 	=	require('browser-sync'),
		concat 				=	require('gulp-concat'),
		uglifyjs 			=	require('gulp-uglifyjs'),
		cssnano     	=	require('gulp-cssnano'),
		rename      	=	require('gulp-rename'),
		autoprefixer	=	require('gulp-autoprefixer'),
		imagemin			=	require('gulp-imagemin'),
		pngquant			=	require('imagemin-pngquant'),
		del						=	require('del')


/*liveReload*/
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		browser: 'google chrome',
		open: false
	});
});


/*sass compilation*/
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});


/*concat all libs css files*/
gulp.task('css-libs', ['sass'], function(){
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.css',
		'node_modules/bootstrap/dist/css/bootstrap.min.css'
	])
	.pipe(cssnano())
	.pipe(concat('libs.min.css'))
	.pipe(gulp.dest('app/css'));
});


/*concat all libs js files*/
gulp.task('scripts', function(){
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglifyjs())
	.pipe(gulp.dest('app/js'));
});


/*for development*/
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


/*cleaning previous build*/
gulp.task('clean', function(){
	return del.sync('dist');
});


/*img compression*/
gulp.task('img', function(){
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
});


/*build production*/
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
	var buildCss = gulp.src([
		'app/css/libs.min.css',
		'app/css/style.css'
	])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src([
		'app/js/libs.min.js',
		'app/js/common.js'
	])
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist/'));
});


/*clear cache*/



/*default*/
gulp.task('default', ['watch']);