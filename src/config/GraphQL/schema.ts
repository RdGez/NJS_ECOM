import { gql } from "apollo-server-express";
import { 
  types as productTypes, 
  resolvers as productResolvers
} from '../../modules/products/graphql'

export const typeDefs = [ productTypes ]
export const resolvers = [ productResolvers ]
