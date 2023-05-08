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


  let gridEnd = Math.floor(allLogsData.length / 3)

  let log1 = [...allLogsData.slice(0, gridEnd)]
  let log2 = [...allLogsData.slice(gridEnd, gridEnd * 2)]
  let log3 = [...allLogsData.slice(gridEnd * 2)]


  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-3 justify-items-center gap-4">
        <div>
          {log1.map((log, idx) => {
            return (
              <LogCard key={idx} {...log} />
            )
          })}
        </div>
        <div>
          {log2.map((log, idx) => {
            return (
              <LogCard key={idx} {...log} />
            )
          })}
        </div>
        <div>
          {log3.map((log, idx) => {
            return (
              <LogCard key={idx} {...log} />
            )
          })}
        </div>
      </div>
    </div>
  )

}

export default Home;