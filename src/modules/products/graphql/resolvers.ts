import Product from "../product.model";

const getAllProducts = async () => {
  const products = await Product.find().limit(16);
  return products;
};

const getProductById = async (_, args) => {
  const product = await Product.findById(args.id);
  return product;
}

const createProduct = async (_, args) => {
  const product = new Product(args);
  await product.save();

  return product;
};

const updateProduct = async (_, args) => {
  const id = args.id;

  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    const productUpdated = await Product.findByIdAndUpdate(id, args.product, { new: true });
    return productUpdated;
  } catch (error) {
    console.error(error)
  }
}

export const resolvers = {
  Query: {
    getAllProducts,
    getProductById,
  },
  Mutation: {
    createProduct,
    updateProduct
  },
};
