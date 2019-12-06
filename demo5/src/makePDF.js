const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.qq.com/", {waitUntil: 'networkidle2'});  //networkidle2表示只有2个网络连接时触发（至少500毫秒后）
    await page.waitFor(3000);  //3秒
    await page.pdf({path: 'page.pdf', format: 'A4'});
    
    await browser.close();
})();