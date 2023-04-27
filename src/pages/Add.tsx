import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NewLog } from "../gql/logMutation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';

const Add = () => {

  const [preview, setPreview] = useState<String>("");
  const [selectedDate, setSelectedDate] = useState<String>("");
  const [logDate, setLogDate] = useState(null);

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
    console.log(imgFile.current.files)
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

  const logDateHandler = (currentDate) => {
    setSelectedDate(new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(currentDate))
    setLogDate(currentDate)
  }


  return (

    <div className="w-full max-w-xs">
      {preview != "" ? <img className="w-fit" src={preview != "" ? String(preview) : ""} alt="미리보기" /> : null}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <input className="fileInput" type="file" ref={imgFile} onChange={imgFileHandler} />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            추억을 위한 한줄
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" ref={name} onChange={nameHandler} />
        </div>

        <DatePicker
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          locale={ko}    // 언어설정 기본값은 영어
          dateFormat="yyyy년도 MM월 dd일 eee요일"    // 날짜 형식 설정
          className="input-datepicker w-full"    // 클래스 명 지정 css주기 위해
          closeOnScroll={true}    // 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
          placeholderText="기록할 날짜 선택"    // placeholder
          selected={logDate}    // value
          onChange={(date) => logDateHandler(date)}    // 날짜를 선택하였을 때 실행될 함수
        />
      </form>
    </div>

  )
}

export default Add