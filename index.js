#!/usr/bin/env node

const readline = require('readline');
const json = require('./package.json');
const fs = require('fs');
const fse = require('fs-extra');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("欢迎使用anu!!!!")
var args = process.argv.slice(2)
switch (args) {
    case "-h":
        console.log("输出答案")
        break
    case "-v":
        console.log("当前版本是" + json.version)
        break
    default:
        var projectName, ie = args[1] == "--ie"
        if (!args[0]) {
            rl.setPrompt("请输入项目名")
            rl.prompt()
            rl.on('line', (line) => {
                if (fs.existsSync(line.trim())) {
                    console.log("当前目录下已经存在此文件或文件夹名，请改一个新名字")
                    rl.prompt();
                } else {
                    projectName = line.trim()
                    rl.close();
                }
            }).on('close', () => {
                buildProject(projectName, ie)
                process.exit(0);
            });
        } else {
            buildProject(args[0], ie)
        }
        break
}

function buildProject(projectName, supportIE) {
    fse.ensureDir(projectName, function (e) {
        if (e) {
            console.log(e)
        } else {
            console.log(`创建${projectName}目录成功！`)
        }
    })
}
