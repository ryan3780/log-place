import { useEffect, useState } from "react"


export const useCheckNetwork = () => {

  const [online, setOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOnline(false);
    });
    window.addEventListener("online", () => {
      setOnline(true);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setOnline(false);
      });
      window.removeEventListener("online", () => {
        setOnline(true);
      });
    };
  }, []);

  return online
}
