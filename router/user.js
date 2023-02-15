const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数
const userHandler = require('../router_handler/user')

// 1.导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2.导入需要的验证规则
const {reg_login_schema} = require('../schema/user')

// 注册新用户
// 3.在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1数据验证通过后，会把这次请求流转到后面的路由处理函数
// 3.2数据验证失败后，终止后续代码的执行，并抛出一个全局的Error错误，进入全局错误级别中间件中进行处理

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

// 将路由共享出去
module.exports = router