/*
 * @Author: renhhh
 * @Date: 2020-04-09 13:12:27
 * @Description: 
 */
const mongoose = require('mongoose');
// 导入 bcrypt
const bcrypt = require('bcrypt')
// 引入joi莫开
const Joi = require('joi');
// 集合规则
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        // 保证邮箱地址在插入数据库时不重复
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // admin 
    // normal
    role: {
        type: String,
        required: true
    },
    // 1 启用状态
    // 0 禁用状态
    state: {
        type: Number,
        default: 0
    }
})

// 创建集合
const User = mongoose.model('User',userSchema)

async function createUser(){
    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash('123456',salt)
    const user = await User.create({
        username: 'iteheima',
        email:'itheima@itcast.cn',
        password:pass,
        role: 'admin',
        state: 0
    }).then( () => {
        console.log('用户创建成功');
    }).catch( () => {
        console.log('用户创建失败');
    })
}
// createUser()

// 验证用户信息
const validateUser = user => {
    // 定义对象的验证规则
    const schema = {
        username: Joi.string().min(2).max(12).required().error(new Error('用户名不符合验证规则')),
        email: Joi.string().email(),
        password: Joi.string().required().error(new Error('密码不符合验证规则')),
        role: Joi.string().valid('normal','admin').required().error(new Error('角色值非法')),
        state: Joi.number().valid(0,1).required().error(new Error('状态值非法'))
    }
    return  Joi.validate(user,schema)
}

// 将用户集合做为模块成员进行导出
module.exports = {
    User,
    validateUser
};