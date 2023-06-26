import { Schema, model } from "mongoose";
import { IProduct } from "../../shared/interfaces/schema.interfaces";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    tags: {
      type: [String],
      require: false,
    },
    imageUrl: {
      type: [String],
      require: false,
    },
  },
  { timestamps: true }
);

ProductSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;

  return object;
});

export default model<IProduct>("Product", ProductSchema);