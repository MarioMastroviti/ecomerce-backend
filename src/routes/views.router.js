const express = require('express');
const router = express.Router();
const { productsModel } = require('../dao/mongo/models/products.model.js')

const passport = require("passport")




router.get("/api/sessions/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/api/sessions/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user
    res.redirect("/api/product")
})

router.get('/api/product/createProducts', (req, res) => {
    res.render('createProduct'); 
});


router.get('/api/chat', (req, res) => {
    res.render('chat', {
        titulo: 'chat en tiempo real'
    });
});



module.exports = router;