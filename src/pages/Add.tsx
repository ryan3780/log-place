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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

    if (!logText.current.value) {
      alert("추억을 위한 한 줄이 없습니다.")
      logText.current.focus()
      return false
    }
    else if (!preview) {
      alert("이미지가 없습니다.")
      return false
    }
    else if (!logDate) {
      alert("날짜를 기입해주세요.")
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

  const alertHandler = (size: number) => {
    alert(`리사이즈 된 인코딩 결과 ${size / 1000}KB 입니다. \nBase64 인코딩 결과가 100KB 이하만 가능합니다.`)

    if (edit.isEdit) {
      setPreview(edit.info.imageUrl)
      setSelectedDate(new Date(edit.info.date.replace(/[^0-9]/g, " ")))
      setPreview(edit.info.imageUrl)
      setLogDate(edit.info.date)

    } else {
      setLogDate("")
      setSelectedDate(null)
      setPreview("")
    }

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

      return alertHandler(String(res).length)
    }

    setPreview(String(res));
  }

  const imgFileHandler = () => {

    if (imgFile.current.files.length > 0) {

      const reader = new FileReader();

      reader.onload = () => {

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
          logDateHandler(new Date(DateTime.split(" ")[0].replaceAll(":", "-")))

        } else {
          logDateHandler(new Date())
          setSelectedDate(new Date())
          setLat(null)
          setLongt(null)
        }

      });

    } else {

      if (edit.isEdit) {
        setSelectedDate(new Date(edit.info.date.replace(/[^0-9]/g, " ")))
        setPreview(edit.info.imageUrl)
        setLogDate(edit.info.date)
        setLat(edit.info.lat ? Number(edit.info.lat) : null)
        setLongt(edit.info.longt ? Number(edit.info.longt) : null)
      } else {

        setPreview("")
        setLogDate(new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(new Date()))
        setSelectedDate(new Date())
        setLat(null)
        setLongt(null)
      }

    }

  }

  const logDateHandler = (currentDate: Date) => {
    setSelectedDate(currentDate)
    setLogDate(new Intl.DateTimeFormat('ko', { dateStyle: "full" }).format(new Date(currentDate)))
  }

  useEffect(() => {
    if (edit.isEdit) {
      setSelectedDate(new Date(edit.info.date.replace(/[^0-9]/g, " ")))
      setPreview(edit.info.imageUrl)
      setLogDate(edit.info.date)
      setLat(edit.info.lat ? Number(edit.info.lat) : null)
      setLongt(edit.info.longt ? Number(edit.info.longt) : null)
      logText.current.value = edit.info.oneLineComment

    }
  }, [edit])

  const net = useCheckNetwork()

  const xssHandler = () => {

    let oneLineComment = logText.current.value

    if (logText.current.value.length === 19) {
      alert('19자 까지만 입력이 가능합니다')
    }

    oneLineComment = oneLineComment.replace(/<script[^>]*>([\S\s]*?)<\/script>/g, '');
    oneLineComment = oneLineComment.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/g, '');

    logText.current.value = oneLineComment.slice(0, 19)

  }


  return (

    <div className="flex justify-center items-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 " >

        {edit.isEdit && preview === "" ? <img className="w-[300px] h-[400px]" src={edit.info.imageUrl} alt="업로드 이미지" loading="lazy" /> : <img className="w-[300px] h-[400px]" src={preview !== "" ? String(preview) : nothing} alt={`미리보기`} />}

        <input className="text-sm text-grey-500
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700 mt-[20px] mb-[20px]" type="file" ref={imgFile} onChange={imgFileHandler} accept=".gif, .jpg, .png, .jpeg" />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor="username">
            추억을 위한 한 줄
          </label>
          {edit && edit.info ? <input maxLength={33} onChange={xssHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="editInput" type="text" placeholder={edit.info.oneLineComment} ref={logText} /> : <input maxLength={33} onChange={xssHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addInput" type="text" placeholder="" ref={logText} />}


        </div>
        {logDate && !edit.isEdit ? logDate :
          <DatePicker
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            locale={ko}    // 언어설정 기본값은 영어
            dateFormat="yyyy년 M월 dd일 eee요일"    // 날짜 형식 설정
            className="input-datepicker w-full"    // 클래스 명 지정 css주기 위해
            closeOnScroll={true}    // 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            placeholderText="기록할 날짜 선택"    // placeholder
            selected={selectedDate}    // value
            onChange={(date) => logDateHandler(date)}    // 날짜를 선택하였을 때 실행될 함수
          />}

      </form>
      <div className="flex flex-col items-center w-[500px] pl-[40px]">
        <button className="mb-[40px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={submitHandler}> 저장하기 </button>
        {lat !== null && longt !== null && net ? < GMap {...position} /> : <div>  위치 정보가 없습니다. </div>}
      </div>
    </div>

  )
}

export default Add