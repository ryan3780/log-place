import { gql } from "@apollo/client";

export const CREATE_NewLog = gql`
  mutation ($oneLineComment: String!, $date: String!, $imageUrl: String! $lat: Float, $longt : Float ) {
    createLog(oneLineComment: $oneLineComment, date: $date, imageUrl: $imageUrl, lat:$lat, longt:$longt) {
      id
      oneLineComment
      date
      imageUrl
      lat
      longt
    }
  }
`;