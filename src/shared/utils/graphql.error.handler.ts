import { GraphQLError } from "graphql";

export const errorHandler = (error: any) => {
  throw new GraphQLError(error.message, {
    extensions: {
      code: error.code,
    },
  });
};
