/**
 * 目标：下载音乐文件至本地
 * 1.获取音乐相关的信息，通过音乐相关的信息获取相关 mp3 地址
 * 2.如何获取大量的音乐信息，通过获取音乐列表
 * 3.通过音乐的分类页，获取音乐列表
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function getPage(num) {
    let httpUrl = `https://www.app-echo.com/api/recommend/sound-day?page=${num}`

    // 判断 mp3 文件夹是否存在
    let folderName = 'mp3'
    fs.readdir(folderName, (err, exist) => {
        if (!exist) {
            console.log('没有找到文件夹,正在创建....');
            fs.mkdir(folderName, (err) => {
                if (err) throw err
                console.log('创建目录成功');
            })
        }
    })

    let res = await axios.get(httpUrl)
    // console.log(res.data);
    res.data.list.forEach((item, i) => {
        let title = item.sound.name
        let mp3Url = item.sound.source
        let fileName = path.parse(mp3Url).name

        let content = `${title} ------- ${mp3Url}\n`
        fs.writeFile('music.txt', content, { flag: 'a' }, () => {
            console.log('写入完成: ', title);
        })
        // console.log(title);
        // console.log(mp3Url);
        download(mp3Url, title)
    })
}

async function download(mp3Url, fileName) {
    // 注意必需加 await 异步操作，否则下载空文件
    let res = await axios.get(mp3Url, { responseType: 'stream' })
    let ws = fs.createWriteStream(`./mp3/${fileName}.mp3`)
    res.data.pipe(ws)
    res.data.on('close', () => {
        ws.close()
    })
}

// 这是是测试, 你可根据需求遍历 + 延迟函数请求大量的文件
getPage(1)