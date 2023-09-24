import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  ChatCircleText,
  House,
  Moon,
  SidebarSimple,
  Sun,
} from "@phosphor-icons/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { useAuth } from "../../context/AuthProvider/useAuth"
import { InfoUser } from "../../context/AuthProvider/type"
import axios from "axios"
import { getUserLocalStorage } from "../../context/AuthProvider/uitl"
import { Skeleton } from "../ui/skeleton"

export function SideBar() {
  const location = useLocation()
  const currentRouteRef = useRef<{ current: string } | null>(null)
  const [home, setHome] = useState(false)
  const [message, setMessage] = useState(false)
  const [toggle, setToggle] = useState<boolean>(false)
  const [user, setUser] = useState<InfoUser | null>(null)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  )
  const navigate = useNavigate()
  const auth = useAuth()
  const { email } = getUserLocalStorage()

  const handleResize = () => {
    if (window.innerWidth < 900) {
      setToggle(false)
    } else {
      setToggle(true)
    }
  }

  const handleSetTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    }
    if (theme === "dark") {
      setTheme("light")
    }
  }

  useEffect(() => {
    const theme: string = "";
    localStorage.setItem("theme", theme)
    const localTheme: string | null = localStorage.getItem("theme")
    document.querySelector("html")?.setAttribute("data-mode", localTheme || "")
  }, [theme])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:8800/user/", {
          email,
        })
        setUser(response.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      }
    }

    fetchData()
  }, [email])

  useEffect(() => {
    currentRouteRef.current = { current: location.pathname }
    const currentPath = currentRouteRef.current.current
    switch (currentPath) {
      case "/":
        setHome(true)
        setMessage(false)
        break
      case "/search":
        setHome(false)
        setMessage(false)
        break
      case "/new-post":
        setHome(false)
        setMessage(false)
        break
      case "/favoritos":
        setHome(false)
        setMessage(false)
        break
      case "/conversas":
        setHome(false)
        setMessage(true)
        break
      default:
        setHome(false)
        setMessage(false)
        break
    }
  }, [location.pathname])

  function handleLogout() {
    try {
      auth.logout()
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  if (!toggle) {
    return (
      <div
        className="w-20 dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between items-center h-screen sticky top-0 py-2"
        id="side-bar"
      >
        <div>
          <span className="text-white font-bold text-lg flex items-center justify-center">
            <SidebarSimple
              size={32}
              className="cursor-pointer"
              onClick={() => setToggle(!toggle)}
            />
          </span>
          <div className="mt-8 flex flex-col gap-2">
            <span
              onClick={() => navigate("/")}
              className={`flex gap-4 p-2 rounded-xl items-center justify-center ${
                home ? "bg-secondary-40" : ""
              } text-white text-xl cursor-pointer hover:bg-secondary-40`}
            >
              {home ? (
                <House weight="fill" size={20} />
              ) : (
                <House
                  size={20}
                  className=" dark:text-secondary-40 dark:hover:text-secondary-20"
                />
              )}
            </span>
            <span
              onClick={() => navigate("/conversas")}
              className={`flex gap-4 p-2 rounded-xl items-center justify-center ${
                message ? "bg-secondary-40" : ""
              } text-white text-xl cursor-pointer hover:bg-secondary-40`}
            >
              {message ? (
                <ChatCircleText weight="fill" size={20} />
              ) : (
                <ChatCircleText
                  size={20}
                  className=" dark:text-secondary-40 dark:hover:text-secondary-20"
                />
              )}
            </span>
          </div>
        </div>
        <Sheet>
          <SheetTrigger>
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={user?.u_foto} alt="Pedro Lucas" />
            </Avatar>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] bg-slate-50 dark:bg-dark-TT2 dark:border-x-dark-TT dark:text-zinc-50 text-zinc-900"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>Ações rapidas do perfil</SheetTitle>
            </SheetHeader>
            <SheetDescription>
              {theme === "light" ? (
                <Sun
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              ) : (
                <Moon
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              )}
              <Button onClick={handleLogout}>Sair</Button>
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div
      className="w-[16rem] dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between h-screen sticky top-0"
      id="side-bar"
    >
      <div className="py-4">
        <span className="text-white font-bold text-lg flex items-center justify-between p-2">
          Talent Trace
          <SidebarSimple
            size={32}
            className="cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
        </span>
        <div className="p-2 mt-8 flex flex-col gap-2">
          <span
            onClick={() => navigate("/")}
            className={`flex gap-4 p-2 rounded-xl items-center ${
              home ? "bg-secondary-40 " : ""
            } text-white text-lg cursor-pointer hover:bg-secondary-40`}
          >
            {home ? (
              <House weight="fill" size={20} />
            ) : (
              <House size={20} className=" dark:text-secondary-20" />
            )}
            Inicio
          </span>
          <span
            onClick={() => navigate("/conversas")}
            className={`flex gap-4 p-2 rounded-xl items-center ${
              message ? "bg-secondary-40" : ""
            } text-white text-lg cursor-pointer hover:bg-secondary-40`}
          >
            {message ? (
              <ChatCircleText weight="fill" size={20} />
            ) : (
              <ChatCircleText size={20} className=" dark:text-secondary-20" />
            )}
            Conversar
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 p-3">
        <Sheet>
          <SheetTrigger>
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={user?.u_foto} alt="Pedro Lucas" />
            </Avatar>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] bg-slate-50 dark:bg-dark-TT2 dark:border-x-dark-TT dark:text-zinc-50 text-zinc-900"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>Ações rapidas do perfil</SheetTitle>
            </SheetHeader>
            <SheetDescription>
              {theme === "light" ? (
                <Sun
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              ) : (
                <Moon
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              )}
              <Button onClick={handleLogout}>Sair</Button>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <span className="text-white font-semibold text-xl line-clamp-1">
          {user?.u_name}
        </span>
      </div>
    </div>
  )
}
