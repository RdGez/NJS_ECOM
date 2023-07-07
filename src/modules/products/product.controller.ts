import Product from "./product.model";

export const getProducts = async (args) => {
  const { limit = 10, page = 0 } = args;

  try {
    const { docs, ...pagination } = await Product.paginate({}, { limit, page });

    return {
      products: docs,
      pagination,
    };
  } catch (error) {
    console.info(error);
    return {
      error: {
        code: "SERVER_ERROR",
        message: "Products not found.",
      },
    };
  }
};

export const getProduct = async (id: string) => {
  try {
    const product = await Product.findById(id);
    return {
      product,
    };
  } catch (error) {
    console.info(error);
    return {
      error: {
        code: "SERVER_ERROR",
        message: "Product not found.",
      },
    };
  }
};

export const registerProduct = async (args) => {
  try {
    const skuExist = await Product.findOne({ sku: args.sku });
    if (skuExist)
      return {
        error: {
          code: "SKU_ALREADY_EXISTS",
          message: "This product already exists.",
        },
      };

    const productSave = new Product(args);
    const product = await productSave.save();

    return {
      product,
    };
  } catch (error) {
    console.info(error);
    return {
      error: {
        code: "SERVER_ERROR",
        message: "Product not created.",
      },
    };
  }
};

export const modifyProduct = async (args) => {
  const id = args.id;

  try {
    const { error } = await getProduct(id);
    if (error) return { error };

    const product = await Product.findByIdAndUpdate(id, args.product, {
      new: true,
    });

    return {
      product,
    };
  } catch (error) {
    console.info(error);
    return {
      error: {
        code: "SERVER_ERROR",
        message: "Product not updated.",
      },
    };
  }
};
