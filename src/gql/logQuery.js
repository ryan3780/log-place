import { gql } from "@apollo/client";

export const GET_AllLogs = gql`
  query {
    allLogs {
      id
      oneLineComment
      date
      imageUrl
      lat
      longt
    }
  }
`;