const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    const data = {
        message: req.flash('message'),
    }
    res.render('tambah', data);
});
router.post('/register',UserController.addUser,);
router.get('/login', (req, res) =>{
    const data = {
        message: req.flash('message'),
    }
    res.render('login', data);
});
router.post('/login', UserController.login,);
router.get('/logout', UserController.logout);

router.get('/profile', UserController.profile)

module.exports = router;