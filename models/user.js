module.exports = (sequelize, types) => {
    return sequelize.define("user", {
        id: { type: types.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: types.STRING(24), unique: true, allowNull: false },
        password: { type: types.STRING(32), allowNull: false },
        gender: { type: types.ENUM("male", "female", "unknown"), defaultValue: "unknown" },
        motto: { type: types.TEXT('tiny') },
        avatar:{type:types.STRING},
        regdate:{type:types.DATEONLY}
    }
        , {
            timestamps: false,
        })
};