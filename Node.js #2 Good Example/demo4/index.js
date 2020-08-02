/**
 * 目的：拿到各种标题类型表情包链接并下载至本地
 * 
 * 实现：
 * 1. 通过 axios 模块请求拿到页面 HTML 源码
 * 2. 使用 cheerio 模块 load 方法把 HTML 代码转换成一个 jQuery 对象来进行筛选信息操作(无需正则就能筛选信息)
 * 3. 使用 fs 模块通过流的形式将爬取到的表情包(图片)下载保存到本地电脑
 */

const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 获取html文档内容，内容的获取跟jquery语法一样
let httpUrl = 'https://www.doutula.com/article/list/?page=1'

// 避免封了本机 IP导致访问不了，可使用免费IP代理发送
let options = {
    proxy: {
        host: '60.255.151.81',
        port: 80,
        // 免费的代理是没有账号密码的
        // auth: { username: 'mikeymike', password: 'rapunz3l' }
    }
}

// 将延迟函数封装成 promise 对象，避免ip被封
function waitTime(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log('成功执行延迟函数, 延迟: ' + milliseconds);
            resolve('成功执行延迟函数, 延迟: ' + milliseconds)
        }, milliseconds)
    })
}

// 获取页面总数
async function getNum() {
    let res = await axios.get(httpUrl, options)
    let $ = cheerio.load(res.data)
    let btnLength = $('.pagination > li').length
    let allNum = $('.pagination li').eq(btnLength - 2).find('a').text()
    return allNum
}

async function spider() {
    let allPageNum = await getNum()

    // 判断 imgs 文件夹是否存在
    let folderName = 'imgs'
    fs.readdir(folderName, (err, exist) => {
        if (!exist) {
            console.log('没有找到文件夹,正在创建....');
            fs.mkdir(folderName, (err) => {
                if (err) throw err
                console.log('创建目录成功');
            })
        }
    })

    for (let i = 1; i <= allPageNum; i++) {
        console.log('延迟函数执行中......');
        await waitTime(i * 3000)
        getListPage(i)
    }
}

async function getListPage(pageNum) {
    let httpUrl = `https://www.doutula.com/article/list/?page=${pageNum}`
    // 1.首先获取页面数据
    let res = await axios.get(httpUrl, options)
    // 2.使用cheerio解析获取的内容
    let $ = cheerio.load(res.data)
    $('#home .col-sm-9 > a').each(async (i, element) => {
        // 必需加上 $ 符号,提取所有a标签内的 href 属性值
        let pageUrl = $(element).attr('href')
        let title = $(element).find('.random_title').text()
        let reg = /(.*?)\d/igs
        // 仅提取文字部分
        title = reg.exec(title)[1]
        console.log(title);

        // 根据图片类型生成文件夹目录
        fs.mkdir('./imgs/' + title, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('成功创建目录: ', './imgs/' + title);
            }
        })
        await waitTime(200)

        // 3.获取图片链接地址
        parsePage(pageUrl, title)
    })
}

async function parsePage(url, title) {
    let res = await axios.get(url, options)
    let $ = cheerio.load(res.data)
    $('.pic-content img').each((i, element) => {
        let imgUrl = $(element).attr('src')
        let extName = path.extname(imgUrl)
        // 图片写入到本地的路径和命名
        let imgPath = `./imgs/${title}/${title}-${i}${extName}`
        // 创建写入图片流
        let ws = fs.createWriteStream(imgPath)
        // 告诉服务器将数据以流的形式传给我
        axios.get(imgUrl, { responseType: 'stream', proxy: options.proxy }).then(function (res) {
            res.data.pipe(ws)
            console.log('图片加载完成：', imgUrl);
            // 关闭写入流
            res.data.on('close', function () {
                ws.close()
            })
        })
    })
}

spider()
