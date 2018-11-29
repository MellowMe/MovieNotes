const got = require('got');

let fn_weather = async (ctx, next) => {
    try {
        let res = await got("http://i.tianqi.com/index.php?c=code&id=5");
        let doc = res.body;
        let pure = doc.slice(doc.indexOf("<strong>"),doc.indexOf("详细")).replace("strong","span");
        ctx.body = pure;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    "get /weather": fn_weather
}
