const User = require('../models/UserModel');
const fs = require('fs').promises; 
const path = require('path');
const dayjs = require('dayjs');
const argon = require('argon2');
const qr = require('qrcode');
const port = process.env.PORT || 6000;
const nodemailer = require('nodemailer');
const infoSuccess = 'card-success';
const infoError = 'card-error';

class UserController{
    async addUser(req, res) {
        const user = req.body;
        const urlSuccess = '/login';
        const urlError = '/login';

        try {
            // Check if email is already registered
            const cekNis = await User.findOne({
                where: {
                    nis: user.nis,
                }
            });

            if (user.name === "") {
                const msg = "Nama tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.nis === "") {
                const msg = "Nis tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.password === "") {
                const msg = "Password tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.jurusan === "") {
                const msg = "Jurusan tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }else if (user.kelas === "") {
                const msg = "Kelas tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.password.length <= 8) {
                const msg = "password must be at least 8 characters"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }else if(cekNis){
                const msg = "Nis sudah terdaftar"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            // Hash the password
            const hashedPassword = await argon.hash(user.password);

            // Generate QR code name based on email and date
            const now = dayjs();
            const date = now.format("DDMMYYYY");
            const nameqr = `${user.email}_${date}.png`;

            // Create the user
            const add = await User.create({
                name: user.name,
                jurusan: user.jurusan,
                kelas: user.kelas,
                nis: user.nis,
                password: hashedPassword, // Use the hashed password
                role: 'siswa',
                qr: nameqr,
            });

            
            const userWithNis = await User.findOne({
                where: {
                    nis: user.nis,
                }
            });

            const uuid = userWithNis.uuid;

            const isiqr = `http://localhost:${port}/absen/${uuid}`;

            const qrCodePath = path.join(__dirname, '../public/qr', nameqr);

            const toFilePromise = require('util').promisify(qr.toFile);
            await toFilePromise(qrCodePath, isiqr);

            const msg = "berhasil mendaftar"
            return res.render('pesan/pesan', { msg: msg, url: urlSuccess, info: infoSuccess });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async login(req,res){
        const {nis, password} = req.body;
        console.log(nis, password);
        const urlSuccess = '/profile';
        const urlError = '/login';
        try {
            if(nis === "" || password === ""){
                const msg = "form tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            const user = await User.findOne({
                where: {
                    nis: nis,
                },
            });
            console.log(user);

            if (!user) {
                const msg = "User tidak ditemukan";
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            const match = await argon.verify(user.password, password);
            console.log(match); // Log password match result to console

            if (!match) {
                const msg = "Password salah";
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            req.session.uuid = user.uuid;
            console.log("Session UUID:", req.session.uuid);

            const msg = "Berhasil login";
            res.render('pesan/pesan', { msg: msg, url: urlSuccess, info: infoSuccess });


        } catch (error) {
            console.error("Error during login:", error);
        
            // Log the specific error message
            if (error instanceof argon2.VerifierError) {
                console.error("Verifier error:", error.message);
            }
        
            res.status(500).send("Internal Server Error");
        }
    }

    async logout(req, res){
        const logout = delete req.session.uuid;
        const urlSuccess = '/login';
        if(logout){
            const msg = "Berhasil Logout"
            res.render('pesan/pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
        }
    }

    async profile(req, res){
        const uuid = req.session.uuid;
        const urlSuccess = '/profile';
        const urlError = '/login';
        if(!uuid){
            const msg = "Silahkan Login terlebih dahulu"
            res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
        }
        const user = await User.findOne({
            where:{
                uuid: uuid
            }
        })

        if(!user){
            const msg = "User tidak ditemukan"
            res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
        }

        const infoUser = {
            name: user.name,
            jurusan: user.jurusan,
            kelas: user.kelas,
            nis: user.nis,
            role: user.role,
            qr: user.qr,
        };

        return res.render('profile', { user: infoUser});

    }

}

module.exports = new UserController();