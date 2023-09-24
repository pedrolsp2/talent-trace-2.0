import { useEffect, useState } from "react";
import "../../../pages/message/style.css";
import { IMessage, InfoUser } from "../../../context/AuthProvider/type";
import { getUserLocalStorage } from "../../../context/AuthProvider/uitl";
import { fetchDataUser, fetchMessage } from "../../../context/hooks/getData";

interface IMessageContent {
  value: IMessage;
  id: number;
}

export function ContentMessage(props: IMessageContent) {
  const [chatContent, setChatContent] = useState<IMessage[]>([]);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const { email } = getUserLocalStorage();
  const [isSize, setIsSize] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsSize(window.innerWidth > 1400);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData(); 
  }, [props?.id]);

  const fetchData = async () => {
    setChatContent([])
    try {
      const userData = await fetchDataUser(email);
      if (userData && userData.id_user) {
        setUserData(userData);
      }
      const postChat = await fetchMessage(userData.id_user,props.id);
      if (postChat && postChat.length > 0) {
        setChatContent(postChat);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="relative overflow-y-auto" id="scroll"
    style={{ height: !isSize ? "calc(88vh - 0px)" : "calc(91.5vh - 0px)" }}>
      <div className="flex flex-col justify-end" id="scroll">
        {chatContent.map((item) => (
          <div key={item.id_chat}>
            <div
              className={`max-w-[45%] p-3 rounded-[8px] flex flex-col my-2
            ${item.id_user_sender === userData?.id_user && "ml-auto"}
            ${
              item.id_user_sender === userData?.id_user
                ? "bg-primary-50 text-zinc-100 "
                : "bg-zinc-300 text-zinc-800 "
            }
            `}
            >
              <span>{item.Mensagem}</span>
              <small
                className={`ml-auto ${
                  item.id_user_sender === userData?.id_user
                    ? "text-zinc-300"
                    : "text-zinc-400"
                }`}
              >
                Pedro, às 15:35
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
