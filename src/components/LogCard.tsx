import { LogCardElement } from "../types/LogCard"


const LogCard = (CardInfo: LogCardElement) => {

  return (

    <a href={String(CardInfo.id)}>
      <img src={CardInfo.imageUrl} alt={CardInfo.name} />
      <div>
        {CardInfo.name}
      </div>
      <div>
        {CardInfo.date}
      </div>
    </a>

  )

}

export default LogCard