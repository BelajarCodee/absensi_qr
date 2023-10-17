const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AbsenController = require('../controller/AbsenController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', AuthMiddleware.IsGuest,(req, res) => {
    res.render('tambah');
});
router.post('/register', UserController.addUser,);
router.get('/login', AuthMiddleware.IsGuest, (req, res) =>{
    res.render('login');
});
router.post('/login', AuthMiddleware.IsGuest, UserController.login,);
router.get('/logout', AuthMiddleware.IsLogin, UserController.logout);

router.get('/profile', AuthMiddleware.IsLogin, UserController.profile,);

router.get('/absen/:uuid', AuthMiddleware.IsAdminAndGuru, AbsenController.getUser);

module.exports = router;