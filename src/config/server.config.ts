import { mongoConnection } from "./db.config";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";

import { ApolloServer } from "apollo-server-express";
import { IContext, context } from './GraphQL/context';
import { typeDefs, resolvers } from "./GraphQL/schema";

import authRoutes from "../modules/auth/auth.routes";
import orderRoutes from "../modules/orders/orders.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import { graphqlUploadExpress } from "graphql-upload-minimal";

dotenv.config();

class Server {
  private _port: String;
  private _app: Application;

  constructor() {
    this._app = express();
    this._port = process.env.PORT || "3001";
    if (isNaN(Number(this._port)))
      throw new Error(`Invalid port: ${this._port}`);

    this.middlewares();
    this.initialize();
    this.routes();
  }

  async initialize() {
    await mongoConnection();
  }

  middlewares() {
    this._app.use(cors());
    this._app.use(morgan("dev"));
    this._app.use(express.json());
    this._app.use(express.static("public"));
    this._app.use( '/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }))
  }

  async listen() {
    const apolloServer = new ApolloServer<IContext>({
      typeDefs,
      resolvers,
      context
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app: this._app });

    this._app.listen(this._port, () =>
      console.log(`Server Running At: http://localhost:${process.env.PORT} 🚀`)
    );
  }

  routes() {
    this._app.use("/api/auth", authRoutes);
    this._app.use("/api/orders", orderRoutes);
    this._app.use("/api/payment", paymentRoutes);
  }
}

export default Server;
