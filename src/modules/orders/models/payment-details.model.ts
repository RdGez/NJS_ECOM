import { Schema } from "mongoose";

export const PaymentSchema = new Schema({
    method: {
        required: true,
        type: String,
        enum: ['paypal', 'mercadopago', 'card'],
    },
    referenceNumber: {
        required: false,
        type: String,
    }
})
