import { gql } from "@apollo/client";

export const GET_AllLogs = gql`
  query {
    allLogs {
      id
      name
      date
      imageUrl
    }
  }
`;