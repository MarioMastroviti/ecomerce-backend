const { Router } = require('express')
const router = Router();
const productsController = require('../controllers/productController.js')

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post("/", productsController.createProduct);

router.put("/:pid" , productsController.updateProduct);

router.delete("/:pid",productsController.deleteProduct);


module.exports = router
