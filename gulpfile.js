// gulpfile.js

//DEPENDENCIES

  var gulp = require('gulp');
  var sass = require('gulp-sass');
  var inject = require('gulp-inject');
  var browserSync = require('browser-sync').create();
  var htmlclean = require('gulp-htmlclean');
  var cleanCSS = require('gulp-clean-css');
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var del = require('del');
  var git = require('gulp-git');

  var imagemin = require('gulp-imagemin');
  var imageminPngquant = require('imagemin-pngquant');
  var imageminZopfli = require('imagemin-zopfli');
  var imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'
  var imageminGiflossy = require('imagemin-giflossy');
  var nunjucksRender = require('gulp-nunjucks-render');



    gulp.task('default', ['clean', 'inject', 'serve']);


//PATHS

  var paths = {
    src:     'src/**/*',
    srcHTML: 'src/**/*.{html,htm}',
    srcCSS:  'src/**/*.css',
    srcJS:   'src/**/*.js',
    srcIMG:  'src/**/*.{gif,png,jpg}',
    
    tmp:      'tmp',
    tmpIndex: 'tmp/**/*.{html,htm}',
    tmpCSS:   'tmp/**/*.css',
    tmpJS:    'tmp/**/*.js',
    tmpIMG:   'tmp/**/*.{gif,png,jpg}',

    dist:       'dist',
    distIndex:  'dist/**/*.{html,htm}',
    distCSS:    'dist/**/*.css',
    distJS:     'dist/**/*.js',
    distIMG:    'dist/**/*.{gif,png,jpg}'

  };


//COPY HTML/CSS/JS

  gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('img', function () {
    return gulp.src(paths.srcIMG).pipe(gulp.dest(paths.tmp));
  });


  //gulp.task('jpg', function () {return gulp.src(paths.srcJPG).pipe(gulp.dest(paths.tmp));});
  //gulp.task('png', function () {return gulp.src(paths.srcPNG).pipe(gulp.dest(paths.tmp));});

  gulp.task('copy', ['html', 'js', 'css', 'img']);


//INJECT

  gulp.task('inject', ['sass', 'copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    var img =gulp.src(paths.tmpIMG);
    //var jpg = gulp.src(paths.tmpJPG);
    //var png = gulp.src(paths.tmpPNG);
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true  } ))
      .pipe(inject( js,  { relative:true  } ))
      .pipe(inject( img,  { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
  });



//SERVE/SYNC/SASS

  // Compile sass into CSS & auto-inject into browsers
   
    gulp.task('sass', function() {
        return gulp.src('src/style.scss')
            .pipe(sass())
            .pipe(gulp.dest('tmp'))
            .pipe(browserSync.stream());
    });

  //SERVER, BROWSER-SYNC  

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./tmp"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch('./src/**/*.html', ['inject']);

    gulp.watch("./tmp/**/*.html").on('change', browserSync.reload);
});

//DIST BUILD

  gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
      .pipe(htmlclean())
      .pipe(gulp.dest(paths.dist));
  });
  gulp.task('css:dist', function () {
    return gulp.src(paths.tmpCSS)
      .pipe(concat('style.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.dist));
  });
  gulp.task('js:dist', function () {
    return gulp.src(paths.srcJS)
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.dist));
  });
  
  //COMPRESS ALL IMAGES
    gulp.task('imagemin', function() {
        return gulp.src(['src/**/*.{gif,png,jpg}'])
            .pipe(imagemin([
                //png
                imageminPngquant({
                    speed: 1,
                    quality: 98 //lossy settings
                }),
                imageminZopfli({
                    more: true
                }),
                //gif
                // imagemin.gifsicle({
                //     interlaced: true,
                //     optimizationLevel: 3
                // }),
                //gif very light lossy, use only one of gifsicle or Giflossy
                imageminGiflossy({
                    optimizationLevel: 3,
                    optimize: 3, //keep-empty: Preserve empty transparent frames
                    lossy: 2
                }),
                //svg
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false
                    }]
                }),
                //jpg lossless
                imagemin.jpegtran({
                    progressive: true
                }),
                //jpg very light lossy, use vs jpegtran
                imageminMozjpeg({
                    quality: 90
                })
            ]))
            .pipe(gulp.dest('dist'));
    });

  gulp.task('img:dist', ['imagemin']);

  gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'img:dist']);
  gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    var img = gulp.src(paths.distIMG);
    //var jpg = gulp.src(paths.distJPG);
    //var png = gulp.src(paths.distPNG);  

    return gulp.src(paths.distIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(inject( img, { relateive:true } ))
      //.pipe(inject( jpg, { relative:true } ))
      //.pipe(inject( png, { relative:true } ))
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('build', ['inject:dist']);

// CLEANUP

  gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
    del(['src/**/*.css', 'src/**/*.css.map']);
  });

  gulp.task('clearcss', function () {
    del(['src/**/*.css', 'src/**/*.css.map']);
  });

// GIT

  // COMMIT + PROMPT
    gulp.task('commit', function(){
        var message;
        gulp.src('./*', {buffer:false})
        .pipe(prompt.prompt({
            type: 'input',
            name: 'commit',
            message: 'Please enter commit message...'
        }, function(res){
            message = res.commit;
        }))
        .pipe(git.commit(message));
    });

  // PUSH ORIGIN MASTER

    gulp.task('push', function(){
    git.push('origin', 'master', function (err) {
      if (err) throw err;
    });
  });


  //TEMPLATE ENGINE

  gulp.task('nunjucks', function() {
  // nunjucks stuff here
  //Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
    //renders template with nunjucks
    .pipe(nunjucksRender ({
      path: ['src/templates/nunjucks']
    }))
    // output files in app folder
    .pipe(gulp.dest('src/output'))
});