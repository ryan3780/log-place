import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LogCard from "../components/LogCard";
import { GET_AllLogs } from "../gql/logQuery";
import { LogCardElement } from "../types/LogCard";


const Home = () => {

  const [allLogsData, setAllLogsData] = useState<LogCardElement[] | null>([]);
  const { data } = useQuery(GET_AllLogs, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data?.allLogs) {
      setAllLogsData(data.allLogs);
    }
  }, [data]);

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-3 justify-items-center gap-4">
        {allLogsData.map((toy, idx) => {
          return (
            <LogCard key={idx} id={toy.id} name={toy.name} date={toy.date} imageUrl={toy.imageUrl} />
          )
        })}
      </div>
    </div>
  )

}

export default Home;