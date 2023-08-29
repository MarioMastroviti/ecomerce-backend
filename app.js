const { error } = require('console');
const express = require ('express')
const app = express();
const mongoose = require('mongoose');
const  productsRouter = require('./src/routes/products.router');
const PORT = 8080;

app.use(express.json())



app.listen(PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`)
})

mongoose.connect('mongodb+srv://mariomastroviti1:GTelibEmjmiqCT5m@cluster0.vey3hwj.mongodb.net/?retryWrites=true&w=majority')
.then(() =>{
    console.log("conectado a la base de datos")
})
.catch(error =>{
    console.log("error en la conexion") 
})

app.use("/api/products", productsRouter)