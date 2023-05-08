import { useRouter } from "../hooks/useRouter"
import { LogCardElement } from "../types/LogCard"


const LogCard = (CardInfo: LogCardElement) => {


  const { routeTo } = useRouter();

  const navHandler = () => {
    routeTo(`detail/${String(CardInfo.id)}`)
  }

  return (
    <div className="relative h-fit" onClick={navHandler}>
      <div >
        <img src={CardInfo.imageUrl} alt="업로드 이미지" />
      </div>
      <div className="absolute h-full inset-x-0 top-0 text-rose-500">
        <div>
          {CardInfo.oneLineComment}
        </div>
        <div>
          {CardInfo.date}
        </div>
      </div>
    </div>
  )

}

export default LogCard