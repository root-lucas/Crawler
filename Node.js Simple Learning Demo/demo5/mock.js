const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 250});  
  const page = await browser.newPage();
  await page.goto('https://www.imooc.com/user/newlogin', {waitUntil: 'networkidle2'});

  await page.type('input.ipt-email',"abcABC.123");
  
  await page.type('input.ipt-pwd','password');
  await page.click('.moco-btn-red');
  await page.waitFor(5000);
  await browser.close();
})();