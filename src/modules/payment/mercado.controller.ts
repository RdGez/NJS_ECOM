import { Response } from "express";
import { HOST, MERCADO_PAGO_ACCESS_TOKEN } from "../../config/config";
import { prepareItems } from "./helpers/prepare-items";
import mercadopago from "mercadopago";

export const createPreference = async (req: any, res: Response) => {
  const { car, deliveryDetails, currency } = req.body;

  try {
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

    const data = await mercadopago.preferences.create({ 
      items,
      back_urls: {
        success: `${HOST}/payment/capture-payment`,
        failure: `${HOST}/payment/failure-payment`,
        pending: `${HOST}/payment/pending-payment`,
      },
      notification_url: `${HOST}/payment/webhook-payment`,
    });

    res.status(200).json({
      id: data.body.id,
      link: data.body.init_point,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

export const webHook = async (req: any, res: Response) => {
  console.log(req.body);
  console.log(req.query);

  res.send("ok");
}