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
const http = require('http');
const Swal = require('sweetalert2');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

const PORT =  process.env.PORT;

app.use(express.json());
app.use(express.static(__dirname + '/src/public'));



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


//Configuración de handlebars
app.engine("handlebars", handlebars.engine())
//Usa la carpeta views como carpeta de vistas
app.set("views", __dirname + "/views")
//Usa handlebars como motor de plantillas
app.set("view engine", "handlebars")
//Usa los archivos dentro de la carpeta views
app.use(express.static(__dirname, + "/views"))
//Usa los archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));



app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)
app.use("/api/sessions", usersRouter)
app.use("/", viewsRouter)


io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('newUser', (username) => {
      users[socket.id] = username;
      io.emit('userConnected', username);
  });

  socket.on('chatMessage', (message) => {
      const username = users[socket.id];
      io.emit('message', { username, message });
  });


  socket.on('disconnect', () => {
      const username = users[socket.id];
      delete users[socket.id];
      io.emit('userDisconnected', username);
  });
});




app.listen(PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`) 
})

