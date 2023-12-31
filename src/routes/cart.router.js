const { Router } = require('express')
const router = Router();
const cartController = require('../controllers/cartsController.js');
const { isUser, isPremiun } = require('../middleware/authorize.js');


router.get("/:cartId", cartController.getCartById)

router.post("/:userId", cartController.createCart)

router.put("/:cartId/:pid",  cartController.addToCart);

router.delete("/:cid/product/:pid", isUser, cartController.removeFromCart);

router.delete("/:cid" ,  isUser, cartController.clearCart)

router.put("/:cid/product/:pid", isUser, cartController.updateCartItem)
   
router.post("/:cid/purchase",  isUser, cartController.purchaseCart);



module.exports = router;


