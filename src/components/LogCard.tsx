import { LogCardElement } from "../types/LogCard"


const LogCard = (CardInfo: LogCardElement) => {

  return (

    <a href={String(CardInfo.id)}>
      <img src={CardInfo.imageUrl} alt="업로드 이미지" />
      <div>
        {CardInfo.oneLineComment}
      </div>
      <div>
        {CardInfo.date}
      </div>
    </a>

  )

}

export default LogCard