const User = require('../models/UserModel');
const infoError = 'card-error';

class AuthMiddleware {
    async IsLogin(req, res, next) {
        const uuid = req.session.uuid;
        const urlError = '/login';
        if (uuid) {
            next();
        } else {
            const msg = "Anda harus Login terlebih dahulu";
            return res.render('pesan/pesan', { msg, url: urlError, info: infoError });
        }
    }

    async IsGuest(req, res, next) {
        const uuid = req.session.uuid;
        if (!uuid) {
            next();
        } else {
            const msg = "Anda sudah login";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        }
    }

    async IsAdmin(req, res, next) {
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (role.role == "admin") {
            next();
        } if (role.role == "guru") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        } if (role.role == "siswa") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        }
    }

    async IsGuru(req, res, next) {
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (role.role == "admin") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        } if (role.role == "guru") {
            next();
        } if (role.role == "siswa") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        }
    }

    async IsSiswa(req, res, next) {
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (role.role == "admin") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        } if (role.role == "guru") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        } if (role.role == "siswa") {
            next();
        }
    }

    async IsAdminAndGuru(req, res, next) {
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (role.role == "admin" || role.role == "guru") {
            next();
        } if (role.role == "siswa") {
            const msg = "Akses Terlarang";
            return res.render('pesan/pesan', { msg, url: '/profile', info: infoError });
        }
    }
}

module.exports = new AuthMiddleware();
