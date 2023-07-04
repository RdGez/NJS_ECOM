import jwt from "jsonwebtoken";

export default (id: string, role: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign( { id, role }, `${process.env.JWT_SECRET}`, { expiresIn: "24h" },
      (err, token) => {
        if (err) reject("Failed to sign token correctly.");
        resolve(token);
      }
    );
  });
};
