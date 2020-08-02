/**
 * 目的：将 books.json 文件里收集的电子书资料进行下载
 */

const puppeteer = require('puppeteer')
const axios = require('axios')
const fs = require('fs')
const { fsRead } = require('./utils')

let debugOptions = {
    defaultViewport: {
        width: 1400,
        height: 800
    },
    headless: false,
    slowMo: 250
};

let options = { headless: true };

let httpUrl = 'https://www.ituring.com.cn/book?tab=book&sort=hot&page=0';

(async () => {

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // 将延迟函数封装成 promise 对象
    function lcWait(milliseconds) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('成功执行延迟函数, 延迟: ' + milliseconds)
            }, milliseconds)
        })
    }

    async function bookLinkPage(linkUrl, fileName, fileExtName, title) {
        // let page = await browser.newPage()
        // await page.goto(linkUrl)
        // page.on('requestfinished', (req) => {
        //    console.log('电子书下载完成了 = ', req.url());
        // }) 

        // 根据图片类型生成文件夹目录
        fs.mkdir('./books/' + title, (err) => {
            if (err) {
                console.log('文件夹已经存在无需重复创建');
            } else {
                console.log('成功创建目录: ', './books/' + title);
            }
        })

        let res = await axios.get(linkUrl, { responseType: 'stream' })
        let ws = fs.createWriteStream(`./books/${title}/${fileName}`)
        res.data.pipe(ws)

        res.data.on('close', () => {
            console.log('下载已完成: ', fileName);
            ws.close()
        })
    }

    async function parseText() {
        let textContent = await fsRead('./books.json')
        // 必需删除文件字符串内容的最后一个字符，否则报错
        textContent = textContent.substr(0, textContent.length - 1)
        textContent = '[' + textContent + ']'
        textContent = JSON.parse(textContent)
        return textContent
    }


    let ArrData = await parseText()

    // 判断 imgs 文件夹是否存在
    let folderName = './books'
    fs.readdir(folderName, (err, exist) => {
        if (!exist) {
            console.log('没有找到根文件夹 ./books, 正在创建....');
            fs.mkdir(folderName, (err) => {
                console.log('创建根文件夹 ./books 成功' + '\n' + '\n');
            })
        }
    })

    ArrData.forEach(async (item, i) => {
        // console.log(item.downloadInfo);
        if (item.downloadInfo[0] != 'undefined') {
            var temp = item.downloadInfo.filter((data, i) => data)
            temp.forEach(async (downloadInfo, i) => {
                await lcWait(i * 5000)
                await bookLinkPage(downloadInfo.downloadHref, downloadInfo.downloadFileName, downloadInfo.extName, item.title)
            })
        }
    })

    // 下载完成后自动关闭
    await page.close()
    await browser.close()
})()