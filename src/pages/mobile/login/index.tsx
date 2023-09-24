import { useEffect } from "react"
import imgLogin from "../../../assets/img-back-login.jpg"
import Signin from "./signin"

export default function MobileLogin() {

  useEffect(() => {
    const newTitle = "Talent Trace | Login"
    document.title = newTitle
  }, [])

  return (
    <div
      className="w-screen h-screen grid p-4"
      style={{
        backgroundImage: `url(${imgLogin})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
     <Signin />
    </div>
  )
}
