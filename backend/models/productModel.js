const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: String,
  brandName: String,
  category: String,
  productImage: [],  // You can explicitly define it as an array of strings
  description: String,
  price: Number,
  sellingPrice: Number,
}, {
  timestamps: true  // ✅ correct spelling
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
