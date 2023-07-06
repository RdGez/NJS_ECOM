import axios from "axios";
import { PAYPAL_API, auth } from "../../../config/config";

const accessToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const { data } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, { auth });
  return data.access_token;
};

export const getOrder = async (payload: any) => {
  const token = await accessToken();

  const { data } = await axios.post(
    `${process.env.PAYPAL_URL}/v2/checkout/orders`, payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    id : data.id,
    status : data.status,
    link: data.links[1].href,
  }
};
