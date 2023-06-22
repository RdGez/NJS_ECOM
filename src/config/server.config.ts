import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import { mongoConnection } from "./db.config"
import express, { Application } from "express"

dotenv.config()

class Server {
  private _port: String;
  private _app: Application;

  constructor() {
    this._app = express();
    this._port = process.env.PORT || "3001";
    if (isNaN(Number(this._port)))
      throw new Error(`Invalid port: ${this._port}`)

    this.middlewares()
    this.initialize()
  }

  async initialize() {
    await mongoConnection()
  }

  middlewares() {
    this._app.use(cors())
    this._app.use(morgan("dev"))
    this._app.use(express.json())
    this._app.use(express.static("public"))
  }

  listen() {
    this._app.listen(this._port, () =>
      console.log(`Server Running At: http://localhost:${process.env.PORT} 🚀`)
    )
  }
}

export default Server
