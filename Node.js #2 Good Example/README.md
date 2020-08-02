## Usage

```js
// 安装依赖
yarn add

// 编译执行
cd demo{num}
node index.js
```

## intro

-   让 http 请求变的更加简单(获取网页内容)--常用模块：request, axios, http, superagent
-   普通网站爬取数据(筛选网页内容)--cheerio
-   SPA 页面爬取--puppeteer
-   输出或存储信息（console\fs\mongodb\mysql 等）

> // 参考 https://juejin.im/post/5d020bf0e51d455d877e0d20

## demo1

简单的 node 连接 mongodb 测试

## demo2

抓取[英雄联盟官网](https://lol.qq.com/data/info-heros.shtml)

**目的：** 拿到英雄联盟所有人物详细信息保存到数据库

**实现：** 通过控制台拿到 XHR 文件链接, 使用 axios 请求英雄联盟人物的 json 格式的数据并保存到本地 mongodb 数据库中

## demo3

抓取[1905 电影网](https://www.1905.com/vod/list/n_1/o1p1.html)

**目的：** 拿到电影标题和电影播放链接地址

**实现思路：** 通过 request 模块请求电影网站源码, 使用正则表达式对信息进行筛选【不推荐】信息

> request 模块拿到的是网页源码的内容，有些隐蔽的内容(前端渲染的)爬取不到，比如漫画网的图片

## demo4

抓取[斗图啦官网](https://www.doutula.com/article/list/?page=1)

**目的：** 将表情包按标题分类文件夹下载到本地

**实现：**

1. 通过 axios 模块通过代理 IP 来请求拿到页面 HTML 源码
2. 使用 cheerio 模块 load 方法把 HTML 代码转换成一个 jQuery 对象来进行筛选信息操作(无需正则就能筛选信息)
3. 使用 fs 模块通过流的形式将爬取到的表情包(图片)下载保存到本地电脑

**推荐：** 强烈推荐获取免费的代理 IP 网站：https://ip.jiangxianli.com/?page=1

## demo5

抓取[echo 音乐官网](https://www.app-echo.com/)

**目的：** 下载 mp3 音乐文件至本地

**实现：**

1. 获取音乐相关的信息，通过音乐相关的信息获取相关 mp3 地址
2. 如何获取大量的音乐信息，通过获取音乐列表
3. 通过音乐的分类页，获取音乐列表

> 使用 axios 爬取 json 格式文件, 通过请求服务器的 mp3 文件链接将音乐文件流下载保存到本地

## demo6

简单使用 puppeteer API

可[参考手册 1: 推荐入门](https://www.qikegu.com/docs/4525)
可[参考手册 2：官网查找](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

## demo7

设置有头模式 puppeteer 来运行浏览器

```js
// 俩者的使用: 前者用户操作信息，后者用户获取信息

// 获取信息后操作
await page.$()
// $$eval函数使得，我们得回调函数运行在模拟浏览器中，并且可以通过浏览器的方式进行输出
await page.$eval('a') // 拿到<a href='xxx'> </a>后可通过getElementById().href获取详细数据
```

## demo8

抓取[电子书官网](https://www.ituring.com.cn/book?tab=book&sort=hot&page=0)

**目的：** 使用 puppeteer 下载电子书到本地

**实现：**

1. 使用 puppeteer 的 `goto` 方法进行页面源码请求(代替了前面的 request,http)
2. 使用 puppeteer 的 `$$eval` 方法进行页面数据筛选(代替了前面的 cheerio)
3. 将需要收集的电子书数据保存至本地 `books.json` 文件里
4. 使用 axios 请求将电子书文档以流的方式下载至本地
