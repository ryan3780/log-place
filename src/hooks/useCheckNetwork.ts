import { useCallback, useEffect, useState } from "react"


export const useCheckNetwork = () => {

  const [online, setOnline] = useState<boolean>(navigator.onLine)

  const netHandler = useCallback(() => {
    if (navigator.onLine) {
      setOnline(true)
    } else {
      setOnline(false)
    }
  }, [])

  useEffect(() => {
    netHandler()
  }, []);

  return online
}
