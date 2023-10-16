const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AbsenController = require('../controller/AbsenController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', AuthMiddleware.IsGuest,(req, res) => {
    const data = {
        message: req.flash('message'),
    }
    res.render('tambah', data);
});
router.post('/register', AuthMiddleware.IsGuest, UserController.addUser,);
router.get('/login', AuthMiddleware.IsGuest, (req, res) =>{
    const data = {
        message: req.flash('message'),
    }
    res.render('login', data);
});
router.post('/login', AuthMiddleware.IsGuest, UserController.login,);
router.get('/logout', AuthMiddleware.IsLogin, UserController.logout);

router.get('/profile', AuthMiddleware.IsLogin, UserController.profile);

router.get('/absen/:uuid', AuthMiddleware.IsGuru, AuthMiddleware.IsSiswa, AbsenController.getUser);

module.exports = router;