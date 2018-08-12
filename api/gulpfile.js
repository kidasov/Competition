const gulp = require('gulp')
const plumber = require('gulp-plumber')
const babel = require('gulp-babel')
const { spawn } = require('child_process')

const sources = 'src/**/*.js'
const output = 'lib'

let node = null

const startNode = () => {
  node = spawn('node', [`${output}/index`], { stdio: 'inherit' })
  node.on('close', code => {
    node = null
    if (code === 8) {
      gulp.log('Error detected, waiting for changes…')
    }
  })
}

gulp.task('server', ['scripts'], () => {
  if (node != null) {
    node.on('close', startNode)
    node.kill()
  } else {
    startNode()
  }
})

gulp.task('scripts', () => gulp.src(sources)
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulp.dest(output)))

gulp.task('default', ['server'], () => {
  gulp.watch(sources, ['server'])
})