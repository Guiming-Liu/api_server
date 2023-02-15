// 导入express模块
import express from 'express'
// 创建exress的服务器实例
const app = express()

// write your code here...


// 调用app.listen方法，指定端口号并启动web服务器
app.listen(3007,function() {
    console.log('api server running at http://127.0.0.1:3007')
})