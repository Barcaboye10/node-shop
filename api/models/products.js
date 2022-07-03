const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // name: String,
  // price: Number

  /** When we do it in the way as above, we do not 
    use validation, i.e. If we do not add any one
     of the fields in the POST request, it will be
    a valid POST request. Since books in DB should
    have a price, we do not want that, hence we need
    validators, provided by mongoose, like so */

  name: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema)