/**
 * 实现：这是一个简单的连接测试
 * 【注意】 需打开本地开启 MongoDB数据库服务再执行
 */

let MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017'

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err
    // 连接到名为 cat-shop 的数据库
    let dbo = db.db('cat-shop')
    // 要查找匹配的信息对象
    let myObj = { onSale: false }
    // 指定要查询的数据表 products 信息
    // findOne insert update deleteOne  findOneAndDelete
    dbo.collection("products").findOne(myObj, function (err, res) {
        if (err) throw err
        console.log('连接查找 products 表成功', res);
        db.close()
    })
})
