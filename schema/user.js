const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的校验规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的校验规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对req.body 中的数据进行验证
    body: {
        username,
        password
    }
}


// 定义id, nickname, email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
// 更新用户基本信息的验证规则对象
exports.update_userInfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}


// 重置密码的规则对象
exports.update_password_schema = {
    body: {
        // 使用password 这个规则，验证req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password)规则，验证req.body.newPwd
        // 解读：
        // 1.joi.ref('oldPwd')表示newPwd的值必须和oldPwd的值保持一致
        // 2.joi.not(joi.ref('oldPwd')) 表示newPwd的值不能等于oldPwd的值
        // 3. .concat(password)用于合并joi.not(joi.ref('oldPwd'))和password这两条验证规则
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 定义更新头像的验证规则
// dataUri()指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()
// 更新头像的验证规则对象
exports.update_avatar_schema = {
    body: {
        avatar
    }
}