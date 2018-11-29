"use strict"

let User = require("../model").user;

let fn_signup = async (ctx, next) => {
    let data = ctx.request.body;
    try {
        let date = new Date();
        let regdate = date.toLocaleDateString().replace("/", "-");
        await User.create({
            username: data.username,
            password: data.password,
            motto: "record,comment and share",
            regdate: regdate
        },{logging:null}
        );
        ctx.body = `新用户 ${data.username} 已注册成功，接下来就可以登陆啦~`;
    } catch (err) {
        console.log(err);
        ctx.body = `新用户 ${data.username} 注册失败，error: ${err.message}`;
    }
    await next();
};

module.exports = {
    "post /signup": fn_signup
}