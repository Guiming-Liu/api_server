/**
 * 在这里定义和发布文章相关的路由处理函数，供 /router/article.js 模块进行调用
 */

// 导入处理路径的path核心模块
const path = require('path')

// 导入数据库操作模块
const db = require('../db/index')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.filename !== 'cover_img') return res.cc('文章封面是必选参数！')

    // 1.整理要插入数据库的文章信息对象
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章的作者Id
        author_id: req.user.id
    }

    // 2.定义发布文章的sql语句
    const sql = `insert into ev_articles set ?`

    // 3.执行sql语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行sql失败
        if (err) return res.cc(err)
        // 执行sql成功，但影响行数不为1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        // 发布文章成功
        res.cc('发布文章成功！', 0)
    })
}