/**
 * 实现：书籍名称和下载连接收集
 * 如需下载请使用 node downloadBook.js
 */

const puppeteer = require('puppeteer')

const { fsWrite } = require('./utils')
// 目标：获取网站https://www.ituring.com.cn/所有电子书的链接地址与书名

// 进入网站，获取整个网站列表的页数
// 获取列表页的所有链接
// 进入每个电子书的详情页获取下载电子书的网盘地址
// 将获取的数据保存到book.json 文档里


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

    // 将延迟函数封装成 promise 对象
    function lcWait(milliseconds) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('成功执行延迟函数, 延迟: ' + milliseconds)
            }, milliseconds)
        })
    }

    // 1. 获取到页面总数数量
    async function getAllNum() {
        // 打开新页面标签
        const page = await browser.newPage();
        // 访问页面
        await page.goto(httpUrl, { waitUntil: 'networkidle0' });
        // 设置选择器获取总页数
        let pageNum = await page.$eval('.PagedList-pager .PagedList-skipToLast a', (element) => {
            // 拿到页总数
            return element.textContent
        })
        return pageNum
    }

    // 2. 获取当前页面的书名和跳转详情的链接地址
    async function pageList(num) {
        let pageListUrl = `https://www.ituring.com.cn/book?tab=book&sort=hot&page=${num}`;
        let page = await browser.newPage()
        // 访问列表页地址
        await page.goto(pageListUrl)
        let arrPage = await page.$$eval('.block-books li .book-img a', (elements) => {
            let arr = []
            elements.forEach((element, i) => {
                var obj = {
                    href: element.href,
                    title: element.title,
                }
                arr.push(obj)
            })
            return arr
        })

        // 通过获取的数组的地址和标题去请求书籍的详情页
        arrPage.forEach(async (pageObj, i) => {
            await lcWait(1000 * i)
            await getPageInfo(pageObj)
        })
    }


    // 3. 跳转至页面详情获取下载电子书链接地址
    async function getPageInfo(pageObj) {
        let page = await browser.newPage()

        // 跳转详情页
        await page.goto(pageObj.href)
        let eleA = await page.$$eval('.pull-right .sidenav-list .sidenav-major > ul > li', (elements) => {
            let arrObj = []
            elements.map((item, i) => {
                var temp = item.getElementsByTagName('a')[0].textContent.trim()
                var obj = {
                    // pageHref: pageObj.href,
                    // booksTitle: pageObj.title,
                    extName: temp.split('.')[temp.split('.').length - 1],
                    downloadHref: item.getElementsByTagName('a')[0].href,
                    downloadFileName: item.getElementsByTagName('a')[0].textContent.trim(),
                }
                arrObj.push(obj)
            })
            return arrObj
        })

        pageObj.downloadInfo = eleA[0] ? eleA : ['undefined']
        let formatContent = JSON.stringify(pageObj) + ','
        // 写入到文件并不是完整的json格式
        let temp = await fsWrite('./books.json', formatContent, pageObj)

    }
    // 拿到页面总数，因为是测试，这里只抓取一页
    let pageNumber = await getAllNum()
    await pageList(0)
})()