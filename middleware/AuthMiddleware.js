const User = require('../models/UserModel');


class AuthMiddleware{
    async IsLogin(req,res,next){
        const uuid = req.session.uuid;
        if(uuid){
            next();
        }else{
            req.flash("message", "Anda harus Login terlebih dahulu")
                return res.redirect("/login");
        }
    }

    async IsGuest(req,res,next){
        const uuid = req.session.uuid;
        if(!uuid){
            next();
        }else{
            req.flash("message", "Anda sudah login")
            return res.redirect("/profile");
        }
    }

    async IsAdmin(req,res,next){
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where:{
                uuid: uuid
            }
        })

        if(role.role == "admin"){
            next();
        }if(role.role == "guru"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }if(role.role == "siswa"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }
    }

    async IsGuru(req,res,next){
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where:{
                uuid: uuid
            }
        })

        if(role.role == "admin"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }if(role.role == "guru"){
            next();
        }if(role.role == "siswa"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }
    }

    async IsSiswa(req,res,next){
        const uuid = req.session.uuid;
        const role = await User.findOne({
            where:{
                uuid: uuid
            }
        })

        if(role.role == "admin"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }if(role.role == "guru"){
            req.flash("message", "Akses Terlarang")
            return res.redirect("/profile");
        }if(role.role == "siswa"){
            next();
        }
    }
}

module.exports = new AuthMiddleware();