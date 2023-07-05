import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { IOrder } from "../../shared/interfaces/schema.interfaces";
import { DeliveryDetailsSchema } from "./delivery.schema";

const OrderSchema = new Schema(
  {
    products: {
      required: true,
      type: [Schema.Types.ObjectId],
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
      enum: ["pending", "sent", "delivered", "canceled"],
      default: "pending",
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
    }
  },
  { timestamps: true }
);

OrderSchema
.plugin(mongoosePaginate)
.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

export default model<IOrder, mongoose.PaginateModel<IOrder>>("Order", OrderSchema);