/**
 * 在这里定义和用户信息相关的路由处理函数，供 /router/userInfo.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入bcryptjs模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义sql语句，根据用户的id进行查询，为防止用户的密码泄露，不查询password字段
    const sql = `select id, username, nickname, email, user_pic from ev_users where id =?`
    // 执行sql语句
    db.query(sql, req.user.id, (err, results) => {
        // 1.执行sql语句失败
        if (err) return res.cc(err)
        // 2.执行sql语句成功，但查询的数据条数不等于1
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 3.获取用户信息成功，将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义sql语句
    const sql = `update ev_users set ? where id=?`
    // 执行sql语句并传参
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功，但影响行数不为1
        console.log(results);
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户基本信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // 1.根据id，查询用户是否存在
    // 定义sql语句
    const sql = `select * from ev_users where id=?`
    // 执行SQL语句，查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功，但查询条数不为1
        if (results.length !== 1) return res.cc('用户不存在！')

        // 2.判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        // 3.对新密码进行bcrypt加密后，更新到数据库中
        // 定义更新密码的sql语句
        const sql = `update ev_users set password=? where id =?`
        // 对新密码进行bcrypt加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行sql语句，根据id更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err)
            // 执行sql语句成功，但影响行数不为1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            // 更新密码成功
            return res.cc('更新密码成功', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 1.定义更新用户头像的sql语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 2.执行sql语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功，但影响行数不为1
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        // 更新头像成功
        return res.cc('更新头像成功', 0)
    })
}
