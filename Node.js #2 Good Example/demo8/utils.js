let fs = require('fs')

function fsRead(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { flag: 'r', encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function fsWrite(path, content, pageObj) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, { flag: 'a', encoding: 'utf-8' }, (err) => {
            if (err) {
                reject(err)
            } else {
                console.log('已将书籍信息下载路径写入至 books.json：', pageObj.title);
                resolve()
            }
        })
    })
}

module.exports = {
    fsRead,
    fsWrite
}