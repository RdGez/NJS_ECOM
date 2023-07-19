import { payment } from 'mercadopago';
import { Response } from "express"
import Stripe from "stripe"
import { HOST, STRIPE_SECRET_KEY } from "../../config/config"

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
    typescript: true,
})

export const createCheckoutSession = async (req: any, res: Response) => {
    await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: 'T-shirt',
                        description: 'Comfortable cotton t-shirt',
                        images: ['https://example.com/t-shirt.png'],
                    },
                    currency: 'usd',
                    unit_amount: 2000,
                }
            }
        ],
        success_url: `${HOST}/payment/checkout-session-completed`,
        cancel_url: `${HOST}/payment/checkout-session-canceled`,
    })
    return res.send("Stripe Checkout Session Created!")
}