'use strict'

let fs = require("fs");
let koa = require("koa");
let Router = require("koa-router");
let nunjucks = require("nunjucks");
let staticServe = require("koa-static");
let KoaBody = require("koa-body");
let Movie = require("./model").movie;
let Record = require("./model").record;
let Session = require("koa-session");

global.env = nunjucks.configure("./views", {
    watch: true
});

function addControllers(router) {
    let files = fs.readdirSync("./controllers");
    let jsfiles = files.filter((f) => {
        return f.endsWith("js")
    });
    for (let f of jsfiles) {
        let maps = require("./controllers/" + f);
        for (let key in maps) {
            if (key.startsWith("get")) {
                let url = key.substring(4);
                router.get(url, maps[key]);
            } else if (key.startsWith("post")) {
                let url = key.substring(5);
                router.post(url, maps[key]);
            } else {
                console.log(`wrong controller:${key} : ${maps[key]}`);
            }
        }
    }
}

let koaBody = new KoaBody({
    multipart: true,
    formidable: {
        keepExtensions: true,
        uploadDir: `${__dirname}/public/upload/imgs`
    }
});

let app = new koa();
let router = new Router();
addControllers(router);
app.use(staticServe("./public"));
app.use(koaBody);
app.keys = ['All things in their being are good for something'];
app.use(Session({
    maxAge: 1800000,
    httpOnly: true,
    signed: true,
    rolling: true
}, app));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, "127.0.0.1");

async function setScores() {
    let movies = await Movie.findAll({
        attributes: ["id"],
        logging: false
    });
    for (let movie of movies) {
        let result = await Record.findOne({
            where: { movieId: movie.get("id") },
            attributes: [[Record.sequelize.fn("SUM", Record.sequelize.col("judge")), "sum"],
            [Record.sequelize.fn("COUNT", Record.sequelize.col("judge")), "count"]],
            logging: false
        });
        let score = ((result.get("sum") / result.get("count")).toFixed(1));
        movie.set("score", score);
        movie.save({ logging: false });
    }
}

setScores();
setInterval(setScores, 600000);