// 导入express模块
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入解析formdata格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建multer的实例对象，通过dest属性指定文件的存放路径
const upload = multer({dest:path.join(__dirname, '../uploads')})

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章验证模块
const schema = require('../schema/article')

// 导入发布文章相关的处理函数
const article_handler = require('../router_handler/article')

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析FormData格式的表单数据
// 将文件类型的数据，解析并挂载到req.file属性中
// 将文本类型的数据，解析并挂载到req.body属性中
// 在当前路由中，先后使用了两个中间件：先使用multer解析表单数据，再使用expressJoi对解析过的表单数据进行验证
router.post('/add',upload.single('cover_img'), expressJoi(schema.add_article_schema), article_handler.addArticle)

module.exports = router