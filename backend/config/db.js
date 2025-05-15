import mysql from 'mysql2/promise';

let pool;

export default async function db() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to MySQL');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
}

export { pool };