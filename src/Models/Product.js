const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
    },
    availableQty: {
      type: Number,
      default: 0,
    },
    qtyPerUnit: {
      type: Number,
      default: 0,
    },
    unitOfSale: {
      type: String,
    },

    minimumQty: {
      type: Number,
      default: 0,
    },
    domain: {
      type: String,
      default: "smart",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", ProductSchema);
// const enumRole= Admin.schema.path('role').enumValues
module.exports = Product;
