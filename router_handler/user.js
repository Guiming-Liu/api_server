/**
 * 在这里定义和用户注册、登录相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入bcryjs模块
const bcrypt = require('bcryptjs')

// 导入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

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
// 1.检测表单数据是否合法
exports.login = (req, res) => {
    // 2.根据用户名查询用户的数据
    // 2.1接收表单数据
    const userInfo = req.body
    // 2.2定义sql语句
    const sql = `select * from ev_users where username=?`
    // 2.3执行sql语句，查询用户的数据
    db.query(sql, userInfo.username, (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 执行sql语句成功，但查询到的数据条数不为1
        console.log(results.length);
        if(results.length !== 1) return res.cc('登录失败')

        // 3.判断用户输入的密码是否正确
        // 3.1拿着用户输入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        // 3.2如果对比的结果是false,则证明用户输入的密码是错的
        if(!compareResult) return res.cc('密码错误')

        // 4.登录成功，生成JWT的Token字符串
        // 4.1通过ES6的高级语法，快速剔除密码和头像的值
        // 剔除完毕后，user中只保留了用户的id, username, nickname, emil这四个属性的值
        const user = {...results[0], password: '', user_pic:''}
        // 4.2生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // 有效期为10小时
        })
        // 4.3将生成的Token字符串响应给客户端
        res.send({
            status:0,
            message:'登录成功',
            // 为了方便客户端使用Token，在服务器端直接拼接上Bearer的前缀
            token:'Bearer '+tokenStr
        })
    })
}