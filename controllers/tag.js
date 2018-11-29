const Tag = require("../model").tag;
const Movie = require("../model").movie;

let fn_addTag = async (ctx, next) => {
    let movieName = ctx.request.URL.searchParams.get("movieName");
    let tagName = ctx.request.URL.searchParams.get("tagName");
    let tag = await Tag.findOrCreate({
        where: {
            tagName: tagName
        },
        logging: false
    });
    let movie = await Movie.findOne({
        where: {
            movieName: movieName
        },
        logging: false
    });
    await movie.addTag(tag[0], { logging: false });
    ctx.status = 200;
    await next();
};

let fn_deleteTag = async (ctx, next) => {
    let movieName = ctx.request.URL.searchParams.get("movieName");
    let tagName = ctx.request.URL.searchParams.get("tagName");
    let tag = await Tag.findOne({
        where: {
            tagName: tagName
        },
        logging: false
    });
    let movie = await Movie.findOne({
        where: {
            movieName: movieName
        },
        logging: false
    });
    await movie.removeTag(tag, { logging: false });
    ctx.status = 200;
    if (await tag.getMovies({ logging: false }) == 0) {
        tag.destroy({ logging: false });
    }
    await next();
};

let fn_allTags = async (ctx, next) => {
    let tags = await Tag.findAll({
        logging: false
    });
    for (let tag of tags) {
        tag.refNumber = await tag.countMovies({ logging: false });
    }
    tags.sort((a, b) => b.refNumber - a.refNumber);
    ctx.body = global.env.render("searchTags.html", { tags: tags });
    await next();
};

module.exports = {
    "get /addTag": fn_addTag,
    "get /deleteTag": fn_deleteTag,
    "get /allTags": fn_allTags
};