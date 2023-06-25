import Product from "../product.model";

const getAllProducts = async () => {
  const products = await Product.find().limit(16);
  return products;
};

const createProduct = async (_, args) => {
  const product = new Product(args);
  await product.save();

  return product;
};

export const resolvers = {
  Query: {
    getAllProducts,
  },
  Mutation: {
    createProduct,
  },
};
