import { HOST } from "../../../config/config";

export const buildPayload = (
  products: any[],
  currency: string
) => {
  const items = products.map((product: any) => ({
    price_data: {
        product_data: {
            name: product.name,
            description: product.description,
            images: product.images.map((image: any) => image.secure_url),   
        },
        currency,
        unit_amount_decimal: product.price,
    },
    quantity: product.quantity,
  }));

  return {
    line_items: items,
    success_url: `${HOST}/payment/checkout-session-completed`,
    cancel_url: `${HOST}/payment/checkout-session-canceled`,
  }
};
