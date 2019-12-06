const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.qq.com/", {waitUntil: 'networkidle2'});  //networkidle2��ʾֻ��2����������ʱ����������500�����
    await page.waitFor(3000);  //3��
    await page.pdf({path: 'page.pdf', format: 'A4'});
    
    await browser.close();
})();