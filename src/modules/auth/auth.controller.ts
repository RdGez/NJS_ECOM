import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../../shared/models/User.model";
import signJwt from "./utils/helpers/sign.jwt";

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hasUser = await User.findOne({ email: email.toLowerCase() });
    if (hasUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const user = new User(req.body);
    const salt = bcrypt.genSaltSync();

    user.email = email.toLowerCase();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();

    const token = await signJwt(user.id, user.role);
    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: "This user is not registered.",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(404).json({
        message: "Email or password incorrect.",
      });
    }

    const token = await signJwt(user.id, user.role);
    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const renewToken = async (req: any, res: Response) => {
  const id = req.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const token = await signJwt(id, user.role);

  if (!token || !user) {
    return res.status(404).json({
      message: "User not authenticated.",
    });
  }

  return res.status(200).json({
    ok: true,
    user,
    token,
  });
};
