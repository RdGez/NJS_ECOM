import { Response } from "express";
import Product from "../products/product.model";
import axios from "axios";
import { auth, PAYPAL_API } from "../../config/config";
import { buildPayload } from "./utils/paypal.payload";
import { getOrder } from "./utils/paypal.request";
import Order from "./orders.model"

export const createPaymentOrder = async (req: any, res: Response) => {
  const { car, deliveryDetails, currency } = req.body;

  const productsToFind = car.map((item: any) => item.product);
  let products = await Product.find({ _id: { $in: productsToFind } })
    .select("name sku price stock")
    .lean();

  if (!products)
    return res.status(400).json({
      ok: false,
      message: `Products not found.`,
    });

  for (let i = 0; i < car.length; i++) {
    if (car[i].quantity > products[i].stock)
      return res.status(400).json({
        ok: false,
        message: `Product ${products[i].name} is out of stock.`,
      });
  }

  let quantity = 0;
  let totalPrice = 0;

  products = products.map<any>((product: any, index: number) => {
    quantity = car[index].quantity;
    totalPrice = quantity * product.price;
    delete product.stock;
    return { ...product, quantity, totalPrice };
  });

  const orderPayload = buildPayload(products, currency);
  const data = await getOrder(orderPayload);
  const total = products.reduce((acc: number, item: any) => acc + item.totalPrice, 0)

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
    { 'paymentDetails.referenceNumber': data.id },
    { status: 'paid' },
  )

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
    { 'paymentDetails.referenceNumber': data.id },
    { status: 'cancelled' },
  )

  return res.send("Payment Canceled!");
};
