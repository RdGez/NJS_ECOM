import { uploadImage } from "../../../shared/utils/cloudinary.upload";
import { GraphQLUpload } from "graphql-upload-minimal";
import Product from "../product.model";

const getAllProducts = async (_, args) => {
  const { limit = 10, page = 0 } = args;
  const { docs, ...pagination } = await Product.paginate({ }, { limit, page });

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
  const skuExist = await Product.findOne({ sku: data.sku });
  if (skuExist) throw new Error("This product already exists.");

  const product = new Product(data);
  const dbProduct = await product.save();

  return dbProduct;
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

const uploadProductImages = async (_, { id, docs }) => {
  if (!docs) throw new Error("You must upload at least one image.");

  const images: Object[] = [];

  for (const doc of docs) {
    const { createReadStream } = await doc;
    const stream = createReadStream();

    const { public_id, secure_url } = await uploadImage(stream);
    const name = public_id.split("/")[1];

    images.push({
      public_id: name,
      secure_url: secure_url,
    });
  }
  
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    { images },
    { new: true }
  );

  return updatedProduct;
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
    uploadProductImages,
  },
};
