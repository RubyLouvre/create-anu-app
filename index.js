#!/usr/bin/env node
const readline = require('readline');
const json = require('./package.json');
const fs = require('fs');
const fse = require('fs-extra');
const Promise2 = require("bluebird");
const path = require('path')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const webpack = require('webpack'); //访问 webpack 运行时(runtime)
const cliPath = process.cwd();

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
                buildProject(path.resolve(cliPath, projectName), ie)
                process.exit(0);
            });
        } else {
            buildProject(path.resolve(cliPath, args[0]), ie)
        }
        break
}

function buildProject(projectName, supportIE) {
    fse.ensureDir(projectName, function (e) {
        if (e) {
            console.log(e)
        } else {
            console.log('复制大量依赖包，请等待....');
            generateStructure("anu-demo", projectName)
                .then(() => {
                    callWebpack(projectName)
                })
                .catch(function (err) {
                    if (err) return console.error(err)
                });
            generateStructure("node_modules", projectName + "/node_modules")
                .then(() => {
                    callWebpack(projectName)
                })
                .catch(function (err) {
                    if (err) return console.error(err, 2)
                })

        }
    })

}
var i = 0
function callWebpack(projectName) {
    i++
    if (i === 2) {

        let configuration = require(path.resolve(projectName ,'./webpack.config.js'));
        console.log('config', configuration)
        let compiler = webpack(configuration);
        //compiler.apply(new webpack.ProgressPlugin());

        compiler.run(function (err, stats) {
            console.log("执行完webpack")
        });
        
    }
}

function generateStructure(demoDir, project) {
    console.log(__dirname, "复制。。。。。")
    return Promise2.promisifyAll(fse).copyAsync(__dirname + '/' + demoDir,
        project, { clobber: true })
}


