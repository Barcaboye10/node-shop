const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OrdersController = require('../controllers/orders');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/orders');
const Product = require('../models/products');

router.get('/',checkAuth , OrdersController.orders_get_all)

router.post('/',checkAuth , OrdersController.order_create_order)

router.get('/:orderId',checkAuth , OrdersController.order_get_one)

router.delete('/:orderId', checkAuth , OrdersController.order_delete_order)

module.exports = router;