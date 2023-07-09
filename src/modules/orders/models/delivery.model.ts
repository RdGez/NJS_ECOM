import { Schema } from "mongoose";

export const DeliveryDetailsSchema = new Schema({
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    zip: {
      type: String || Number,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    telephone: {
      type: String,
      require: true,
    },
  });
  