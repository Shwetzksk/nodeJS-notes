const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-schema",
  password: "shweta@123",
});

module.exports = pool.promise();
