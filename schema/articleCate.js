// 导入定义验证规则的模块
const joi = require('joi')

// 定义分类名称和分类别名的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 校验规则对象 - 添加分类
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 定义分类ID的校验规则
const id = joi.number().integer().min(1).required()
// 校验规则对象 - 删除分类
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 校验规则对象 - 根据ID获取文章分类
exports.get_cate_schema = {
    params: {
        id
    }
}

// 校验规则对象 - 根据ID获取文章分类
exports.update_cate_schema = {
    body: {
        Id:id,
        name,
        alias
    }
}