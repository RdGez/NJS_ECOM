import { Response } from "express";
import { HOST, MERCADO_PAGO_ACCESS_TOKEN } from "../../config/config";
import { prepareItems } from "./helpers/prepare-items";
import mercadopago, { payment } from "mercadopago";
import Order from "../orders/orders.model";

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
      description: product.description,
      unit_price: product.price,
      quantity: product.quantity,
      currency_id: currency,
      total_amount: product.totalPrice,
    }));

    const order = new Order({
      user: req.id,
      products,
      deliveryDetails,
      paymentDetails: {
        method: "mercadopago",
      },
      currency,
      total,
    })

    const { _id } = await order.save();

    const data = await mercadopago.preferences.create({ 
      items,
      shipments: {
        receiver_address: {
          zip_code: String(deliveryDetails.zipCode),
          street_name: deliveryDetails.address,
          state_name: deliveryDetails.state,
          city_name: deliveryDetails.city,
        },
      },
      back_urls: {
        failure: `${HOST}/payment/failure-payment`,
      },
      external_reference: _id.toString(),
      notification_url: `https://6a01-201-160-222-156.ngrok-free.app/api/payment/webhook-payment`,
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

export const failurePayment = async (req: any, res: Response) => {
  const _id =  req.query.external_reference;
  
  try {
    await Order.findByIdAndUpdate(_id, { status: 'cancelled' });
    res.send('Payment Cancelled');
  } catch (error) {
    console.log(error)
    res.send('error');
  }
}

export const webHook = async (req: any, res: Response) => {
  const response = req.query;

  try {
    if (response.type === 'payment') {
      const payment = await mercadopago.payment.findById(response['data.id']); 
      const _id = payment.response.external_reference;
      await Order.findByIdAndUpdate(_id, { status: 'paid' });
    }
    res.send('ok');
  } catch (error) {
    res.send('error');
    console.log(error)
  }
}