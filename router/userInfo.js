// 导入express 
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要验证的规则对象
const schema = require('../schema/user')

// 导入用户信息处理函数
const userInfo_handler = require('../router_handler/userInfo')


// 获取用户的基本信息
router.get('/userInfo', userInfo_handler.getUserInfo)

// 更新用户的基本信息
router.post('/userInfo', expressJoi(schema.update_userInfo_schema), userInfo_handler.updateUserInfo)

// 重置密码的路由
router.post('/updatepwd', expressJoi(schema.update_password_schema), userInfo_handler.updatePassword)

// 更新用户头像的路由
router.post('/update/avatar', expressJoi(schema.update_avatar_schema), userInfo_handler.updateAvatar)



// 向外共享路由对象
module.exports = router