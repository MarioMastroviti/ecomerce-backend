const { Router } = require('express')
const { cartModel } = require('../models/cart.model');
const { productsModel } = require('../models/products.model');
const router = Router();




router.get("/:cid", async (req, res) => {
  const {cid}  = req.params;

  const carritoBuscado = await cartModel.findOne({ _id: cid })


  if (!carritoBuscado) {
    return res.status(404).json({ error: 'carrito no encontrado.' });
  }

  return res.json(carritoBuscado);
})


router.post("/", async (req, res) => {
  try {
    const { uid } = req.body;

    const cart = await cartModel.create({ user: uid });

    return res.status(201).send({ cart });

  } catch (error) {
    res.status(500).send(error);
  }
});



router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const {pid, quantity = 1} = req.body;

 
    const carrito = await cartModel.findOne({ _id: cid })
    const product = await productsModel.findOne({ _id: pid })
  

    if (!product || !carrito) {
      return res.send({ status: "error", error: "producto o carrito no encontrado" })
    }

    const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(pid));

    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      carrito.products.push({ product: pid, quantity: quantity });
    }

    cartModel.updateOne({_id: cid}, carrito)

    return res.status(200).json({ status: "success", payload: carrito });

  } catch (error) {


    console.error('Error al agregar el producto al carrito:', error);
    res.

      status(500).json({ status: "error", error: "Error interno del servidor." });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid , pid } = req.params;


    const carrito = await cartModel.findOne({ _id : cid });
    if(!carrito){
      return res.status(400).json({ status: "error", error: "Carrito no existe" });
    }
    const existingProduct = carrito.products.filter(item => item.product!=pid);
    if(!existingProduct){
      return res.status(400).json({ status: "error", error: "Producto no existe en el carrito" });
    } else{
      carrito.products = existingProduct
      carrito.save()
    }
   
    return res.status(201).send({ carrito });
   
  } catch (error) {
 
    return res.status(400).json({ status: "error", error: "no se pudo eliminar el producto" });


  }
});



router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const carrito = await cartModel.findOne({ _id : cid });
    if(!carrito){
      return res.status(400).json({ status: "error", error: "Carrito no existe" });
    }
   
      carrito.products.splice(0, carrito.products.length);
      cartModel.updateOne({_id: cid}, carrito)
    
   
    return res.status(201).send({ carrito });
   
  } catch (error) {
 
    return res.status(400).json({ status: "error", error: "no se pudo eliminar el producto" });

  }
});







   router.put("/:cid/product/:pid", async (req, res) => {
     try {

    const { cid , pid} = req.params;
    const quantity = parseInt(req.body.quantity);

    if (quantity <= 0) {
      return res.send({ status: "error", error: "ingresar al menos una unidad del producto" })
    }

    const carrito = await cartModel.findOne({ _id: cid })
    const product = await productsModel.findOne({ _id: pid })
  

    if (!product || !carrito) {
      return res.send({ status: "error", error: "producto o carrito no encontrado" })
    }

    const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(pid));

    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      return res.status(400).json({ status: "error", error: "producto no agregado al carrito" });
    }

    cartModel.updateOne({_id: cid}, carrito)

    return res.status(200).json({ status: "success", payload: carrito });

  } catch (error) {


    console.error('Error al agregar el producto al carrito:', error);
    res.

      status(500).json({ status: "error", error: "Error interno del servidor." });
  }
   });
   

   








module.exports = router;




