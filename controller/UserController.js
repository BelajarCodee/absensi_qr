const User = require('../models/UserModel');
const fs = require('fs').promises; 
const path = require('path');
const dayjs = require('dayjs');
const argon = require('argon2');
const qr = require('qrcode');
const port = process.env.PORT || 6000;
const nodemailer = require('nodemailer');


class UserController{
    async addUser(req, res) {
        const user = req.body;

        try {
            // Check if email is already registered
            const cekEmail = await User.findOne({
                where: {
                    email: user.email,
                }
            });

            if (user.name === "") {
                req.flash("message", "nama tidak boleh kosong")
                return res.redirect("/register");
            } else if (user.email === "") {
                req.flash("message", "email tidak boleh kosong")
                return res.redirect("/register");
            } else if (user.password === "") {
                req.flash("message", "password tidak boleh kosong")
                return res.redirect("/register");
            } else if (user.password.length < 8) {
                req.flash("message", "password must be at least 8 characters")
                return res.redirect("/register");
            }else if(cekEmail){
                req.flash("message", "email sudah terdaftar")
                return res.redirect("/register");
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
                req.flash("message", "berhasil mendaftar")
                return res.redirect("/login");
            }

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async login(req,res){
        const {email, password} = req.body;
        try {
            if(email === "" || password === ""){
                req.flash("message", "form tidak boleh kosong");
                return res.redirect("/login")
            }

            const user = await User.findOne({
                where:{
                    email: email,
                },
            });

            if(!user){
                req.flash("message", "User tidak ditemukan");
                return res.redirect("/login")
            }

            const match = await argon.verify(user.password, password);

            if(!match){
                req.flash("message", "Password salah");
                return res.redirect("/login");
            };

            req.session.uuid = user.uuid;

            console.log(req.session.uuid);

            req.flash("message", "Berhasil login");
            return res.redirect("/profile");

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async logout(req, res){
        const logout = delete req.session.uuid;
        if(logout){
            req.flash('message', 'berhasil logout');
            return res.redirect("/login");
        }
    }

    async profile(req, res){
        const uuid = req.session.uuid;
        if(!uuid){
            req.flash('message', 'mohon login terlebih dahulu');
            return res.redirect("/login");
        }
        const user = await User.findOne({
            where:{
                uuid: uuid
            }
        })

        if(!user){
            req.flash('message', 'akun tidak ditemukan');
            return res.redirect("/login");
        }

        const infoUser = {
            name: user.name,
            email: user.email,
            role: user.role,
            qr: user.qr,
        };

        const data = {
            message: req.flash('message'),
        }
        return res.render('profile', {user: infoUser, data: data});
    }

}

module.exports = new UserController();