import { gql } from "@apollo/client";

export const CREATE_NewLog = gql`
  mutation ($name: String!, $date: String!, $imageUrl: String!) {
    createLog(name: $name, date: $date, imageUrl: $imageUrl) {
      id
      name
      date
      imageUrl
    }
  }
`;