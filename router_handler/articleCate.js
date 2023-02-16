/**
 * 在这里定义和文分类相关的路由处理函数，供 /router/articleCate.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 1. 定义sql语句
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为0，表示没有被标记删除
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    
    // 2.执行sql语句
    db.query(sql, (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 执行sql语句成功
        res.send({
            status:0,
            message: '获取文章分类列表成功',
            data: results
        })
    })
}

// 新增文章分类列表的处理函数
exports.addArticleCates = (req, res) => {
    // 1. 定义查重的sql语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    // 2. 执行sql语句，进行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 分类名称和分类别名都被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！') 
        // 分类名称或分类别名被占用
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 3. 实现新增文章分类的功能
        // 定义新增文章分类的sql语句
        const sql = `insert into ev_article_cate set ?`
        // 执行sql语句
        db.query(sql, req.body, (err, results) => {
            // sql语句执行失败
            if(err) return res.cc(err)
            // sql语句执行成功，但影响行数不为1
            if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 定义删除文章分类的sql语句
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    // 执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 执行sql语句成功，但影响条数不为1
        if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        // 删除文章分类成功
        res.cc('删除文章分类成功!', 0)
    })
}

// 根据ID获取文章分类的处理函数
exports.getArticleCateById = (req, res) => {
    // 定义根据ID获取文章分类的sql语句
    const sql = `select * from ev_article_cate where id=?`
    // 执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql失败
        if(err) return res.cc(err)
        // 执行sql成功，但没有查询到任何数据
        if(results.length !== 1) return res.cc('获取文章分类数据失败！')
        // 执行sql成功，把数据响应给客户端
        res.send({
            status:0,
            message: '获取文章分类数据成功！',
            data: results[0]
        })
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req,res) => {
    // 1.定义查重的sql语句
    // 定义查询分类名称与分类别名是否被占用的sql语句
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    // 2.执行sql查重操作
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 分类名称 和 分类别名 都被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if(results.length ===1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if(results.length ===1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if(results.length ===1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        const sql = `update ev_article_cate set ? where Id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行sql语句失败
            if(err) return res.cc(err)
            // 执行sql语句成功，但影响行数不为1
            console.log(results)
            if(results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            // 更新文章分类成功
            res.cc('更新文章分类成功', 0)
        })
    })
}