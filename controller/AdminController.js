const User = require('../models/UserModel');
const Absen = require('../models/AbsensiModel');
const dayjs = require('dayjs');
const infoSuccess = 'card-success';
const infoError = 'card-error';
const ip = require('ip');
const ipa = ip.address();

class AdminController{
    async getAbsensi(req, res) {
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
    
          return res.render('admin/dashboard', { data: infoUsers });
        } catch (error) {
          console.error(error);
          return res.render('admin/error', { error: 'Error fetching absensi data' });
        }
      }
}

module.exports = new AdminController();