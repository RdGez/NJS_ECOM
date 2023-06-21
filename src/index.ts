import dotenv from 'dotenv'
import AppServer from './config/server.config'

dotenv.config()
const Server = new AppServer()
Server.listen()
