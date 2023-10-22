import { gql } from "@apollo/client";

export const QUERY_GET_ME = gql`
  query me {
    User {
      _id
      username
      email
      savedBooks
    }
  }
`;
