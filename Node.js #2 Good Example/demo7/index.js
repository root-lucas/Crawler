const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    let options = {
        defaultViewport: {
            width: 1400,
            height: 800
        },
        headless: false
    }

    const browser = await puppeteer.launch(options);  // headless default is true
    // 打开新页面标签
    const page = await browser.newPage();
    // 访问页面，networkidle0 页面无连接可跳转页面
    await page.goto('https://www.dytt8.net/index.htm', { waitUntil: 'networkidle0' });

    // // 用于监听到下面执行的浏览器控制台的 console 事件输出内容
    // await page.on('console', (elements) => {
    //     console.log('console event content', elements.text());
    // })

    // $$eval函数使得，我们得回调函数运行在模拟浏览器中，并且可以通过浏览器的方式进行输出
    let elements = await page.$$eval("#menu li a", (elements) => {
        // 模拟浏览器的控制台中输出信息
        // console.log(elements);
        // 创建一个数组去收集元素的信息，这里我们需要收集地址何内容
        let eleArr = []
        elements.forEach((item, i) => {
            // console.log(item.innerText);
            // 将浏览器的数据提取到本地
            if (item.getAttribute('href') !== '#') {
                var eleObj = {
                    href: item.getAttribute('href'),
                    text: item.innerText
                }
                eleArr.push(eleObj)
                // 模拟浏览器的控制台中输出信息
                console.log('========', eleObj);
            }
        })
        // 返回数据给eles
        return eleArr
    })

    // 新建第二个页面
    let gnPage = await browser.newPage()
    // 跳转链接
    await gnPage.goto(elements[3].href)

    console.log(elements);

    // 因为要看效果页面就不关闭了
    // await page.close();
    // await browser.close();
})()
