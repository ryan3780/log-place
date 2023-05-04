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

export const UPDATE_Log = gql`
mutation ($id : ID!, $oneLineComment: String!, $date: String!, $imageUrl: String! $lat: Float, $longt : Float ){
updateLog(
  id : $id, oneLineComment: $oneLineComment, date: $date, imageUrl: $imageUrl, lat:$lat, longt:$longt) {
    id
    oneLineComment
    date
    imageUrl
    lat
    longt
  }
}
`

export const DELETE_Log = gql`
mutation ($id : ID!) {
  removeLog(id : $id){
    id
  }
}
`