const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
/**
 * here Product field will have an object, and it
 * needs to have a relation with Products schema (like
 * in relational DB, so we give ref as 'Products';few
 * relations in non relational DBs are fine)
 * */

  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model('Order', orderSchema);