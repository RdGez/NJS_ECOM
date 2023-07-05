import { Response } from "express";
import Product from "../products/product.model";
import axios from "axios";
import {
  PAYPAL_API,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET_KEY,
} from "../../config/config";

export const createPaymentOrder = async (req: any, res: Response) => {
  const { products, currency } = req.body;

  const dbProducts = await Product.find({ _id: { $in: products } })
    .select("price stock")
    .lean();

  if (dbProducts) {
    dbProducts.forEach((product) => {
      if (product.stock <= 0) {
        return res.status(400).json({
          ok: false,
          message: `Product ${product.name} is out of stock.`,
        });
      }
    });
  }

  const total = dbProducts
    .reduce((acc, curr) => acc + curr.price, 0)
    .toFixed(2);

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: total,
          breakdown: {
            item_total: {
              currency_code: currency,
              value: total,
            },
          },
        },
      },
    ],
    application_context: {
      brand_name: "eCommerse",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${process.env.HOST}/orders/capture-order`,
      cancel_url: `https://www.paypal.com`,
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const {
    data: { access_token },
  } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET_KEY,
    },
  });

  const { data } = await axios.post(
    `${process.env.PAYPAL_URL}/v2/checkout/orders`,
    order,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

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
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET_KEY,
      },
    }
  );
  
  return res.send("ok");
};
