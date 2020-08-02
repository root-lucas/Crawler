const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless:false       //默认为true表示无头浏览器(即无界面浏览器模式)
    });

    const page = await browser.newPage();
    await page.goto('https://wwww.baidu.com');
    await page.screenshot({
        path: "screenshot.png"
    });

    await browser.close();
})()