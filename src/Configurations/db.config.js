const mysql = require("mysql2/promise");

require("dotenv").config();

let db = null;

const connectDatabase = async () => {
  try {
    db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,

      ssl: {
        rejectUnauthorized: false,
      },

      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,

      connectTimeout: 20000,
    });

    // Test an actual database connection
    const connection = await db.getConnection();

    await connection.ping();
    connection.release();

    // Test an actual query
    const [rows] = await db.query("SELECT 1 AS test");
  } catch (error) {
    console.error(error);
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
