#!/usr/bin/env node

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const json = require('./package.json')
const shell = require('shelljs');

let cliPath = process.cwd(), projectName, args = process.argv.slice(2);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).on('close', () => {
    buildProject(path.resolve(cliPath, projectName))
})

getAnswer.apply(null, args);

function getAnswer(a, b) {
    switch (a) {
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
            let ie = b == '--ie';
             projectName = a;
            if (!projectName) {
                rl.question('请输入项目名 ', getAnswer);
            } else {
                if (fs.existsSync(projectName)) {
                    rl.question('当前目录下已经存在此文件或文件夹名，请改一个新名字', getAnswer)
                } else {
                    rl.close()
                }
            }
            break
    }
}


function buildProject(pathName, supportIE) {
    shell.mkdir(pathName)
    console.log(`拷贝模板工程。。。`)
    shell.cp("-r", __dirname + '/anu-demo/.*', pathName)
    shell.cp("-r", __dirname + '/anu-demo/*', pathName)
    //  上面两个相当于
    //  require('fs-extra').copySync(__dirname + '/anu-demo/', pathName)
    console.log(`拷贝模板工程完成。。。`)
    shell.cd(pathName)
    console.log(`执行 yarn install。。。`)
    if (shell.exec('yarn').code !== 0) {
        shell.echo('yarn 安装失败');
        shell.exit(1);
    }
    if (shell.which('webpack')) {
        if (shell.exec('webpack').code !== 0) {
            shell.echo('webpack 安装失败');
            shell.exit(1);
        }
    } else {
        shell.echo('Sorry, please **yarn webpack**');
        shell.exit(1);
    }
    shell.exec('npm run start:dev')
    console.log("\x1b[36m%s\x1b[0m", "请在浏览器打开 http://localhost:8080")
}
