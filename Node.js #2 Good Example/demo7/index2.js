const puppeteer = require('puppeteer');
const fs = require('fs');


let options = {
    defaultViewport: {
        width: 1400,
        height: 800
    },
    headless: false
};

(async () => {

    const browser = await puppeteer.launch(options);  // headless default is true
    // 打开新页面
    const page = await browser.newPage();
    // 访问页面
    await page.goto('https://www.ygdy8.net/html/gndy/oumei/index.html', { waitUntil: 'networkidle0' });

    // 获取页面对象
    // page.$$eval() 常用于用于获取元素相关信息
    // page.$() 配合各种 ElementHandle 方法可以对获取的信息操作（但不能获取到详细元素相关信息）
    // let elementsHandle = await page.$$("#menu li a")
    // 通过点击页面的方式进行跳转与 page.goto不同
    // elementsHandle[2].click()

    // 获取搜索框，通过表单输入框进行搜索
    let inputEle = await page.$('.searchl .formhue')
    // 让光标聚焦到输入框
    await inputEle.focus()
    // 往输入框上输入内容
    // await page.keyboard.sendCharacter('小丑') 
    await page.keyboard.type('蝙蝠侠')    // 这个也可以实现
    // 由于点击搜索后弹出广告原因这里需要取消冒泡
    await page.$eval('.bd3rl > .search', (element) => {
        element.addEventListener('click', function (event) {
            // 阻止冒泡
            // IE
            // event.cancelBubble = true;
            // Chrome
            event.stopPropagation();
        })
    })
    // 点击按钮
    let btnEle = await page.$('.searchr input[name="Submit"]')
    btnEle.click()
    // await page.close();
    // await browser.close();
})()
