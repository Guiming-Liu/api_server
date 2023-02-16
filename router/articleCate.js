// 导入express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入文章分类的处理函数
const article_handler = require('../router_handler/articleCate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const schema = require('../schema/articleCate')

// 获取文章分类的列表数据路由
router.get('/cates', article_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', expressJoi(schema.add_cate_schema), article_handler.addArticleCates)

// 删除文章分类的路由
router.get('/deletecate/:id', expressJoi(schema.delete_cate_schema), article_handler.deleteCateById)

// 根据ID获取文章分类的路由
router.get('/cates/:id', expressJoi(schema.get_cate_schema), article_handler.getArticleCateById)

// 更新文章分类的路由
router.post('/updatecate',expressJoi(schema.update_cate_schema), article_handler.updateCateById)

// 向外共享路由对象
module.exports = router