import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GMap from "../components/GMap";
import { DELETE_Log } from "../gql/logMutation";
import { GET_OneLog } from "../gql/logQuery";
import { useRouter } from "../hooks/useRouter";
import { LogCardElement } from "../types/LogCard";

const Detail = () => {

  const { id } = useParams();

  const [oneLog, setOneLog] = useState<LogCardElement | null>();
  const { data } = useQuery(GET_OneLog, {
    fetchPolicy: "no-cache",
    variables: { id: Number(id) }
  });

  useEffect(() => {
    if (data?.Log) {
      setOneLog(data.Log);
    }
  }, [data]);


  const { routeTo } = useRouter()

  const updateLog = () => {
    routeTo(`/edit/${id}`, oneLog)
  }

  const [deleteLog] = useMutation(DELETE_Log);

  const DeleteLog = () => {

    deleteLog({
      variables: {
        id: Number(id)
      }
    }).then(() => {
      routeTo('/')
    });

  }

  return (

    <div>
      <div className="justify-evenly flex">
        <button onClick={updateLog} className="cursor-pointer">Edit</button>
        <button onClick={DeleteLog} className="cursor-pointer">Delete</button>
      </div>
      {oneLog &&
        <div>

          <div>
            <img src={oneLog.imageUrl} alt="업로드 이미지" /><div>
              {oneLog.oneLineComment}
            </div><div>
              {oneLog.date}
            </div>
            {oneLog.lat && oneLog.longt &&
              <GMap lat={parseInt(oneLog.lat)} lng={parseInt(oneLog.longt)} />}
          </div>
        </div>}

    </div>
  )

}

export default Detail;