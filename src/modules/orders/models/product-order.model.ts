import { Schema } from "mongoose";

export const ProductsToOrderSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  sku: {
    required: true,
    type: String,
  },
  quantity: {
    required: true,
    type: Number,
  },
  price: {
    required: true,
    type: Number,
  },
  totalPrice: {
    required: true,
    type: Number,
  },
});
