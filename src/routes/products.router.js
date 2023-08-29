const {Router} = require ('express')
const {productsModel} = require('../models/products.model.js')

const router = Router()

router.get("/" , async (req,res) =>{
    try{
let products = await productsModel.find()
res.send({result: "sucess" , payload: products})
    }
    catch(error){
        console.log(error)
    }
})

router.post("/", async (req,res) =>{
    let {titulo, descripcion, precio} = req.body

    if(!titulo || !descripcion || !precio){
        res.send({result: "error" , error: "falta completar parametros"})
    }

    let result = await productsModel.create({titulo, descripcion, precio})
    res.send({result: "sucess" , payload: result})
})

router.put("/pid", async (req,res) =>{
    let {pid} = req.params
    let productUpdate= req.body;
    if(!productUpdate.titulo || productUpdate.descripcion || productUpdate.precio){
        res.send({result: "error" , error: "faltan ingresar parametros"})
    }

    let result = await productsModel.updateOne({ _id : pid}, productUpdate)
    res.send({result: "sucess" , payload : result})
})

module.exports= router