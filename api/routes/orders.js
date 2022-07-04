const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

router.get('/', (req, res) => {
    Order.find()
      .select('_id product quantity')
      .exec()
      .then((docs) => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    id: doc._id,
                    ProductID: doc.product,
                    Quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/orders/" + doc._id
                    }
                }
            })
            
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
})

router.post('/', (req,res) => {
    Product.findById(req.body.productId)
      .then((product) => {
        if(product== null) {
            return res.status(404).json({
                message:'Product not found'
            })            
        }
        const order = new Order({
            _id:mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product:  req.body.productId
        });
        return order.save();
      })
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Orders were placed",
          createdOrder: {
            id: result._id,
            ProductID: result.product,
            Quantity: result.quantity,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
})

router.get('/:orderId',  (req,res) => {
    Order.findById(req.params.orderId)
      .select("_id product quantity")
      .exec()
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            message: "Order Details",
            orderCreated: doc
          });
        }
        else {
            res.status(404).json({
                message: 'Order not found'
            })
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
})

router.delete('/:orderId', (req, res) => {
    Order.remove({ _id: req.params.orderId })
      .exec()
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(500).json({
            error: err,
            result
        })
      });
})

module.exports = router;