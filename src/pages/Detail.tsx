import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GMap from "../components/GMap";
import { GET_OneLog } from "../gql/logQuery";
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

  return (

    <div>
      {oneLog &&
        <div>
          <img src={oneLog.imageUrl} alt="업로드 이미지" /><div>
            {oneLog.oneLineComment}
          </div><div>
            {oneLog.date}
          </div>
          {oneLog.lat && oneLog.longt &&
            <GMap lat={parseInt(oneLog.lat)} lng={parseInt(oneLog.longt)} />}

        </div>}

    </div>
  )

}

export default Detail;