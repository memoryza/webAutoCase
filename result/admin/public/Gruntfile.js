module.exports = function(grunt) {
    //加载模块
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
          task: {
            files: [
              {
                expand: true,     // Enable dynamic expansion.
                cwd: 'javascripts/',      // Src matches are relative to this path.
                src: ['**/*.js'], // Actual pattern(s) to match.
                dest: 'dist/javascripts/',   // Destination path prefix.
                ext: '.js',   // Dest filepaths will have this extension.
                extDot: 'first'   // Extensions in filenames begin after the first dot
              },
            ],
          }
            
        },
        
        cssmin: {
            options: {
                 keepSpecialComments: 0
            },
            task: {
                files: [{
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'stylesheets/',      // Src matches are relative to this path.
                  src: ['**/*.css'], // Actual pattern(s) to match.
                  dest: 'dist/stylesheets/',   // Destination path prefix.
                  ext: '.css',   // Dest filepaths will have this extension.
                  extDot: 'first'   // Extensions in filenames begin after the first dot
              } ],
          }
        },
        autoprefixer: {
           task: {
                files: [{
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'dist/stylesheets/',      // Src matches are relative to this path.
                  src: ['**/*.css'], // Actual pattern(s) to match.
                  dest: 'dist/stylesheets/',   // Destination path prefix.
                  ext: '.css',   // Dest filepaths will have this extension.
                  extDot: 'first'   // Extensions in filenames begin after the first dot
              } ],
            },
        }
    });

    //注册任务
    grunt.registerTask('build', ['uglify', 'cssmin', 'autoprefixer']);//压缩全部相关资源文件

}
