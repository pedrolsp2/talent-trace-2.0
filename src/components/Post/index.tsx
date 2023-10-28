import {
  ChatCircle,
  DotsThreeVertical,
  Heart,
  ShareNetwork,
} from '@phosphor-icons/react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { IPost, InfoUser } from '../../context/AuthProvider/type';
import { Link } from 'react-router-dom';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  fetchCountLike,
  fetchDataUser,
  fetchDeleteAnswer,
  fetchDeleteLike,
  fetchDeletePost,
  handleLike,
} from '../../context/hooks/getData';
import { BadgeCheck } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function Post(props: IPost) {
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [countLike, setCountLike] = useState(0);
  const strogae = getUserLocalStorage();
  const email = strogae[0];

  const queryClient = useQueryClient();

  const fetchData = async () => {
    try {
      const userData = await fetchDataUser(email);
      if (userData && userData.id_user) {
        setUserData(userData as InfoUser);
      } else {
        console.error(
          'Propriedade id_user não encontrada nos dados do usuário.'
        );
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  async function handleSettings(id: number) {
    await fetchDeletePost(id)
      .then(() => {
        toast({
          variant: 'default',
          title: 'Sucesso!',
          description: 'Sucesso ao excluir',
        });
        props?.fetch && props.fetch();
      })
      .catch((error) => {
        console.error('Erro ao obter dados:', error);
      });
  }

  function handleAnswer(id: number) {
    fetchDeleteAnswer(id)
      .then(() => {
        toast({
          variant: 'default',
          title: 'Sucesso!',
          description: 'Sucesso ao excluir',
        });
        props?.fetch && props.fetch();
      })
      .catch((error) => {
        console.error('Erro ao obter dados:', error);
      });
    props?.fetch && props.fetch();
  }

  async function handleNewLike(id: number) {
    if (props.liked) {
      if (userData) {
        await fetchDeleteLike(id, userData?.id_user || 0);
      }
    } else {
      if (userData) {
        await handleLike(
          {
            content_post: props.value.content,
            cref: userData.cref,
            fotoUser: userData.fotoPerfil,
            id_sendLike: userData.id_user,
            id_user: props.value.id_user,
            image: props.value.image,
            nomeUser: userData.user,
            username: userData.username,
          },
          id,
          userData.id_user || 0,
          props.value.id_user
        )
          .then(() => {
            toast({
              variant: 'default',
              title: 'Sucesso!',
              description: 'Você deu like!',
            });
          })
          .catch((error) => {
            console.error('Erro ao obter dados:', error);
          });
      }
    }
  }

  async function checkLikedStatus() {
    const count = await fetchCountLike(props.value.id_post);
    setCountLike(count);
    queryClient.invalidateQueries({ queryKey: ['likes'] });
  }

  const { mutate, isLoading } = useMutation(
    () => handleNewLike(props.value.id_post),
    {
      onSuccess: () => checkLikedStatus(),
    }
  );

  const query = useMutation(() => handleSettings(props.value.id_post), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post'] }),
  });

  useEffect(() => {
    fetchData();

    checkLikedStatus();
  }, [props.value.id_post, props.value.id_user]);

  return (
    <div className="flex flex-col px-5 py-6 border-b border-slate-200 dark:border-zinc-900 dark:bg-dark-TT">
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
                props?.value.cref && 'text-primary-50'
              }`}
            >
              <span
                className={`${
                  props?.value.cref ? 'text-primary-50' : 'dark:text-zinc-300'
                }`}
              >
                {props?.value.nome_user}
              </span>
              {props?.value.cref && <BadgeCheck size={14} color="#14AF6C" />}
              <span className="text-xs font-normal text-zinc-500">
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
                    onClick={() => query.mutate()}
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
            className="flex flex-col gap-1 p-1"
          >
            {props?.value.content}
            {props?.value.image && (
              <div className="w-72">
                <img src={props?.value.image} alt="Selected" />
              </div>
            )}
          </Link>
          <div className="flex items-center pt-3">
            <div className="flex gap-12">
              {props?.answer ? undefined : (
                <>
                  <span className="flex items-center justify-center gap-2 text-zinc-500">
                    <ChatCircle size={24} className="cursor-pointer" />
                    <span className="text-base">{props?.value.n_comement}</span>
                  </span>
                  <span className="flex items-center justify-center gap-2 text-zinc-500">
                    <Heart
                      size={24}
                      onClick={() => mutate()}
                      weight={`${props.liked ? 'fill' : 'regular'}`}
                      className={`cursor-pointer ${
                        props.liked ? 'text-red-500' : 'text-zinc-500'
                      } ${isLoading ? 'animate-bounce' : ''}`}
                    />
                    <span className="text-base">{countLike}</span>
                  </span>
                </>
              )}
            </div>
            {props?.answer ? undefined : (
              <ShareNetwork
                size={24}
                className="ml-auto cursor-pointer text-zinc-400"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
