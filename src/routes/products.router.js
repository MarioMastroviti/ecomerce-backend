const { Router } = require('express')
const router = Router();
const productsController = require('../controllers/productController.js')
const {isAdmin, isPremiun, isUser} = require('../middleware/authorize.js')



router.get("/", productsController.getProducts);

router.get('/createProduct', productsController.getCreateProduct);

router.get("/:productId", productsController.getProductById);

router.post("/createProduct",isAdmin, isPremiun,  productsController.createProduct);

router.put("/:pid" , isAdmin, productsController.updateProduct);

router.delete("/:productId",isAdmin, productsController.deleteProduct);


module.exports = router