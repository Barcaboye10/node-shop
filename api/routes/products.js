const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");

const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id") //Only select these fields from DB
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        // products: docs

/** 
* We are sending whole doc above, what we
* usually would want to do is to send a
* response in a different response structure
* than the doc, with (maybe) some additional
* data (like the url for complete data on a
* book in this case). Hence, we do that in 
* following manner.
*/

        products: docs.map(doc => {
          return{
            name: doc.name,

/**
* To send a request to get complete info for a book,
* we need to have a link for that, which
* will be a GET request with ID of that book, as 
* defined in this file itself.
*/
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/'+doc._id
            }
            
          }
        })
      }
      res.status(200).json(response);
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
        message: "Added Book to DB with ID: "+productInstance._id,
        createdProduct: {
          name: productInstance.name,
          price: productInstance.price,
          id: productInstance._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/products/" + result._id

          }
        },
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
      .select('_id name price')
      .exec()
      .then((doc) => {
        console.log(doc);
        if (doc) {
          res.status(200).json({
             product: doc,
             request: {
              type: 'GET',
              description: 'Get all products',
              url: 'http://localhost:3000/products/'
             }
            });

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
/**
 * The below loop is to enable that we can only pass 
 * new name or new price, we do not need to change 
 * other fields.
 */
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
          res.status(200).json({
            message: 'Product updated',
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
            }
            
          })
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
