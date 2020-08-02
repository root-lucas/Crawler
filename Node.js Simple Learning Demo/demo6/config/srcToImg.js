const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async(src, dir) => {
    if(/\.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir);
    }else{
        await base64ToImg(src, dir);
    }
};

//如果是格式则: url => image
const urlToImg = promisify((url, dir, callback) => {
    const mod = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    const file = path.join(dir, `${Date.now()}${ext}`);

    mod.get(url, res => {
        //将文件写入至本地
        res.pipe(fs.createWriteStream(file))
        .on('finish', () => {
            callback();
            console.log(file);
        });
    });
});

//如果是base64格式则: base64 => image
const base64ToImg = async function (base64Str, dir) {

    //base64格式: data:image/jpeg;base64,/adadwdw
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);

    try {
        const ext = matches[1].split('/')[1].replace('jpeg','jpg');
        const file = path.join(dir, `${Date.now()}.${ext}`);
        
        //若检测链接为base64格式则将写入到本地文件为xxxx.jpg格式
        await writeFile(file, matches[2], "base64");
        console.log(file);
    } catch (ex) {
        console.log("非法 base64 字符串")
    }
}