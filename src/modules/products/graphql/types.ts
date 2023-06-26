import { gql } from "apollo-server-express";

export const types = gql`
  type Product {
    id: ID
    name: String
    description: String
    sku: String
    price: Float
    stock: Int
    imageUrl: [String]
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAllProducts: [Product!]
    getProductById(id: ID!): Product!
  }

  input ProductInput {
    name: String
    description: String
    sku: String
    price: Float
    stock: Int
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      sku: String!
      price: Float!
      stock: Int!
    ): Product!

    updateProduct(
      id: ID!
      product: ProductInput!
    ): Product!
  }
`;
