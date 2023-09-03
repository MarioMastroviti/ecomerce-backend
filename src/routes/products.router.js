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

router.get("/:pid" , async (req,res) =>{
   let {pid} = req.params
let product = await productsModel.findOne({_id: pid})
res.send({result: "sucess" , payload: product})
 
})


router.post("/", async (req,res) =>{
    let {titulo, categoria, precio, stock, imagenes} = req.body

    if( !titulo || !categoria || !precio ||!stock ){
        res.send({result: "error" , error: "falta completar parametros"})
    }


    let result = await productsModel.create({ titulo, categoria, precio, stock, imagenes : []})
    res.send({result: "sucess" , payload: result})
})

router.put("/:pid", async (req,res) =>{
    let {pid} = req.params
    let productUpdate= req.body
    if(!productUpdate.titulo || !productUpdate.descripcion || !productUpdate.precio){
        res.send({result: "error" , error: "faltan ingresar parametros"})
    }

    let result = await productsModel.updateOne({ _id : pid}, productUpdate)
    res.send({result: "sucess" , payload : result})
})

router.delete("/:pid", async (req,res) =>{
    let {pid} = req.params

    let result = await productsModel.deleteOne({_id : pid})
    res.send({result: "sucess" , payload : result})
} )

module.exports= router