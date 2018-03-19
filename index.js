#!/usr/bin/env node
const readline = require('readline')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cp = require('child_process')
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
const cliPath = process.cwd()
const json = require('./package.json')
const WebpackDevServer = require("webpack-dev-server");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function catchError(err) {
  if (err) return console.error(err)
}

console.log('欢迎使用anu!!!!')
let args = process.argv.slice(2)
switch (args) {
  case '-h':
    console.log(`
      -h  提问
      -v  版本号
      projectName --ie  输入项目名，及可选的旧式IE支持，正式建立项目
    `)
    break
  case '-v':
    console.log('当前版本是' + json.version)
    break
  default:
    let projectName, ie = args[1] == '--ie'
    if (!args[0]) {
      rl.setPrompt('请输入项目名')
      rl.prompt()
      rl.on('line', (line) => {
        if (fs.existsSync(line.trim())) {
          console.log('当前目录下已经存在此文件或文件夹名，请改一个新名字')
          rl.prompt()
        } else {
          projectName = line.trim()
          rl.close()
        }
      }).on('close', () => {
        console.log(`创建${projectName}目录。。。`)
        buildProject(path.resolve(cliPath, projectName), ie)
        process.exit(0)
      })
    } else {
      buildProject(path.resolve(cliPath, args[0]), ie)
    }
    break
}

function buildProject(pathName, supportIE) {

  fse.ensureDir(pathName, function (error) {
    if (error) {
      catchError(error)
    } else {
      console.log(`拷贝模板工程。。。`)
      // 将模板工程anu-demo, 复制到新项目中
      fse.copy(__dirname + '/anu-demo', pathName).then(() => {
        process.chdir(pathName)
        // 执行npm i
        console.log(`执行 yarn install。。。`)
        let npm = cp.exec('yarn', { cwd: pathName, stdio: "inherit" }, function (error, stdout, stderr) {
          if (error) {
            catchError(error)
          } else {
            // 执行 webpack 
            console.log(`执行 webpack。。。`)
            let configuration = require(path.resolve(pathName, './webpack.config.js'))
            let compiler = webpack(configuration, catchError)
            let server = new WebpackDevServer(compiler, {
              // webpack-dev-server options

            //   contentBase: "http://localhost/",
              // Can also be an array, or: contentBase: "http://localhost/",

              hot: true,
              // Enable special support for Hot Module Replacement
              // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
              // Use "webpack/hot/dev-server" as additional module in your entry point
              // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does. 

              // Set this as true if you want to access dev server from arbitrary url.
              // This is handy if you are using a html5 router.
              historyApiFallback: false,

              // Set this if you want to enable gzip compression for assets
              compress: true,

              // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
              // Use "**" to proxy all paths to the specified server.
              // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
              // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    

              // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
              staticOptions: {
              },

              // webpack-dev-middleware options
              quiet: false,
              noInfo: false,
              lazy: true,
              filename: "bundle.js",
              watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
              },
              // It's a required option.
              publicPath: "/assets/",
              headers: { "X-Custom-Header": "yes" },
              stats: { colors: true }
            });
            
            server.listen(8080, "localhost", function() {
              console.log("\x1b[36m%s\x1b[0m", "请在浏览器打开 http://localhost:8080")
            });



          }
        })
        npm.stdout.on("data", function (data) {
          console.log("\x1b[35m%s\x1b[0m", data)
        })
        npm.on('close', function (code) {
          if (code !== 0) {
            console.log(`ps 进程退出码：${code}`)
          }
        })
      })
        .catch(catchError)
    }
  })
}
