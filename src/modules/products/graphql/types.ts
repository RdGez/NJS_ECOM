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
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      sku: String!
      price: Float!
      stock: Int!
    ): Product!
  }
`;
