'use strict'

let Sequelize = require("sequelize");
const sequelize = new Sequelize("demo", "root", "mymysql", {
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

let Customer = sequelize.define("customer", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(13),
        allowNull:false
    },
    city: {
        type: Sequelize.STRING(20)
    },
},
    {
        timestamps: false
    }
);

let Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:Sequelize.STRING(13),
        allowNull:false
    },
    price:{
        type:Sequelize.DOUBLE
    },
    quantity:{
        type:Sequelize.INTEGER
    }
},
    {
        timestamps:false
    }
);

let Order = sequelize.define("order", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dollars:{
        type:Sequelize.DOUBLE
    },
    quantity:{
        type:Sequelize.INTEGER
    }
},
    {
        timestamps:false
    }
);

Customer.hasMany(Order);
Order.belongsTo(Customer);
Product.hasMany(Order);
Order.belongsTo(Product);
