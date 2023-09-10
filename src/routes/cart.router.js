const { Router } = require('express')
const { cartModel } = require('../models/cart.model');
const { productsModel } = require('../models/products.model');
const router = Router();




router.get("/:cid", async (req, res) => {
  const {cid} = parseInt(req.params.cid);

  const carritoBuscado = await cartModel.findOne({ __id: cid })
  //ver el tema de populate

  if (!carritoBuscado) {
    return res.status(404).json({ error: 'carrito no encontrado.' });
  }

  return res.json(carritoBuscado);
})


router.post("/", async (req, res) => {
  try {
   const { uid } = req.body;
  
    const cart = await cartModel.create({ user: uid});

    return res.status(201).send({ cart});
   
  } catch (error) {
    res.status(500).send(error);
    }
   });



   router.put("/:cid/product/:pid", async (req, res) => {
     try {
       const { cid, pid } = req.params; 
       const { quantity } = req.body; 
   

       const carrito = await cartModel.findOne({__id : cid});
   
       if (!carrito) {
         return res.status(404).json({ error: 'Carrito no encontrado.' });
       }   
     
       const productoExistente = carrito.products.find(p => p.__id === pid);
   
       if (!productoExistente) {
        return res.status(404).json({ error: 'producto no encontrado en el carrito.' });
        }else{

         productoExistente.quantity += quantity;
       }    
       
       res.json({ result: "success", payload: carrito });
     } catch (error) {
       console.error('Error al modificar la cantidad:', error);
       res.status(500).json({ result: "error", message: "Error interno del servidor" });
     }
   });
   
   module.exports = router;
   






router.put("/:cid", async(req,res) =>{
  try{
    const {cid} = req.params.cid;
    const {pid} = req.body.pid;
    const quantity = parseInt(req.body.quantity);
    
    if(quantity <=0){
      return res.send({status: "error", error: "ingresar al menos una unidad del producto"})
    }

    
    const carrito = await cartModel.findOne( { __id: cid })
    const product = await productsModel.findOne({ __id : pid})
    console.log(product)
    if(!product || !carrito){
      return res.send({status : "error", error: "producto o carrito no encontrado" })
    }

    const existingProduct = carrito.products.find(item => item.__id === pid);

    if (!existingProduct) {
      
    
      carrito.products.push({products: product}, {quantity: quantity});
    } else {
            existingProduct. quantity += quantity;
    }

    return res.send({status: "sucess", payload: carrito})

    } catch (error) {
    
   
      console.error('Error al agregar el producto al carrito:', error);
          res.
         
      status(500).json({ status: "error", error: "Error interno del servidor." });
        }
      });
    
      
            
      
      
      


/*

router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cantidad = req.body.cantidad;

if (!cantidad || isNaN(cantidad)) {
      return res.status(400).json({ error: 'Cantidad no válida.' });
    }

    const carritoEncontrado = await cartModel.findOne({__id : cid});
  

if (!carritoEncontrado) {
           return res.status(404).json({ error: 'Carrito no encontrado.' });
    }
     res.json({ mensaje: `Producto ${pid} agregado al carrito ${cid}.` });
  } 
   catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
*/





module.exports = router;





