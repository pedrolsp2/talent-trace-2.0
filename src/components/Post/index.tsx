import { ChatCircle, DotsThreeVertical, Heart, ShareNetwork } from "@phosphor-icons/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { IPost } from "../../context/AuthProvider/type";
import { Link } from "react-router-dom";
import { getUserLocalStorage } from "../../context/AuthProvider/uitl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { fetchDeletePost } from "../../context/hooks/getData";

export function Post(props: IPost){
  const {email} = getUserLocalStorage();

  function handleSettings(id: number){
    fetchDeletePost(id)
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.error("Erro ao obter cidades:", error);
    });
  }

  return(
    <div className="px-5 py-6 flex flex-col border-b border-slate-200 dark:border-zinc-900">
      <div className="grid grid-cols-[auto,1fr] gap-3">
          <Avatar>
            <AvatarImage src={props?.value.u_foto} />
          </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="font-bold">{props?.value.u_name}</span>
            <small className="text-slate-400">{props?.value.u_user}</small>
            <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  {email == props?.value?.u_email && <DotsThreeVertical size={28} className="ml-auto cursor-pointer text-zinc-400"/>}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-100 dark:bg-dark-TT dark:text-zinc-100 dark:border-dark-TT2">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-200 dark:bg-dark-TT2"/>
                    <DropdownMenuItem onClick={()=>handleSettings(props?.value?.id_post)} className="cursor-pointer">Deletar post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

          </div>
          <Link to={`/view-post/${props?.value.id_post}`} className="p-1">
           {props?.value.content}
          </Link>
          <div className="pt-3 flex items-center">
            <div className="flex gap-12">
            {props?.answer? undefined : ( <>
            <span className="flex items-center justify-center gap-2 text-zinc-500">
              <ChatCircle size={24} className="cursor-pointer"/>
              <span className="text-base">{props?.value.number_comment}</span>
            </span> 
            </>
            )}
            <span className="flex items-center justify-center gap-2 text-zinc-500">
              <Heart size={24} className="cursor-pointer"/>
              <span className="text-base">{props?.value.number_likes}</span>
            </span>
            </div>
            <ShareNetwork size={24} className="ml-auto cursor-pointer text-zinc-400"/>
          </div>
        </div>
      </div>
    </div>
  )
}