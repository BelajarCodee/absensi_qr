const User = require('../models/UserModel');
const Absen = require('../models/AbsensiModel');
const dayjs = require('dayjs');
const infoSuccess = 'card-success';
const infoError = 'card-error';
const ip = require('ip');
const ipa = ip.address();

class AdminController{
    async getAbsensi(req,res){
        const absen = await Absen.findAll();
        const infoUser = {
            name: absen.name,
            jurusan: absen.jurusan,
            kelasan: absen.kelasan,
            hari: absen.hari,
            masuk: absen.masuk,
            pulang: absen.pulang,
            keterangan: absen.keterangan,
        }
        return res.render('admin/dashboard', {infoUser});
    }
}

module.exports = new AdminController();