import { Response } from "express";
import mercadopago from "mercadopago";
import { MERCADO_PAGO_ACCESS_TOKEN } from "../../config/config";
import Product from "../products/product.model";

export const createPreference = async (req: any, res: Response) => {
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

  mercadopago.configure({
    access_token: MERCADO_PAGO_ACCESS_TOKEN,
  });

  const items = products.map((product: any) => ({
    title: product.name,
    unit_price: product.price,
    quantity: product.quantity,
    currency_id: currency,
  }));

  const data = await mercadopago.preferences.create({ items });
  console.log(data)

  res.send("Create Preference");
};
