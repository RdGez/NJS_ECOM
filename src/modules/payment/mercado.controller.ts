import { Response } from "express";
import { MERCADO_PAGO_ACCESS_TOKEN } from "../../config/config";
import { prepareItems } from "./helpers/prepare-items";
import mercadopago from "mercadopago";

export const createPreference = async (req: any, res: Response) => {
  const { car, deliveryDetails, currency } = req.body;

  const { products, total, error } = await prepareItems(car);

  if (error)
    return res.status(400).json({
      ok: false,
      message: error.message,
    });

  mercadopago.configure({
    access_token: MERCADO_PAGO_ACCESS_TOKEN,
  });

  const items = products.map((product: any) => ({
    title: product.name,
    unit_price: product.price,
    quantity: product.quantity,
    currency_id: currency,
    total_amount: product.totalPrice,
  }));

  const data = await mercadopago.preferences.create({ items });
  console.log(data);

  res.send("Create Preference");
};
