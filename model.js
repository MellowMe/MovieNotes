'use strict'

const Sequelize = require("sequelize");
const fs = require("fs");
const sequelize = new Sequelize("movienotes", "root", "mymysql", {
    host: "localhost",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 5000,
        idle: 10000
    },
    operatorsAliases: false
});

let User = sequelize.import("./models/user.js");
let Movie = sequelize.import("./models/movie.js");
let Record = sequelize.import("./models/record.js");
let Tag = sequelize.import("./models/tag.js");

User.hasMany(Record);
Record.belongsTo(User);
Movie.hasMany(Record);
Record.belongsTo(Movie);
Tag.belongsToMany(Movie,{through:'MovieTag',timestamps:false});
Movie.belongsToMany(Tag,{through:'MovieTag',timestamps:false});
Tag.belongsToMany(User,{through:"UserFollow",timestamps:false});

sequelize.sync({logging:false});
module.exports = {
    user:User,
    movie:Movie,
    record:Record,
    tag:Tag
};

