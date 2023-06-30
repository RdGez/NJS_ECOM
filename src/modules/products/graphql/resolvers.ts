import { uploadImage } from "../../../shared/utils/cloudinary.upload";
import { GraphQLUpload } from "graphql-upload-minimal";
import Product from "../product.model";

const getAllProducts = async (_, args) => {
  const { limit = 10, page = 0 } = args;
  const { docs, ...pagination } = await Product.paginate({}, { limit, page });

  return {
    products: docs,
    pagination,
  };
};

const getProductById = async (_, args) => {
  const product = await Product.findById(args.id);
  return product;
};

const createProduct = async (_, { docs, ...data }) => {
  const product = new Product(data);
  const { _id } = await product.save();

  if (docs) {
    const imageUrl: string[] = [];

    for (const doc of docs) {
      const { createReadStream } = await doc;
      const stream = createReadStream();

      const { secure_url } = await uploadImage(stream);
      imageUrl.push(secure_url);
    }

    const product = await Product.findByIdAndUpdate(_id, { imageUrl }, { new: true });
    return product;
  }

  return product;
};

const updateProduct = async (_, args) => {
  const id = args.id;

  try {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    const productUpdated = await Product.findByIdAndUpdate(id, args.product, {
      new: true,
    });
    return productUpdated;
  } catch (error) {
    console.error(error);
  }
};

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getAllProducts,
    getProductById,
  },
  Mutation: {
    createProduct,
    updateProduct,
  },
};
