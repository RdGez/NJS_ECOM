export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IProduct {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string[];
}
