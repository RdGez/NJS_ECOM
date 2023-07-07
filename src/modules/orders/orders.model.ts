import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IOrder } from "../../shared/interfaces/schema.interfaces";
import { DeliveryDetailsSchema } from "./delivery.schema";

const ProductsToOrderSchema = new Schema({
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
  }
});

const OrderSchema = new Schema(
  {
    products: {
      required: true,
      type: [ProductsToOrderSchema],
      ref: "Product",
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      required: true,
      type: String,
      enum: ['created', 'paid', 'cancelled', 'pending', 'sent', 'delivered'],
      default: "created",
    },
    deliveryDetails: {
      type: DeliveryDetailsSchema,
      required: true,
    },
    total: {
      required: true,
      type: Number,
    },
    currency: {
      required: true,
      type: String,
      default: "MXN",
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate).method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  return object;
});

export default model<IOrder, mongoose.PaginateModel<IOrder>>(
  "Order",
  OrderSchema
);
