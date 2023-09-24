import { useEffect, useState } from "react"
import { ContentMessage } from "../../components/Message/ContentMessage"
import { MessageUser } from "../../components/Message/MessageUser"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import {
  fetchChat,
  fetchDataUser,
  fetchMessage,
  fetchNewMessage,
} from "../../context/hooks/getData"
import { getUserLocalStorage } from "../../context/AuthProvider/uitl"
import { IChat, IMessage, InfoUser } from "../../context/AuthProvider/type"
import { PaperPlaneRight, SmileySticker } from "@phosphor-icons/react"

import img from "../../assets/logo512.svg"

import "./style.css"

export default function Message() {
  const [isSize, setIsSize] = useState(false)
  const [chat, setChat] = useState<IChat[]>([])
  const [chatContent, setChatContent] = useState<IMessage[]>([])
  const [chatContents, setChatContents] = useState<IMessage | null>(null)
  const [userData, setUserData] = useState<InfoUser | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState<string>("")
  const [idChat, setIdChat] = useState(0)
  const [content, setContent] = useState("")
  const { email } = getUserLocalStorage()

  useEffect(() => {
    const handleResize = () => {
      setIsSize(window.innerWidth > 1400)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const newTitle = "Talent Trace | Conversas"
    document.title = newTitle
    fetchData()
  }, [chatContents?.Mensagem.length])

  useEffect(() => {
    const formatDateTime = (date: Date): string => {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      const seconds = date.getSeconds().toString().padStart(2, "0")
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    const currentDate = new Date()
    const formattedDateTime = formatDateTime(currentDate)
    setCurrentDateTime(formattedDateTime)
  }, [])

  const fetchData = async () => {
    try {
      const userData = await fetchDataUser(email)
      if (userData && userData.id_user) {
        setUserData(userData)
      }
      const postData = await fetchChat(userData.id_user)
      if (postData && postData.length > 0) {
        setChat(postData)
      }
      const postChat = await fetchMessage(userData.id_user, idChat)
      if (postChat && postChat.length > 0) {
        setChatContent(postChat)
        setChatContents(postChat[0])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  function handleNewMessage(e: React.FormEvent) {
    e.preventDefault()
    fetchNewMessage(Number(userData?.id_user), content, currentDateTime, idChat)
    setContent("")
    setIdChat(idChat)
    fetchData()
  }

  return (
    <div
      className="grid grid-cols-[auto,1fr] divide-x divide-slate-200 dark:divide-dark-TT2 relative"
      style={{ height: !isSize ? "calc(88vh - 0px)" : "calc(91.5vh - 0px)" }}
    >
      <div
        className="flex flex-col"
        style={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
        id="scroll"
      >
        {chat.map((item) => (
          <div
            key={item.id_chat}
            className="cursor-pointer"
            onClick={() => {
              setIdChat(item.id_user_receiver)
            }}
          >
            <MessageUser value={item} id={idChat} />
          </div>
        ))}
      </div>
      <div
        className={`flex flex-col w-full relative px-2 ${
          idChat === 0 ? "justify-center" : "justify-end"
        }`}
        id="scroll"
        style={{ height: !isSize ? "calc(88vh - 0px)" : "calc(91.5vh - 0px)" }}
      >
        {idChat === 0 ? (
          <span className="flex gap-4 flex-col items-center justify-center">
            <img src={img} alt="" />
            <h1 className="text-2xl">
              Inicie uma conversa, é simples, rápido e legal!{" "}
            </h1>
          </span>
        ) : (
          <>
            <ContentMessage value={chatContent} id={idChat} />
            <div className="w-full bg-zinc-200 dark:bg-dark-TT2 p-2">
              <form
                onSubmit={handleNewMessage}
                className="flex items-center gap-2"
              >
                <SmileySticker size={32} className="cursor-pointer" />
                <Input
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                  }}
                  type="text"
                  placeholder="Digite sua mensagem"
                  className="bg-slate-100 border-0 w-full rounded text-base dark:bg-dark-TT"
                />
                <Button variant="ghost" type="submit">
                  <PaperPlaneRight size={28} className="cursor-pointer" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
