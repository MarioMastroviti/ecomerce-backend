const express = require('express');
const router = express.Router();
const { productsModel } = require('../dao/mongo/models/products.model.js')
const passport = require("passport")


router.get('/api/sessions/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/api/sessions/login');
    }
    
    const { first_name, last_name, email, age } = req.session.user;
    res.render('profile', { first_name, last_name, email, age });
});


router.get('/api/sessions/login', (req, res) => {
    res.render('login'); 
});

router.get('/api/sessions/register', (req, res) => {
    res.render('register'); 
});

router.get('/api/sessions/restore', (req, res) => {
    res.render('restore'); 
});

router.get('/api/sessions/products', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/api/sessions/login');
    }
    const { first_name, last_name, email, age } = req.session.user;
    const products = await productsModel.find().lean();
    res.render('products', { products });
});


router.get("/api/sessions/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/api/sessions/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user
    res.redirect("/api/sessions/products")

})

router.get('/api/products', (req, res) => {
    res.render('createProduct'); 
});

router.get('/api/chat', (req, res) => {
    res.render('chat', {
        titulo: 'chat en tiempo real'
    });
});


module.exports = router;