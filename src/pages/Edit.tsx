import { useLocation } from "react-router-dom"
import Add from "./Add"

const Edit = () => {

  const { state } = useLocation();

  return (
    <div>
      <Add isEdit={true} info={state} />
    </div>
  )
}

export default Edit