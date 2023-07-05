import { Response } from "express";
import Order from "./orders.model";
import Product from "../products/product.model";

export const createOrder = async (req: any, res: Response) => {
  const user = req.id;
  const { products, deliveryDetails } = req.body;

  try {
    const dbProducts = await Product.find({ _id: { $in: products } })
      .select("price")
      .lean();

    const total = dbProducts
      .reduce((acc, curr) => acc + curr.price, 0)
      .toFixed(2);

    const order = new Order({
      user,
      products,
      status: "pending",
      deliveryDetails,
      total,
    });

    await order.save();

    const { _id } = order;
    const orderCreated = await Order.findById(_id)
      .populate([
        { path: "products", select: "name price" },
        { path: "user", select: "name email" },
      ])
      .lean();

    return res.status(200).json({
      ok: true,
      order: orderCreated,
      message: "Order created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};

export const getOrdersByUser = async (req: any, res: Response) => {
  const user = req.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const { docs, ...pagination } = await Order.paginate(
      { user },
      {
        page,
        limit,
        populate: [
          { path: "products", select: "name price" },
          { path: "user", select: "name email" },
        ],
      }
    );

    return res.status(200).json({
      ok: true,
      orders: docs,
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};

export const getOrders = async (req: any, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const { docs, ...pagination } = await Order.paginate(
      {},
      {
        page,
        limit,
        populate: [
          { path: "products", select: "name price" },
          { path: "user", select: "name email" },
        ],
      }
    );

    return res.status(200).json({
      ok: true,
      orders: docs,
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};

export const updateOrder = async (req: any, res: Response) => {
  const { id } = req.params;
  const { ...args } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, args, { new: true })
    
    return res.status(200).json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};
