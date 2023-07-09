import { Schema } from "mongoose";

export const PaymentSchema = new Schema({
    method: {
        required: true,
        type: String,
        enum: ['paypal', 'card'],
    },
    referenceNumber: {
        required: true,
        type: String,
    }
})
