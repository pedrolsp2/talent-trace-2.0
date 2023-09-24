import { Checks } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { IChat } from "../../../context/AuthProvider/type";

interface IChats {
  value: IChat;
  id: number;
}

export function MessageUser(props: IChats) {
  return (
      <div className={`w-[20rem] ${props.id === props.value.id_user_receiver? 'bg-zinc-300 dark:bg-dark-TT3 hover:bg-slate-200 dark:hover:bg-dark-TT' : 'bg-slate-100 dark:bg-dark-TT2 hover:bg-slate-200 dark:hover:bg-dark-TT'}`}>
        <div className="flex flex-col p-2 gap-2 border-b border-zinc-200 dark:border-dark-TT">
          <div className="flex items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarFallback>{props?.value?.Nome}</AvatarFallback>
              <AvatarImage src={props?.value?.Foto} />
            </Avatar>
            <h1 className="font-bold text-[1.25rem] line-clamp-1">
            {props?.value?.Nome}
            </h1>
          </div>
          <div className="grid grid-cols-[auto,1fr] items-center gap-2">
            <Checks size={20} />
            <p className="line-clamp-1 text-zinc-500">
            {props?.value?.Mensagem}
            </p>
          </div>
        </div>
      </div>
  );
}
