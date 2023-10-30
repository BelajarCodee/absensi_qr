const User = require('../models/UserModel');
const Absen = require('../models/AbsensiModel');
const dayjs = require('dayjs');
const infoSuccess = 'card-success';
const infoError = 'card-error';
const ip = require('ip');
const ipa = ip.address();
const { Op } = require('sequelize');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

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
        kelasan: item.kelasan,
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
        kelasan: item.kelasan,
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

  async pdfdata(req, res) {
    try {
      const absen = await Absen.findAll();

      if (!Array.isArray(absen)) {
        throw new Error('Unexpected data structure for absen');
      }

      const infoUsers = absen.map((item) => ({
        name: item.name,
        jurusan: item.jurusan,
        kelasan: item.kelasan,
        hari: item.hari,
        masuk: item.masuk,
        pulang: item.pulang,
        keterangan: item.keterangan,
      }));

      // Membuat dokumen PDF dengan pdf-lib
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      const { height } = page.getSize();
      const fontSize = 12;
      const textX = 50;
      const textY = height - 50;

      page.drawText('Data Kehadiran', { x: textX, y: textY, fontSize });

      this.generatePDFTable(pdfDoc, infoUsers, { x: textX, y: textY - 20 });

      // Buffer PDF
      const pdfBytes = await pdfDoc.save();

      // Mengatur header untuk mendownload sebagai file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=absen-data.pdf');

      // Mengirim file PDF sebagai tanggapan
      res.send(pdfBytes);
    } catch (error) {
      console.error(error);
      const msg = 'Error creating PDF';
      res.render('pesan/pesan', { msg: msg, url: '/admin/datasiswa', info: 'card-error' });
    }
  }

  generatePDFTable(pdfDoc, data, position) {
    const table = pdfDoc
      .createTable()
      .setColumns(['No', 'Name', 'Jurusan', 'Kelasan', 'Hari', 'Masuk', 'Pulang', 'Keterangan']);

    data.forEach((item, index) => {
      table.addRow([
        index + 1,
        item.name,
        item.jurusan,
        item.kelasan,
        item.hari,
        item.masuk,
        item.pulang,
        item.keterangan,
      ]);
    });

    table.draw(position);
  }
}

module.exports = new AdminController();
