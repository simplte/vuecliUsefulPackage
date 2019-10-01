const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(chalk.green(`${message}`));
const successLog = message => console.log(chalk.blue(`${message}`));
const errorLog = message => console.log(chalk.red(`${message}`));
const {
    vueTemplate
} = require('./template');

const generateFile = (path, data) => {
    if (fs.existsSync(path)) {
        errorLog(`${path}文件已经存在了`)
        return;
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'utf8', err => {
            if (err) {
                errorLog(err.message)
                reject(err)
            } else {
                resolve(true);
            }
        })
    })
}

log('请输入想要生成在view文件夹下的组件页面名称');
let componentName = "";
process.stdin.on('data', async chunk => {
    const inputName = String(chunk).trim().toString();
    let componentVueName = resolve('../src/views', inputName);
    console.log(`componentVueName:${componentVueName}`)
    if (!componentVueName.endsWith('.vue')) {
        componentVueName += '.vue'
    }
    const componentDirectory = path.dirname(componentVueName);
    console.log(`componentDirectory:${componentDirectory}`)
    const hasComponentExists = fs.existsSync(componentVueName);
    if (hasComponentExists) {
        errorLog(`${inputName}页面组件已经存在，请重新输入`);
        return;
    } else {
        log(`正在生成 component目录${componentDirectory}`);
        await dotExistDirectoryCreate(componentDirectory)
    }
    try {
        if (inputName.includes('/')) {
            const inputArr = inputName.split('/');
            componentName = inputArr[inputArr.length - 1]
        } else {
            componentName = inputName
        }
        log(`正在生成vue文件${componentVueName}`);
        await generateFile(componentVueName, vueTemplate(componentName));
        successLog('生成成功')
    } catch (e) {
        errorLog(e.message)
    }
})

function dotExistDirectoryCreate(directory) {
    return new Promise((resolve) => {
        mkdirs(directory, function () {
            resolve(true)
        })
    })
}

function mkdirs(directory, callback) {
    console.log('文件夹：', directory);
    console.log('回调函数：', callback)
    var exists = fs.existsSync(directory);
    if (exists) {
        callback()
    } else {
        console.log('内层：', path.dirname(directory))
        mkdirs(path.dirname(directory), function () {
            fs.mkdirSync(directory);
            //directory: 1: D:\exitMongoDb\project\gitProject\git-vue-cli3\vue-cli3-project\src\views\intros\home
            //directory: 2: D:\exitMongoDb\project\gitProject\git-vue-cli3\vue-cli3-project\src\views\intros\
            console.log('内层回调函数：', callback)
            callback()
            console.log('内层callback：', callback)
        })
    }
}


/*
    判断路径是否存在  
        1：存在直接结束
        2：不存在通过path.dirname获取当前路径的上一级目录继续调用当前方法，
            不过方法的第二个参数中多了一个 包含了以当前路径为参数的方法fs.mkdirSyns(directory),
        以此类推一直到路径存在了，执行callback（）方法，
        如果是二级不存在目录那么
        callback=
             fs.mkdirSync( D:\exitMongoDb\project\gitProject\git-vue-cli3\vue-cli3-project\src\views\intros\);
             callback=
                fs.mkdirSync( D:\exitMongoDb\project\gitProject\git-vue-cli3\vue-cli3-project\src\views\intros\home)
                callback=
                     function () {
                        resolve(true)
                    }

*/