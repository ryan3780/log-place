import { useState } from "react";
import { useRouter } from "../hooks/useRouter"
import { LogCardElement } from "../types/LogCard"


const LogCard = (CardInfo: LogCardElement) => {

  const [loading, setLoading] = useState<boolean>(false)

  const { routeTo } = useRouter();

  const navHandler = () => {
    routeTo(`detail/${String(CardInfo.id)}`)
  }

  const imgLoading = () => {
    setLoading(true)
  }

  return (
    <div className="relative h-fit" onClick={navHandler}>
      <div className="max-w-[300px]" >
        <img onLoad={() => imgLoading()} src={CardInfo.imageUrl} alt="업로드 이미지" className=" rounded-md h-full object-cover" loading="lazy" />
      </div>

      {loading &&
        <div className="absolute h-full inset-x-0 top-0 text-white text-center ">
          <div>
            {CardInfo.date}
          </div>
        </div>}

    </div>
  )

}

export default LogCard