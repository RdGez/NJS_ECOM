import Product from "../../products/product.model";

interface Item {
  product: string;
  quantity: number;
}

export const prepareItems = async (items: Item[]) => {
  try {
    const productsToFind = items.map((item: any) => item.product);
    let products = await Product.find({ _id: { $in: productsToFind } }).select(
      "name sku price stock"
    );

    if (items.length !== products.length)
      return {
        error: {
          message: `Products not found.`,
        },
      };

    for (let i = 0; i < items.length; i++) {
      if (items[i].quantity > products[i].stock)
        return {
          error: {
            message: `Product ${products[i].name} is out of stock.`,
          },
        };
    }

    const car = products.map((product: any, index: number) => {
      const quantity = items[index].quantity;
      const totalPrice = quantity * product.price;

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity,
        totalPrice,
      };
    });

    return {
      products: car,
      total: car.reduce(
        (acc: number, product: any) => acc + product.totalPrice,
        0
      ),
    };
  } catch (error) {
    console.log(error);
    return {
      error: {
        message: `Products not found.`,
      },
    };
  }
};
