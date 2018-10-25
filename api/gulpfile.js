const gulp = require('gulp')
const ts = require('gulp-typescript')
const { spawn } = require('child_process')

const tsProject = ts.createProject('tsconfig.json')
const sources = 'src/**/*.{js,ts}'
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

gulp.task('watch', ['scripts'], function() {
  gulp.watch('lib/*.ts', ['scripts']);
})

gulp.task('scripts', () => tsProject.src()
  .pipe(tsProject())
  .pipe(gulp.dest(output)))

gulp.task('default', ['server'], () => {
  gulp.watch(sources, ['server'])
})
