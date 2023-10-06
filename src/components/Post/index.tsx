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
import {
  fetchCountLike,
  fetchDeleteAnswer,
  fetchDeletePost,
  fetchLike,
} from "../../context/hooks/getData"
import { BadgeCheck } from "lucide-react"
import { toast } from "../ui/use-toast"
import { useEffect, useState } from "react"

export function Post(props: IPost) {
  const [isLiked, setIsLiked] = useState(false)
  const [countLike, setCountLike] = useState(0)
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

  function handleAnswer(id: number) {
    fetchDeleteAnswer(id)
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
    props?.fetch && props.fetch()
  }

  useEffect(() => {
    async function checkLikedStatus() {
      const count = await fetchCountLike(props.value.id_post)
      setCountLike(count)
      const postData = await fetchLike(props.value.id_user)
      const hasLiked = postData.some(
        (post) => post.id_user === props.value.id_user
      )
      setIsLiked(hasLiked)
    }

    checkLikedStatus()
  }, [props.value.id_post, props.value.id_user])

  return (
    <div className="px-5 py-6 flex flex-col border-b border-slate-200 dark:border-zinc-900">
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <Link to={`/user/${props?.value.username}`}>
          <Avatar>
            <AvatarImage src={props?.value.foto_user} />
          </Avatar>
        </Link>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span
              className={`font-bold flex gap-1 items-center ${
                props?.value.cref && "text-primary-50"
              }`}
            >
              {props?.value.nome_user}
              {props?.value.cref && <BadgeCheck size={14} color="#14AF6C" />}
              <span className="text-zinc-400 font-normal text-xs">
                @{props?.value.username}
              </span>
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
                {props.answer ? (
                  <DropdownMenuItem
                    onClick={() => handleAnswer(props?.value?.id_answers || 0)}
                    className="cursor-pointer"
                  >
                    Deletar comentário
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleSettings(props?.value?.id_post)}
                    className="cursor-pointer"
                  >
                    Deletar post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link
            to={`/view-post/${props?.value.id_post}`}
            className="p-1 flex flex-col gap-1"
          >
            {props?.value.content}
            {props?.value.image && (
              <div className="w-72">
                <img src={props?.value.image} alt="Selected" />
              </div>
            )}
          </Link>
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
                <Heart
                  size={24}
                  weight={`${isLiked ? "fill" : "regular"}`}
                  className={`cursor-pointer ${
                    isLiked ? "text-red-500" : "text-zinc-500"
                  }`}
                />
                <span className="text-base">{countLike}</span>
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
