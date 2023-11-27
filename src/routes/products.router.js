const { Router } = require('express')
const router = Router();
const productsController = require('../controllers/productController.js')
const {isAdmin, isPremiun} = require('../middleware/authorize.js')



router.get("/", productsController.getProducts);

router.get("/getProductById/:pid",  productsController.getProductById);

router.get('/createProduct' , productsController.getCreateProduct)

router.post("/createProduct",  productsController.createProduct);

router.put("/:pid" , isAdmin, productsController.updateProduct);

router.delete("/:pid", productsController.deleteProduct);


module.exports = router