const devices = require('puppeteer/DeviceDescriptors')
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(devices['iPhone X']);  //模拟iPhone X设备打开页面
  await page.goto('http://www.baidu.com');
  
  await page.screenshot({
    path: `mobilescreen.png`
  });

  await browser.close();
})();

