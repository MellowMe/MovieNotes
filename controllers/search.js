let Movie = require("../model").movie;
let User = require("../model").user;
let Tag = require("../model").tag;

let fn_search = async (ctx, next) => {
    let keyword = "%" + ctx.request.URL.searchParams.get("keyword") + "%";
    let Op = Tag.sequelize.Op;
    let movies = await Movie.findAll({
        where: {
            movieName: { [Op.like]: keyword }
        },
        include: [Tag],
        logging: false
    });
    let tags = await Tag.findAll({
        where: {
            tagName: { [Op.like]: keyword }
        },
        logging: false
    });
    let users = await User.findAll({
        where: {
            username: { [Op.like]: keyword }
        },
        logging: false
    });
    for (let tag of tags) {
        tag.refNumber = await tag.countMovies({ logging: false });
        movies = movies.concat(await tag.getMovies({ include: [Tag], logging: false }));
    }
    tags.sort((a, b) => b.refNumber - a.refNumber);
    let str = global.env.render("searchMovies.html", { movies: movies }) + "***" +
        global.env.render("searchTags.html", { tags: tags }) + "***"
        + global.env.render("searchUsers.html", { users: users });
    ctx.body = str;
    await next();
};

let fn_searchMovie = async (ctx, next) => {
    let name = ctx.request.URL.searchParams.get("movieName");
    let movie = await Movie.findOne({
        where: { movieName: name },
        logging: false
    });

    if (movie) {
        ctx.response.body = JSON.stringify(movie);
    } else {
        ctx.response.body = 0;
    }
    await next();
};

module.exports = {
    "get /movieInfo": fn_searchMovie,
    "get /search": fn_search
};