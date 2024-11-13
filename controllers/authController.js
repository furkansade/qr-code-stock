const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// login page

exports.loginPage = (req, res) => {
    try {
        res.render('login', {
            pageTitle: 'Giriş Yap',
        })
    } catch (error) {
        console.error(error);
        req.flash('error', 'Bir sorun oluştu lütfen yönetici ile iletişime geçin.');
        res.status(300).redirect('/auth');
    }
};

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            req.flash('error', 'Eposta veya şifre hatalı!');
            return res.status(400).redirect('/auth');
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            req.flash('error', 'Eposta veya şifre hatalı!');
            return res.status(400).redirect('/auth');
        }

        const token = createToken(user._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 gün
        })

        req.flash('success', 'Giriş başarılı!');
        res.status(200).redirect('/stocks');
    } catch (error) {
        req.flash('error', 'Bir sorun oluştu lütfen yönetici ile iletişime geçin.');
        res.status(300).redirect('/auth');
    }
};

// logout
exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/auth');
};