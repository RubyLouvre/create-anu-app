#!/usr/bin/env node
const readline = require('readline')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cp = require('child_process')
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
const cliPath = process.cwd()
const json = require('./package.json')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function catchError (err) {
  if (err) return console.error(err)
}

console.log('欢迎使用anu!!!!')
var args = process.argv.slice(2)
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
    var projectName, ie = args[1] == '--ie'
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

function buildProject (pathName, supportIE) {

  fse.ensureDir(pathName, function (error) {
    if (error) {
      catchError(error)
    } else {
      console.log(`拷贝模板工程。。。`)
      // 将模板工程anu-demo, 复制到新项目中
      fse.copy(__dirname + '/anu-demo', pathName).then(() => {
        process.chdir(pathName)
        // 执行npm i
        console.log(`执行 npm i。。。`)
        cp.exec('npm i', {cwd: pathName}, function (error, stdout, stderr) {
          if (error) {
            catchError(error)
          }else {
            // 执行 webpack 
            console.log(`执行 webpack。。。`)
            let configuration = require(path.resolve(pathName, './webpack.config.js'))
            webpack(configuration, function (err, stats) {
              console.log('完工，打开浏览器')
            })
          }
        }).on('close', function (code) {
          if (code !== 0) {
            console.log(`ps 进程退出码：${code}`)
          }
        })
      })
        .catch(catchError)
    }
  })
}
