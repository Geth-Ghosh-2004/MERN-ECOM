const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsByAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controllers");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsByAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
