require('dotenv').config()
const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const  productsRouter = require('./src/routes/products.router');
const usersRouter = require('./src/routes/users.router')
const cartRouter = require('./src/routes/cart.router')
const PORT = process.env.PORT;

app.use(express.json())

app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter)
app.use("/api/cart", cartRouter)



mongoose.connect(process.env.MONGODB_URL)
.then(() =>{
    console.log("conectado a la base de datos")
})
.catch(error =>{
    console.log("error en la conexion", error) 
})

app.listen(PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`) 
})



