require('dotenv').config()
const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const  productsRouter = require('./src/routes/products.router');
const cartRouter = require('./src/routes/cart.router')
const sessionsRouter = require('./src/routes/sessions.router')
const viewsRouter = require('./src/routes/views.router')
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const passport = require("passport")
const PORT = 8080;

app.use(express.json())




mongoose.connect('mongodb+srv://mariomastroviti1:GTelibEmjmiqCT5m@cluster0.vey3hwj.mongodb.net/e-comerce?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.catch(error =>{
    console.log("error en la conexion", error) 
})



app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mariomastroviti1:GTelibEmjmiqCT5m@cluster0.vey3hwj.mongodb.net/e-comerce?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: true,
}));


app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set("view engine", "handlebars")


app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/views", viewsRouter)




app.listen(PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`) 
})



