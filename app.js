const express = require('express')
const app = express();
const mongoose = require('mongoose');
const productsRouter = require('./src/routes/products.router.js');
const cartRouter = require('./src/routes/cart.router')
const usersRouter = require('./src/routes/users.router')
const viewsRouter = require('./src/routes/views.router')
const {errorMiddleware} = require('./src/middleware/error')
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const passport = require("passport")
const path = require('path')
const cookieParser = require('cookie-parser')
const initializePassport = require("./src/config/passport.config");
const flash = require('connect-flash');
const winston = require('winston')
const methodOverride = require('method-override');
require('dotenv').config()
const Swal = require('sweetalert2');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const http = require('http');
const { Server } = require('socket.io');
const { generateProducts } = require('./src/utils/utils.js');
const emailRouter = require("./src/routes/mail.router.js")
const server = http.createServer(app);
const errorHandler = require('./src/middleware/error/index')
const {addLogger} = require('./src/utils/loggerCustom.js')
const io = new Server(server);


const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(addLogger);

app.use(methodOverride('_method'));


mongoose.connect(process.env.MONGODB_URL, {
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
app.use(express.static(path.join(__dirname, 'src/public')));
// uso del midlaware de errores
app.use(errorHandler);

//configuracion de swagger
const swaggerOptions= {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación',
          description: 'Api clase swagger'
      }
  },
  apis: ['src/docs/products.yaml', 'src/docs/cart.yaml']

}

const specs = swaggerJsDoc(swaggerOptions);
app.use('/apiDocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));



// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error(err); 


  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


app.use("/api/product", productsRouter);
app.use("/api/cart", cartRouter)
app.use("/api/sessions", usersRouter)
app.use("/", viewsRouter)
app.use("/api/email", emailRouter)

//endpoint para mocking dde generar productos
app.get('/api/mockingProducts/:numOfProducts', (req, res) => {
  const numOfProducts = parseInt(req.params.numOfProducts);
  const products = generateProducts(numOfProducts);
  res.render('mockingProducts', { products });
});

//endpoint para probar logger
app.get('/loggerTest', addLogger, async (req, res) => {
  try {
      req.logger.debug('Debug log test');
      req.logger.info('Info log test');
      req.logger.warn('Warn log test');
      req.logger.error('Error log test');
      req.logger.fatal('Fatal log test');

      res.json({ result: 'success', message: 'Logger test completed' });
  } catch (error) {
      req.logger.error('Error in loggerTest:', error);
      res.status(500).json({ result: 'error', error: 'Internal Server Error' });
  }
});


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



app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`)
})