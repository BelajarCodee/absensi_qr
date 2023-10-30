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
        const urlError = '/register';

        try {
            // Check if email is already registered
            const cekEmail = await User.findOne({
                where: {
                    email: user.email,
                }
            });

            if (user.name === "") {
                const msg = "Nama tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.email === "") {
                const msg = "Email tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.password === "") {
                const msg = "Password tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            } else if (user.password.length < 8) {
                const msg = "password must be at least 8 characters"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }else if(cekEmail){
                const msg = "Email sudah terdaftar"
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
                email: user.email,
                password: hashedPassword, // Use the hashed password
                role: 'siswa',
                qr: nameqr,
            });

            
            const userWithEmail = await User.findOne({
                where: {
                    email: user.email,
                }
            });

            const uuid = userWithEmail.uuid;

            const isiqr = `http://localhost:${port}/absen/${uuid}`;

            const qrCodePath = path.join(__dirname, '../public/qr', nameqr);

            const toFilePromise = require('util').promisify(qr.toFile);
            await toFilePromise(qrCodePath, isiqr);

            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: user.email, // Gunakan user.email, bukan variabel yang tidak didefinisikan
                subject: 'Registration Confirmation',
                text: `Thank you for registering!\n\nUsername: ${user.name}\nEmail: ${user.email}`,
                attachments: [
                    {
                        filename: nameqr,
                        path: qrCodePath,
                    },
                ],
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            if(add){
                const msg = "berhasil mendaftar"
                return res.render('pesan/pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async login(req,res){
        const {email, password} = req.body;
        const urlSuccess = '/profile';
        const urlError = '/login';
        try {
            if(email === "" || password === ""){
                const msg = "form tidak boleh kosong"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            const user = await User.findOne({
                where:{
                    email: email,
                },
            });

            if(!user){
                const msg = "User tidak ditemukan"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            }

            const match = await argon.verify(user.password, password);

            if(!match){
                const msg = "password salah"
                return res.render('pesan/pesan', { msg: msg, url: urlError, info: infoError });
            };

            req.session.uuid = user.uuid;

            console.log(req.session.uuid);

            const msg = "berhasil login"
            res.render('pesan/pesan', { msg: msg, url: urlSuccess, info: infoSuccess });


        } catch (error) {
            console.error(error);
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
            email: user.email,
            role: user.role,
            qr: user.qr,
        };

        return res.render('profile', { user: infoUser});

    }

}

module.exports = new UserController();