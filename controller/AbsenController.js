const User = require('../models/UserModel');
const Absen = require('../models/AbsensiModel');
const dayjs = require('dayjs');

class AbsenController{
    async getUser(req,res){
        const uuid = req.params.uuid;
        const now = dayjs();
        const day = now.format('DD/MM/YYYY');
        const time = now.format('HH:mm:ss');
        try {
            const user = await User.findOne({
                where:{
                    uuid: uuid,
                },
            });

            const absen = await Absen.findOne({
                where:{
                    name: user.name,
                    hari: day,
                },
            });

            if(absen){
                await Absen.update(
                    {
                        pulang: time,
                    },
                    {
                        where:{
                            name: user.name,
                            hari: day,
                        },
                });
                req.flash("message", "silahkan pulang")
                return res.redirect("/profile");
            }else{
                await Absen.create({
                    name:  user.name,
                    jurusan: user.jurusan,
                    kelas: user.kelas,
                    hari: day,
                    masuk: time,
                    keterangan: "hadir",
                });
                req.flash("message", "Absensi berhasil")
                return res.redirect("/profile");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new AbsenController();