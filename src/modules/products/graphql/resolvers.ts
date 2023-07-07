import {
  deleteimages,
  uploadImage,
} from "../../../shared/utils/cloudinary.upload";
import { GraphQLUpload } from "graphql-upload-minimal";
import {
  getProducts,
  getProduct,
  registerProduct,
  modifyProduct,
} from "../product.controller";
import Product from "../product.model";
import { errorHandler } from "../../../shared/utils/graphql.error.handler";

const getAllProducts = async (_, args) => {
  const { error, ...products } = await getProducts(args);
  if (error) errorHandler(error);

  return products;
};

const getProductById = async (_, args) => {
  const { error, product } = await getProduct(args.id);
  if (error) errorHandler(error);

  return product;
};

const createProduct = async (_, args) => {
  const { error, product } = await registerProduct(args);
  if (error) errorHandler(error);

  return product;
};

const updateProduct = async (_, args) => {
  const { error, product } = await modifyProduct(args);
  if (error) errorHandler(error);

  return product;
};

const uploadProductImages = async (_, { id, docs }) => {
  const { error, product } = await getProduct(id);
  if (!error) errorHandler(error);

  if ( product && product.images && product.images.length > 0) {
    const fileNames = product.images.map((image) => image.public_id);
    await deleteimages(fileNames);
  }

  const images: Object[] = [];

  for (const doc of docs) {
    const { createReadStream } = await doc;
    const stream = createReadStream();

    const { public_id, secure_url } = await uploadImage(stream);

    images.push({
      public_id,
      secure_url,
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
