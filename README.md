<br>
<p align="center">
  <a href="https://nodejs.org/en/" target="blank"><img src="https://nodejs.org/static/images/logo.svg" width="200" alt="Nest Logo" /></a>
</p>
<br>

# eCommerse API

### 📦 Stack:
| Technlogie | Version |
|------|---------|
| Express JS | 4.18.2 |
| GraphQL | 16.7.1 |
| MongoDB | 6.0 |
| Mongoose | 7.3.1 |


### 🚀 Run Application:

1. Execute `yarn` to install all dependencies:
```
$ yarn
```
1. Create `.env` file in the root directory:
```
# Example .env file

PORT=3000
MONGO_PASSWORD=yourUser
MONGO_USERNAME=yourPassword
MONGO_DB_NAME=ecom_db
JWT_SECRET=yourSecretKey
MONGO_URI=mongodb://<user>:<password>@localhost:27017/
```
3. Init `Docker-Compose` to start database volumes:
```
$ docker compose up -d
```
4. Start applicacion on `dev` mode:
```
$ yarn start:dev
```