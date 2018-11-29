let User = require("../model").user;
let Record = require("../model").record;
let Movie = require("../model").movie;
let Tag = require("../model").tag;

let fn_login = async (ctx, next) => {
    let include = [{
        model: Record,
        include: [{
            model:Movie,
            include:[Tag]
            }]
    }];
    let user = await User.findOne({
        where: {
            username: ctx.request.body.username,
            password: ctx.request.body.password
        },
        include: include,
        logging: null
    });
    if (user) {
        ctx.session.uid = user.get("id");
        ctx.response.body = global.env.render("userPage.html", { user: user });
    } else {
        ctx.body = "no such user";
    }
    await next();
};

let fn_get_login =async (ctx, next) => {
    let uid = ctx.session.uid;
    if (uid) {
        let include = [{
            model: Record,
            include: [{
                model:Movie,
                include:[Tag]
            }]
        }];
        let user = await User.findOne({
            where: {
                id: Number.parseInt(uid)
            },
            include: include,
            logging: null
        });
        if (user) {
            ctx.response.body = global.env.render("userPage.html", { user: user });
        } else {
            ctx.body = "no such user";
        }
    } else {
        ctx.redirect("http://localhost:3000/html/login.html");
    }
    await next();
}

module.exports = {
    "post /userpage": fn_login,
    "get /userpage":fn_get_login
};