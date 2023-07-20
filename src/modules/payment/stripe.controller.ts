import { payment } from "mercadopago";
import { Response } from "express";
import Stripe from "stripe";
import { HOST, STRIPE_SECRET_KEY } from "../../config/config";
import { prepareItems } from "./helpers/prepare-items";
import { buildPayload } from "./utils/stripe.payload";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const createCheckoutSession = async (req: any, res: Response) => {
  const { car, deliveryDetails, currency } = req.body;

  try {
    const { products, total, error } = await prepareItems(car);

    if (error)
      return res.status(400).json({
        ok: false,
        message: error.message,
      });

    const payload = buildPayload(products, currency);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      ...payload,
    });

    return res.status(200).json({
      session,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};
