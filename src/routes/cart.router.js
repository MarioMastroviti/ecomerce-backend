const { Router } = require('express')
const router = Router();
const cartController = require('../controllers/cartsController.js')


router.get("/:cid", cartController.getCartById)

router.post("/", cartController.createCart)

router.put("/:cid", cartController.addToCart);

router.delete("/:cid/product/:pid", cartController.removeFromCart);

router.delete("/:cid", cartController.clearCart)

router.put("/:cid/product/:pid", cartController.updateCartItem)
   

module.exports = router;




