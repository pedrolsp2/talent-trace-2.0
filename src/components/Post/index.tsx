import {
  ChatCircle,
  DotsThreeVertical,
  Heart,
  ShareNetwork,
} from "@phosphor-icons/react"
import { Avatar, AvatarImage } from "../ui/avatar"
import { IPost } from "../../context/AuthProvider/type"
import { Link } from "react-router-dom"
import { getUserLocalStorage } from "../../context/AuthProvider/uitl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { fetchDeletePost } from "../../context/hooks/getData"
import { BadgeCheck } from "lucide-react"
import { toast } from "../ui/use-toast"

export function Post(props: IPost) {
  const data = getUserLocalStorage()
  const email = data[0]

  function handleSettings(id: number) {
    fetchDeletePost(id)
      .then(() => {
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Sucesso ao excluir",
        })
        props?.fetch && props.fetch()
      })
      .catch((error) => {
        console.error("Erro ao obter dados:", error)
      })
  }

  return (
    <div className="px-5 py-6 flex flex-col border-b border-slate-200 dark:border-zinc-900">
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <Avatar>
          <AvatarImage src={props?.value.foto_user} />
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span
              className={`font-bold flex gap-1 items-center ${
                props?.value.cref && "text-primary-50"
              }`}
            >
              {props?.value.nome_user}
              {props?.value.cref && <BadgeCheck size={14} color="#14AF6C" />}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                {email == props?.value?.email_user && (
                  <DotsThreeVertical
                    size={28}
                    className="ml-auto cursor-pointer text-zinc-400"
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-100 dark:bg-dark-TT dark:text-zinc-100 dark:border-dark-TT2">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-dark-TT2" />
                <DropdownMenuItem
                  onClick={() => handleSettings(props?.value?.id_post)}
                  className="cursor-pointer"
                >
                  Deletar post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link to={`/view-post/${props?.value.id_post}`} className="p-1">
            {props?.value.content}
          </Link>
          {props?.value.image && (
            <div className="w-72 h-72">
              <img src={props?.value.image} alt="Selected" />
            </div>
          )}
          <div className="pt-3 flex items-center">
            <div className="flex gap-12">
              {props?.answer ? undefined : (
                <>
                  <span className="flex items-center justify-center gap-2 text-zinc-500">
                    <ChatCircle size={24} className="cursor-pointer" />
                    <span className="text-base">{props?.value.n_comement}</span>
                  </span>
                </>
              )}
              <span className="flex items-center justify-center gap-2 text-zinc-500">
                <Heart size={24} className="cursor-pointer" />
                <span className="text-base">{props?.value.n_likes}</span>
              </span>
            </div>
            <ShareNetwork
              size={24}
              className="ml-auto cursor-pointer text-zinc-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
