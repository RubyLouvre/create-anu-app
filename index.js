#!/usr/bin/env node
const readline = require('readline')
const json = require('./package.json')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cp = require('child_process')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)

const cliPath = process.cwd()

console.log('欢迎使用anu!!!!')
var args = process.argv.slice(2)
switch (args) {
  case '-h':
    console.log('输出答案')
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
      fse.copy(__dirname + '/anu-demo', pathName).then(() => {
        process.chdir(pathName)
        cp.exec('npm i', {cwd: pathName}, function (error, stdout, stderr) {
          if (error) {
            catchError(error)
          }else {
            console.log('当前执行路径', process.cwd(), pathName)
            let configuration = require(path.resolve(pathName, './webpack.config.js'))
            webpack(configuration, function (err, stats) {
              console.log('执行完webpack',err, stats)
            })
          /*
           cp.exec('webpack', {cwd: pathName}, function (error, stdout, stderr) {
             if (error) {
               catchError(error)
             }else {
               console.log('执行完webpack')
             }
           })
           */
          }
        }).on('close', function (code) {
          if (code !== 0) {
            console.log(`ps 进程退出码：${code}`)
          }else {
            catchError('搞定')
          }
        })
      })
        .catch(catchError)
    }
  })
}
function catchError (err) {
  if (err) return console.error(err)
}
