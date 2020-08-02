/**
 * 实现：抓取英雄联盟 json 数据并保存到本地 mongodb 数据库中
 * 官网地址 https://lol.qq.com/data/info-heros.shtml 
 */

let axios = require('axios')
let MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/'

// 设置insertManyPromise函数
function insertMany(collection, arr) {
    return new Promise((resolve, reject) => {
        // let MongoClient = require('mongodb').MongoClient
        // let url = 'mongodb://localhost:27017/'
        // 连接数据库
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err
            // 连接指定数据库名
            let dbo = db.db('heroList')
            // 将数据插入到collections表中,没有则自动创建
            dbo.collection(collection).insertMany(arr, function (err, res) {
                if (err) reject(err)
                console.log('插入文档数量为：', res.insertedCount);
                // 注意是关闭数据库db连接而不是关闭数据表dbo
                db.close()
                resolve()
            })
        })
    })
}

// 设置insertOnePromise函数
function insertOne(collection, obj) {
    return new Promise((resolve, reject) => {
        // let MongoClient = require('mongodb').MongoClient
        // let url = 'mongodb://localhost:27017/'
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err
            let dbo = db.db('heroList')
            dbo.collection(collection).insertOne(obj, function (err, res) {
                if (err) reject(err)
                console.log('文档插入成功');
                db.close()
                resolve()
            })
        })
    })
}

// 获取所有英雄联盟人物列表信息, 并存入数据库
async function getHeroList() {
    let httpUrl = 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js'
    let result = await axios.get(httpUrl)
    console.log(result.data.hero);
    await insertMany('herolist', result.data.hero)
    return result.data.hero
}
// getHeroList()

// 获取英雄详细信息内容, 并存入数据库
async function getHero(heroid) {
    let httpUrl = `https://game.gtimg.cn/images/lol/act/img/js/hero/${heroid}.js`
    let result = await axios.get(httpUrl)
    await insertOne('heroinfo', result.data.hero)
    return result.data
}

// 将延迟函数封装成 promise 对象
function lcWait(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('成功执行延迟函数, 延迟: ' + milliseconds)
        }, milliseconds)
    })
}

// 1. 定义主函数，先获取所有英雄列表，并循环英雄列表将所有英雄列表详情内容载入
// async function run() {
//     let herolist = await getHeroList()  // herolist数据为数组格式
//     // console.log('====', herolist);
//     await herolist.reduce(async (prev, item, i) => {
//         // console.log('====', item);
//         await prev
//         return new Promise(async (resolve, reject) => {
//             await getHero(item.heroId)
//             resolve()
//         })
//     }, Promise.resolve())  // reduce 初始类型
// }

// 2. 推荐使用这个：避免请求超时，配合延迟函数
async function run() {
    let herolist = await getHeroList()
    herolist.map(async (item, index) => {
        await lcWait(200 * index)
        console.log('执行中');
        await getHero(item.heroId)
    })
}

run()