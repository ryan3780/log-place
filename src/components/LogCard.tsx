import { useRouter } from "../hooks/useRouter"
import { LogCardElement } from "../types/LogCard"


const LogCard = (CardInfo: LogCardElement) => {


  const { routeTo } = useRouter();

  const navHandler = () => {
    routeTo(`detail/${String(CardInfo.id)}`)
  }

  return (
    <div onClick={navHandler}>
      <img src={CardInfo.imageUrl} alt="업로드 이미지" />
      <div>
        {CardInfo.oneLineComment}
      </div>
      <div>
        {CardInfo.date}
      </div>
    </div>

  )

}

export default LogCard