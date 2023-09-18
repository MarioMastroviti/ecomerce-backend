const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { first_name, last_name, email, age } = req.session.user;
    res.render('profile', { first_name, last_name, email, age });
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/register', (req, res) => {
    res.render('register'); 
});

router.get('/restore', (req, res) => {
    res.render('restore'); 
});



module.exports = router;