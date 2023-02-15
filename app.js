// 导入express模块
const express = require('express')
// 创建exress的服务器实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')
// 将cors注册为全局中间件
app.use(cors())
// 配置表单数据的中间件
app.use(express.urlencoded({ extended: false }))
// 声明一个全局中间件，为res对象挂载res.cc()函数，用于调用res.send()，向客户端响应处理失败的结果
app.use((req, res, next) => {
    // status = 0 为成功，status = 1 为失败；默认将status的值设置为1，方便处理失败的情况
    res.cc = (err, status = 1) => {
        res.send({
            // 状态
            status,
            // 状态描述，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 声明全局错误级别的中间件，捕获验证失败的错误，并把验证失败的结果响应给客户端
const joi = require('joi')
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 未知错误
    res.cc(err)
})


// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 调用app.listen方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})