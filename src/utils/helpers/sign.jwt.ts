import jwt from "jsonwebtoken";

export default (id: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign( { id }, `${process.env.JWT_SECRET}`, { expiresIn: "24h" },
      (err, token) => {
        if (err) reject("Failed to sign token correctly.");
        resolve(token);
      }
    );
  });
};
