import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NewLog } from "../gql/logMutation";
import { useNavigate } from "react-router-dom";
import { LogCardElement } from "../types/LogCard";
import { useState } from "react";

const Add = () => {

  const [preview, setPreview] = useState<String>("");

  const name = useRef<HTMLInputElement>();
  const imgFile = useRef<HTMLInputElement>();
  const imageUrl = useRef();


  const [addLog] = useMutation(CREATE_NewLog);

  const navigate = useNavigate();

  // const addToyHandler = () => {
  //   addLog({
  //     variables: {
  //       name: name.current.name
  //       imageUrl: imageUrl.current.value,
  //     },
  //   }).then(() => {
  //     navigate("/");
  //   });
  // };

  const imgFileHandler = () => {

    if (imgFile.current.files.length > 0) {
      let reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as String)

      }
      reader.readAsDataURL(imgFile.current.files[0])
    } else {
      setPreview("")
    }

  }

  const nameHandler = () => {

    console.log(name.current.value)

  }



  return (

    <div className="w-full max-w-xs">
      <img src={String(preview)} />
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <input className="fileInput" type="file" ref={imgFile} onChange={imgFileHandler} />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" ref={name} onChange={nameHandler} />
        </div>
      </form>
    </div>

  )
}

export default Add