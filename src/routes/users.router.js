const {Router} = require ('express')
const {usersModel} = require('../models/users.model.js')

const router = Router()

router.get("/" , async (req,res) =>{
    try{
let users = await usersModel.find()
res.send({result: "sucess" , payload: users})
    }
    catch(error){
        console.log(error)
    }
})

router.get("/:uid" , async (req,res) =>{
    let {uid} = req.params
 let user = await usersModel.findOne({_id: uid})
 res.send({result: "sucess" , payload: user})
  
 })

router.post("/", async (req,res) =>{
    let {nombre, apellido, email, dni} = req.body

    if( !nombre || !apellido || !email || !dni){
        res.send({result: "error" , error: "falta completar parametros"})
    }


    let result = await usersModel.create({ nombre, apellido, email, dni})
    res.send({result: "sucess" , payload: result})
})

router.put("/:uid", async (req,res) =>{
    let {uid} = req.params
    let userUpdate= req.body
    if(!userUpdate.nombre || !userUpdate.apellido || !userUpdate.email || !userUpdate.dni){
        res.send({result: "error" , error: "faltan ingresar parametros"})
    }

    let result = await usersModel.updateOne({ _id : uid}, userUpdate)
    res.send({result: "sucess" , payload : result})
})

router.delete("/:uid", async (req,res) =>{
    let {uid} = req.params

    let result = await usersModel.deleteOne({_id : uid})
    res.send({result: "sucess" , payload : result})
} )

module.exports= router