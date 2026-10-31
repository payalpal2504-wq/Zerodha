const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

router.use(authMiddleware);

router.get("/", ordersController.getOrders);
router.post("/", validate(ordersController.orderSchema), ordersController.placeOrder);

module.exports = router;
