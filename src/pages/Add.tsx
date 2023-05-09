import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NewLog, UPDATE_Log } from "../gql/logMutation";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import EXIF from "exif-js";
import GMap from "../components/GMap";
import { useCheckNetwork } from "../hooks/useCheckNetwork";
import { LogCardElement } from "../types/LogCard";
import { useNavigate } from "react-router-dom";
import nothing from '../assets/nothing.png'


interface ExifProps {
  DateTime?: String
  GPSLatitudeRef?: String
  GPSLatitude?: number[]
  GPSLongitude?: number[]
  GPSLongitudeRef?: String
}

interface editProps {
  isEdit?: boolean
  info?: LogCardElement
}

const Add = (edit: editProps) => {

  const [preview, setPreview] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [logDate, setLogDate] = useState<string>("");
  const [lat, setLat] = useState<number>(null);
  const [longt, setLongt] = useState<number>(null);

  const logText = useRef<HTMLInputElement>();
  const imgFile = useRef<HTMLInputElement>();

  const position = {
    lat: lat,
    lng: longt
  }

  const [addLog] = useMutation(CREATE_NewLog);
  const [updateLog] = useMutation(UPDATE_Log);

  const navigate = useNavigate()

  const validateSubmit = () => {
    console.log(logDate)
    if (!logText.current.value) {
      alert("input")
      return false
    }
    else if (!preview) {
      alert("no img")
      return false
    }
    else if (!logDate) {
      alert("no Date")
      return false
    }
    return true
  }

  const submitHandler = () => {


    if (!validateSubmit()) return

    if (edit.isEdit) {
      updateLog({
        variables: {
          id: edit.info.id,
          oneLineComment: !logText.current.value ? edit.info.oneLineComment : logText.current.value,
          date: new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(selectedDate),
          imageUrl: preview,
          lat: lat,
          longt: longt
        }
      }).then(() => {
        navigate("/")
      })

    } else {
      addLog({
        variables: {
          oneLineComment: logText.current.value,
          date: new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(selectedDate),
          imageUrl: preview,
          lat: lat,
          longt: longt
        },
      }).then(() => {
        navigate("/")
      }).catch((err) => {
        console.log(err)
      })
    }
  };

  const alertHandler = () => {
    alert("용량이 너무 큽니다.")
    setPreview("")
    imgFile.current.value = ""
  }

  const resizeImage = async (base64Str: string, maxWidth = 600, maxHeight = 400) => {
    const res = await new Promise(resolve => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;
        let shouldResize = false;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
            shouldResize = true;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
            shouldResize = true;
          }
        }
        if (shouldResize) {
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.9));

        } else {
          resolve(base64Str);
        }
      };
    });

    if (String(res).length > 100000) {
      setLogDate("")
      setSelectedDate(null)
      return alertHandler()
    }
    setPreview(String(res));
  }

  const imgFileHandler = () => {

    if (imgFile.current.files.length > 0) {

      const reader = new FileReader();

      reader.onload = () => {

        // setLogDate("")
        // setSelectedDate(null)
        setPreview(reader.result as string)
        resizeImage(reader.result as string)

      }
      reader.readAsDataURL(imgFile.current.files[0])

      EXIF.getData(imgFile.current.files[0] as any, function () {
        const allMetaData: ExifProps = EXIF.getAllTags(imgFile.current.files[0]);

        if (allMetaData.GPSLatitude) {

          const { GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef, DateTime } = allMetaData

          const latDegree = GPSLatitude[0].valueOf()
          const latMin = GPSLatitude[1].valueOf()
          const latSec = GPSLatitude[2].valueOf()

          const longDegree = GPSLongitude[0].valueOf()
          const longMin = GPSLongitude[1].valueOf()
          const longSec = GPSLongitude[2].valueOf()

          let decimalLatitude = 0
          let deciamlLongitude = 0

          if (GPSLatitudeRef === "S") {
            decimalLatitude = -(latDegree + (latMin / 60) + (latSec / 3600))
          } else {
            decimalLatitude = latDegree + (latMin / 60) + (latSec / 3600)
          }

          if (GPSLongitudeRef === "W") {
            deciamlLongitude = -(longDegree + (longMin / 60) + (longSec / 3600))
          } else {
            deciamlLongitude = longDegree + (longMin / 60) + (longSec / 3600)
          }

          setLat(decimalLatitude)
          setLongt(deciamlLongitude)
          setLogDate(new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(new Date(DateTime.split(" ")[0].replaceAll(":", "-"))))
          // logDateHandler(new Date(DateTime.split(" ")[0].replaceAll(":", "-")))


        } else {

          setLogDate("")
          setSelectedDate(null)
          setLat(null)
          setLongt(null)
        }

      });

    } else {

      setPreview("")
      setLogDate("")
      setSelectedDate(null)
      setLat(null)
      setLongt(null)
    }

  }

  const logDateHandler = (currentDate: Date) => {

    setSelectedDate(currentDate)

  }

  useEffect(() => {
    if (edit.isEdit) {
      setSelectedDate(new Date(edit.info.date.replace(/[^0-9]/g, " ")))
      setPreview(edit.info.imageUrl)
      setLogDate(edit.info.date)
      setLat(Number(edit.info.lat))
      setLongt(Number(edit.info.longt))
      logText.current.value = edit.info.oneLineComment

    }
  }, [edit])



  const net = useCheckNetwork()

  console.log(logDate)

  return (

    <div className="flex justify-center items-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 " >

        {edit.isEdit && preview === "" ? <img className="w-[300px] h-[400px]" src={edit.info.imageUrl} alt="업로드 이미지" loading="lazy" /> : <img className="w-[300px] h-[400px]" src={preview !== "" ? String(preview) : nothing} alt={`미리보기`} />}

        <input className="fileInput" type="file" ref={imgFile} onChange={imgFileHandler} accept=".gif, .jpg, .png, .jpeg" />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            추억을 위한 한줄
          </label>
          {edit && edit.info ? <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="editInput" type="text" placeholder={edit.info.oneLineComment} ref={logText} /> : <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addInput" type="text" placeholder="" ref={logText} />}


        </div>
        {logDate && !edit.isEdit ? logDate :
          <DatePicker
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            locale={ko}    // 언어설정 기본값은 영어
            dateFormat="yyyy년도 MM월 dd일 eee요일"    // 날짜 형식 설정
            className="input-datepicker w-full"    // 클래스 명 지정 css주기 위해
            closeOnScroll={true}    // 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            placeholderText="기록할 날짜 선택"    // placeholder
            selected={selectedDate}    // value
            onChange={(date) => logDateHandler(date)}    // 날짜를 선택하였을 때 실행될 함수
          />}

      </form>
      <div className="flex flex-col items-center w-[500px] pl-[40px]">
        <button className="mb-[40px]" onClick={submitHandler} >test Btn</button>
        {lat !== null && longt !== null && net ? < GMap {...position} /> : <div>  위치 정보가 없습니다. </div>}
      </div>
    </div>

  )
}

export default Add