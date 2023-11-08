const { Router } = require('express')
const router = Router();
const productsController = require('../controllers/productController.js')
const {isAdmin} = require('../middleware/authorize.js')

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post("/createProduct",  productsController.createProduct);

router.put("/:pid" , isAdmin, productsController.updateProduct);

router.delete("/:pid", isAdmin, productsController.deleteProduct);


module.exports = router

