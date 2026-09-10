const mysql = require("mysql2/promise");
require("dotenv").config();

let db = null;

const connectDatabase = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("MySQL database connected successfully");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database is not connected");
  }

  return db;
};

module.exports = {
  connectDatabase,
  getDb,
};