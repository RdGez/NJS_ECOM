export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IProduct {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  images?: [ IImage ];
  quantity?: number;
  totalPrice?: number;
}

export interface IOrder {
  products: IProduct[];
  user: IUser;
  status: string;
  total: number;
}

export interface IImage {
  public_id: string;
  secure_url: string;
}