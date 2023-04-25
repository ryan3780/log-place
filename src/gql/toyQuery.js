import { gql } from "@apollo/client";

export const GET_AllToys = gql`
  query {
    allToys {
      id
      name
      price
      imageUrl
    }
  }
`;