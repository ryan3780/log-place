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

export const GET_OneLog = gql`
query ($id : ID!) {
  Log(id : $id) {
    id
    oneLineComment
    date
    imageUrl
    lat
    longt
  }
}
`