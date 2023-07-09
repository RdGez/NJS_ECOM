import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IOrder } from "../../shared/interfaces/schema.interfaces";
import { DeliveryDetailsSchema, PaymentSchema, ProductsToOrderSchema } from "./models";

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
    paymentDetails: {
      type: PaymentSchema,
      required: true,
    },
    currency: {
      required: true,
      type: String,
      default: "MXN",
    },
    total: {
      required: true,
      type: Number,
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
