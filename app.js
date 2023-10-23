const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const  productsRouter = require('./src/routes/products.router');
const cartRouter = require('./src/routes/cart.router')
const usersRouter = require('./src/routes/users.router')
const viewsRouter = require('./src/routes/views.router')
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const passport = require("passport")
const path = require('path')
const cookieParser = require('cookie-parser')
const initializePassport = require("./src/config/passport.config");
const flash = require('connect-flash');
require('dotenv').config()
const PORT =  process.env.PORT;

app.use(express.json())


mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Conexión exitosa a la base de datos");
})
.catch(error => {
    console.error("Error en la conexión a la base de datos", error);
});



app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL, 
        ttl: 600,
      }),
      secret: process.env.clave_secreta,
      resave: false,
      saveUninitialized: true,
    })
  );
  

   
  
app.use(flash());

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'handlebars');


app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)
app.use("/api/sessions", usersRouter)
app.use("/", viewsRouter)




app.listen(PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`) 
})
