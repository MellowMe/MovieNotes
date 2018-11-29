module.exports = (sequelize, types) => {
    return sequelize.define("tag", {
        id: { type: types.INTEGER, primaryKey: true, autoIncrement: true },
        tagName:{type:types.STRING(32), allowNull:false,unique:true},
        desc:{type:types.STRING}
    }
        , {
            timestamps: false,
        })
};
