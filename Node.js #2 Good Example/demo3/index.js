/**
 * 目的：拿到电影标题和电影播放链接地址
 * 
 * 抓取地址：https://www.1905.com/vod/list/n_1/o1p1.html
 * 【不推荐使用】 通过正则匹配这种方式很麻烦还易出错
 */

let request = require('request')


// 根据电影链接获取电影的详细信息
function req(url) {
    return new Promise(function (resolve, reject) {
        request.get(url, function (err, response, body) {
            if (err) {
                reject(err)
            } else {
                // 返回页面的源代码
                // console.log(body);
                // console.log(response.statusCode);
                // response 因为登陆了的用户会返回cookie,方便请求会员的数据
                resolve({ response, body })
            }
        });
    })
}

// 获取起始页面的所有分类地址
async function getClassUrl() {
    let httpUrl = 'https://www.1905.com/vod/list/n_1/o1p1.html'
    let { response, body } = await req(httpUrl)
    let reg = /<p class="search-index-R">(.*?)<\/p>/igs
    // 解析html内容
    let result = reg.exec(body)[1]

    let reg1 = /<a href="(.*?)" (class="cur")?>(.*?)<\/a>/igs
    let arrClass = []
    let res;
    let i = 0
    while (res = reg1.exec(result)) {
        let obj = {
            url: res[1],
            className: res[3],
        }
        arrClass.push(obj)
        console.log(`正在抓取-----${res[3]}-----视频信息`);
        await lcWait(i++ * 5000)
        // 获取某标题电影信息
        await getMovies(res[1])
    }
    // console.log(arrClass);
}

// 将延迟函数封装成 promise 对象
function lcWait(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('成功执行延迟函数, 延迟: ' + milliseconds)
        }, milliseconds)
    })
}

// 通过分类，获取分类里的电影链接
async function getMovies(url) {
    let { response, body } = await req(url)
    let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)" title="(.*?)">(.*?)<\/a>/igs

    let res
    let arrList = []

    while (res = reg.exec(body)) {
        let obj = {
            url: res[1],
            className: res[2],
        }

        arrList.push(obj)
    }
    console.log(arrList);
}

getClassUrl()
