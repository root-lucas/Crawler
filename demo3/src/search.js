const devices = require('puppeteer/DeviceDescriptors');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(devices['iPhone X']);
  await page.goto('http://www.baidu.com');
  // await page.focus('#index-kw');
  await page.type('#index-kw', "root", {delay: 100})
  await page.click('#index-bn');
  await page.waitFor(2000); 
  await page.screenshot({
    path: "search.png"
    // path:"example.png"
  });

  await browser.close();
})();

