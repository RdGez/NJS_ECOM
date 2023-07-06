import { HOST } from "../../../config/config";

export const buildPayload = (products: any, currency: string) => {
    const items = products.map((product: any) => ({
      name: product.name,
      sku: product.sku,
      unit_amount: {
        currency_code: currency,
        value: product.price,
      },
      quantity: product.quantity,
    }));
  
    const total = products.reduce((acc: number, product: any) => acc + product.totalPrice, 0)
  
    const amount = {
      currency_code: currency,
      value: total,
      breakdown: {
        item_total: {
          currency_code: currency,
          value: total
        }
      }
    }
  
    return {
      intent: "CAPTURE",
      purchase_units: [
        {
          items,
          amount,
        },
      ],
      application_context: {
        user_action: "PAY_NOW",
        brand_name: "RdGez Store",
        landing_page: "NO_PREFERENCE",
        return_url: `${HOST}/orders/capture-order`,
        cancel_url: `${HOST}/orders/cancel-order`,
      },
    };
  };
  