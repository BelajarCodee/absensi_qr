// require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql', // Ganti dengan dialect database yang sesuai
      logging: false, // Matikan log query (opsional)
    }
  );
  
  // Test koneksi
  db
    .authenticate()
    .then(() => {
      console.log('terkoneksi ke database.');
    })
    .catch((err) => {
      console.error('gagal terkoneksi ke database:', err);
    });

module.exports = db;