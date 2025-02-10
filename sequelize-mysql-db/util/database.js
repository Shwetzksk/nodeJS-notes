const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-schema", "root", "shweta@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
