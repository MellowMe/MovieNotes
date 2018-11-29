module.exports = (sequelize, types) => {
    return sequelize.define("record", {
        id: { type: types.INTEGER, primaryKey: true, autoIncrement: true },
        watchDate:{type:types.DATEONLY,allowNull:false},
        watchPlace:{type:types.STRING(32),allowNull:false},
        memory:{type:types.TEXT,allowNull:false},
        photo:{type:types.STRING},
        judge:{type:types.INTEGER(1),allowNull:false},
        comment:{type:types.TEXT},
        approval:{type:types.INTEGER, defaultValue:0}
    }
        , {
            timestamps: false,
        })
};