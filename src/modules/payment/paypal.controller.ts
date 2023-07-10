import axios from "axios";
import { Response } from "express";
import { auth, PAYPAL_API } from "../../config/config";
import { buildPayload } from "./utils/paypal.payload";
import { getOrder } from "./utils/paypal.request";
import { prepareItems } from "./helpers/prepare-items";
import Order from "../orders/orders.model";

export const createPaymentOrder = async (req: any, res: Response) => {
  const { car, deliveryDetails, currency } = req.body;

  const { products, total, error } = await prepareItems(car);

  if (error)
    return res.status(400).json({
      ok: false,
      message: error.message,
    });

  const orderPayload = buildPayload(products, total, currency);
  const data = await getOrder(orderPayload);

  const order = new Order({
    user: req.id,
    products,
    deliveryDetails,
    paymentDetails: {
      method: "paypal",
      referenceNumber: data.id,
    },
    currency,
    total,
  })

  await order.save();

  return res.status(200).json({
    ok: true,
    data,
  });
};

export const captureOrder = async (req: any, res: Response) => {
  const { token } = req.query;
  const { data } = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {},
    { auth }
  );

  await Order.findOneAndUpdate(
    { "paymentDetails.referenceNumber": data.id },
    { status: "paid" }
  );

  return res.send("Payment Captured!");
};

export const cancelOrder = async (req: any, res: Response) => {
  const { token } = req.query;
  const { data } = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/cancel`,
    {},
    { auth }
  );

  await Order.findOneAndUpdate(
    { "paymentDetails.referenceNumber": data.id },
    { status: "cancelled" }
  );

  return res.send("Payment Canceled!");
};
