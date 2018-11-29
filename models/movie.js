module.exports = (sequelize, types) => {
    return sequelize.define("movie", {
        id: { type: types.INTEGER, primaryKey: true, autoIncrement: true },
        movieName: { type: types.STRING(50),allowNull: false },
        director: { type: types.STRING(32), allowNull: false },
        actor: { type: types.STRING, allowNull: false },
        writer: { type: types.STRING(40),allowNull:false},
        type: { type: types.STRING(24), allowNull: false },
        region: { type: types.STRING(24), allowNull: false },
        releaseDate: { type: types.DATEONLY ,allowNull:false},
        duration: { type: types.TINYINT,allowNull:false },
        intro: { type: types.TEXT ,allowNull:false},
        poster: { type: types.STRING,allowNull:false},
        score:{type:types.DOUBLE(2,1)}
    }
        , {
            timestamps: false
        })
};