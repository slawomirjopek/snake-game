const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const reporter = require('postcss-reporter');
const scssSyntax = require('postcss-scss');
const stylelint = require('stylelint');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
require('gulp-watch');

const TYPES = {
  STYLES: 'styles',
  SCRIPTS: 'scripts',
  DIST: 'dist',
  EXAMPLE: 'example',
  EXT_STYLES: 'scss',
  EXT_SCRIPTS: 'js',
  EXT_TEMPLATE: 'html',
};

const config = { src: {} };
config.src[TYPES.STYLES] = './src/styles';
config.src[TYPES.SCRIPTS] = './src/scripts';
config.src[TYPES.DIST] = './dist';
config.src[TYPES.EXAMPLE] = './example';

function getSrc(folder, ext, disableVendor, additionalRules) {
  const src = [`${config.src[folder]}/**/*.${ext}`];
  if (disableVendor) src.push(`!${config.src[folder]}/vendor/**/*.${ext}`);
  if (additionalRules && Array.isArray(additionalRules)) src.concat(additionalRules);
  return src;
}

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('clean', () => del('./dist'));

gulp.task('styles', () => gulp
  .src(getSrc(TYPES.STYLES, TYPES.EXT_STYLES))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(sass({
    outputStyle: 'compressed',
  }))
  .pipe(gulp.dest(config.src.dist))
  .pipe(browserSync.stream()));

gulp.task('scripts', () => gulp
  .src(getSrc(TYPES.SCRIPTS, TYPES.EXT_SCRIPTS))
  .pipe(babel({
    presets: ['env'],
    plugins: ['transform-object-rest-spread'],
  }))
  .pipe(uglify())
  .pipe(gulp.dest(config.src.dist))
  .pipe(browserSync.stream()));

gulp.task('lint:styles', () => {
  const stylelintConfig = {
    rules: {
      'block-no-empty': true,
      // TBA
    },
  };

  const processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true,
    }),
  ];

  return gulp.src(getSrc(TYPES.STYLES, TYPES.EXT_STYLES))
    .pipe(postcss(processors, {
      syntax: scssSyntax,
    }));
});

gulp.task('lint:scripts', () => gulp
  .src(getSrc(TYPES.SCRIPTS, TYPES.EXT_SCRIPTS, true, ['!node_modules/**']))
  .pipe(eslint({
    fix: true,
    envs: ['browser'],
  }))
  .pipe(eslint.format())
  .pipe(gulpIf(isFixed, gulp.dest(config.src.scripts)))
  .pipe(eslint.failAfterError()));

gulp.task('watch', () => {
  gulp.watch(getSrc(TYPES.STYLES, TYPES.EXT_STYLES), gulp.series('lint:styles', 'styles'));
  gulp.watch(getSrc(TYPES.SCRIPTS, TYPES.EXT_SCRIPTS), gulp.series('lint:scripts', 'scripts'));
  gulp.watch(getSrc(TYPES.EXAMPLE, TYPES.EXT_TEMPLATE)).on('change', browserSync.reload);
});

gulp.task('serve', gulp.parallel('watch', () => browserSync.init({
  server: ['./', config.src.example],
})));

gulp.task('default', gulp.series('clean', 'lint:styles', 'lint:scripts', gulp.parallel('styles', 'scripts'), 'serve'));
