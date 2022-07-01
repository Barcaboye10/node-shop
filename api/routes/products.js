const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");

const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const productInstance = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  productInstance
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: productInstance,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
          error: err
      })
    });
 
});

// '/:productId' here, anything after : is the name of the parameter in request
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .exec()
      .then((doc) => {
        console.log(doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({
            message: "No Book found for corresponding ID",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
          console.log(result);
          res.status(200).json(result)
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      });
});

router.delete("/:productId", (req, res) => {
    const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        })
    });
});

module.exports = router;
