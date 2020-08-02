const puppeteer = require("puppeteer");
const { savePic } = require('./config/default.js');
const srcToImg = require('./config/srcToImg.js');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://image.baidu.com");
    console.log('go to https://image.baidu.com');

    await page.setViewport({
        width: 1920,
        height: 1080
    });
    
    console.log('reset viewport');
    await page.focus('#kw');        //找到焦点(相当于鼠标点击选中页面搜索框)
    await page.keyboard.sendCharacter("单身狗");  //输入搜索关键字
    await page.click("span.s_search");  //模拟搜索点击按钮
    console.log('go to search list');

    //加载页面触发load事件
    page.on('load', async () => {
        console.log('page loading done,start fetch...');

        const srcs = await page.evaluate(() => {
            //获取所有图片链接地址转为数组保存
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });

        console.log(`get ${srcs.length} images, start download...`);

        //遍历保存图片
        srcs.forEach(async (src) => {
            //sleep
            await page.waitFor(200);  //单位是毫秒
            await srcToImg(src, savePic);
        });

        console.log("finished");
        await browser.close();
    });
})()