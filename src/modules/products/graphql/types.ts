import { gql } from "apollo-server-express";

export const types = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Images {
    public_id: String
    secure_url: String
  }

  type Product {
    id: ID
    name: String
    description: String
    sku: String
    price: Float
    stock: Int
    images: [Images]
    createdAt: String
    updatedAt: String
  }

  type Pagination {
    totalDocs: Int
    offset: Int
    limit: Int
    totalPages: Int
    page: Int
    pagingCounter: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    prevPage: Int
    nextPage: Int
  }

  type ProductsResponse {
    products: [Product]
    pagination: Pagination
  }

  input ProductInput {
    name: String
    description: String
    sku: String
    price: Float
    stock: Int
  }

  type Query {
    getAllProducts(page: Int, limit: Int): ProductsResponse!
    getProductById(id: ID!): Product!
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      sku: String!
      price: Float!
      stock: Int!
    ): Product
    updateProduct(id: ID!, product: ProductInput!): Product!
    uploadProductImages(id: ID!, docs: [Upload!]!): Product!
  }
`;
