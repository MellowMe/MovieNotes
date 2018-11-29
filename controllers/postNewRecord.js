let Record = require("../model").record;
let Movie = require("../model").movie;
let fs = require("fs");

let fn_newRecordPsot = async (ctx, next) => {
    let form = ctx.request.body;
    let uid = ctx.session.uid;
    try {
        let photoPath = ctx.request.files["photo"].path;
        let photoFileName = photoPath.substring(photoPath.lastIndexOf("imgs") + 12);
        if (body.movieName) {
            let posterPath = ctx.request.files["poster"].path;
            let posterFileName = posterPath.substring(posterPath.lastIndexOf("imgs") + 12);
            let newMovie = await Movie.create({
                movieName: form.movieName,
                actor: form.actors,
                director: form.director,
                duration: form.duration,
                intro: form.introduction,
                poster: posterFileName,
                region: form.region,
                releaseDate: form.releaseDate,
                type: form.type,
                writer: form.writer
            },
                {
                    logging: null
                }
            );
            await Record.create({
                userId: uid,
                watchDate: form.watchDate,
                watchPlace: form.watchPlace,
                memory: form.memory,
                judge: Number.parseInt(form.judge),
                comment: form.comment,
                photo: photoFileName,
                movieId: newMovie.get("id")
            },
                {
                    logging: null
                }
            );
        }else{
            await Record.create({
                userId: uid,
                watchDate: form.watchDate,
                watchPlace: form.watchPlace,
                memory: form.memory,
                judge: Number.parseInt(form.judge),
                comment: form.comment,
                photo: photoFileName,
                movieId: form.movieId
            },
                {
                    logging: null
                }
            );
        }
        ctx.response.body = "success";
    } catch (err) {
        fs.unlink(ctx.request.files["photo"].path);
        fs.unlink(ctx.request.files["poster"].path);
        console.log(err);
    }
    await next();
};

module.exports = {
    "post /postNewRecord": fn_newRecordPsot
}