/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入bcryjs模块
const bcrypt = require('bcryptjs')

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 1.检测表单数据是否合法 

    // 1.1判断用户名和密码是否为空
    // 接收表单数据
    const userInfo = req.body
    // 判断数据是否合法
    if (!userInfo.username || !userInfo.password) {
        // return res.send({ status: 1, message: '用户名和密码不能为空！' })
        return res.cc('用户名和密码不能为空！')
    }

    // 1.2检测用户名是否被占用
    // 定义sql语句
    const occupySql = `select * from ev_users where username=?`
    // 执行sql语句并根据结果判断用户名是否被占用
    db.query(occupySql, userInfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 用户名可用，继续后面的流程...

        // 1.3对密码进行加密处理
        // 对用户的密码进行bcrypt加密，返回值是加密之后的密码字符串
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        // 1.4插入新用户
        // 定义插入用户的sql语句
        const insertSql = `insert into ev_users set ?`
        // 调用db.query()执行SQL语句，插入新用户
        db.query(insertSql, { username: userInfo.username, password: userInfo.password }, (err, results) => {
            // 执行sql语句失败
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)          
            // 执行sql语句成功，但影响行不为1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            res.cc('注册成功！')
        })
    })


}

// 登录的处理函数
exports.login = (req, res) => {
    res.send('login ok')
}