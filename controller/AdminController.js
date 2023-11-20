const User = require('../models/UserModel');
const Absen = require('../models/AbsensiModel');
const dayjs = require('dayjs');
const infoSuccess = 'card-success';
const infoError = 'card-error';
const ip = require('ip');
const ipa = ip.address();
const { Op } = require('sequelize');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

class AdminController {
  async getAbsensi(req, res) {
    const urlSuccess = '/admin/datasiswa';
    const urlError = '/admin/datasiswa';
    try {
      const absen = await Absen.findAll();

      // Check if absen is an array
      if (!Array.isArray(absen)) {
        throw new Error('Unexpected data structure for absen');
      }

      const infoUsers = absen.map((item) => ({
        name: item.name,
        jurusan: item.jurusan,
        kelasan: item.kelas,
        hari: item.hari,
        masuk: item.masuk,
        pulang: item.pulang,
        keterangan: item.keterangan,
      }));

      return res.render('admin/datasiswa', { data: infoUsers });
    } catch (error) {
      const msg = 'Error fetching absensi data';
      res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
    }
  }

  async postSearchAbsensi(req, res) {
    const searchQuery = req.body.search;

    try {
      if (!searchQuery) {
        // Handle the case where search term is not provided
        return res.redirect('/admin/datasiswa');
      }

      const absen = await Absen.findAll({
        where: {
          name: {
            [Op.like]: `%${searchQuery}%`,
          },
        },
      });

      const infoUsers = absen.map((item) => ({
        name: item.name,
        jurusan: item.jurusan,
        kelasan: item.kelas,
        hari: item.hari,
        masuk: item.masuk,
        pulang: item.pulang,
        keterangan: item.keterangan,
      }));

      return res.render('admin/datasiswa', { data: infoUsers });
    } catch (error) {
      const msg = 'Error fetching absensi data';
      res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
    }
  }

  async DbToExcel(req, res) {
    const urlError = '/admin/datasiswa';
    try {
      const absen = await Absen.findAll();
  
      if (!Array.isArray(absen)) {
        throw new Error('Unexpected data structure for absen');
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Absensi Data');
  
      worksheet.addRow(['Name', 'Jurusan', 'Kelas', 'Hari', 'Masuk', 'Pulang', 'Keterangan']);
  
      absen.forEach((item) => {
        worksheet.addRow([item.name, item.jurusan, item.kelas, item.hari, item.masuk, item.pulang, item.keterangan]);
      });
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=absensi_data.xlsx');

      await workbook.xlsx.write(res);
  
    } catch (error) {
      console.error('Error exporting absensi data to Excel:', error);
      const msg = 'Error exporting absensi data to Excel';
      res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
    }
  }
}

module.exports = new AdminController();
