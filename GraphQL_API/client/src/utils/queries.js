import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      email
      savedBooks {
        image
        authors
        bookId
        description
        link
        title
      }
      username
    }
  }
`;
