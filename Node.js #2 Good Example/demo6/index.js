
/**
 * 简单的使用 puppeteer API
 */
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });  // headless default is true
    const page = await browser.newPage();
    // 模拟移动设备打开页面
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
    await page.setViewport({ width: 375, height: 812 });
    // 跳转至指定链接
    await page.goto('https://baidu.com');

    await page.type('#index-kw', "hello", { delay: 1000 })
    await page.click('#index-bn');
    // 下面俩行能替代上面俩行
    // await page.focus('#index-kw');        //找到焦点(相当于鼠标点击选中页面搜索框)
    // await page.keyboard.sendCharacter("hello");  //输入搜索关键字

    // 页面全部加载完成，没有他截图则是空白
    await page.waitForNavigation()

    // 将页面截屏保存至本地
    await page.screenshot({ path: 'picture.png' });
    // 将页面保存为 pdf 文档(目前仅支持无头模式)
    await page.pdf({ path: 'filename.pdf', format: 'A4' });

    // 查看网页源代码
    let htmlContent = await page.content()
    fs.writeFile('page.html', htmlContent, err => console.log('HTML saved'))

    // 关闭页面
    await page.close()
    // 关闭浏览器
    await browser.close();
})();