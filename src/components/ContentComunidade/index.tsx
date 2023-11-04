import { ChatCircle, Heart } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router-dom';
import { BadgeType } from '../BadgeType';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '../ui/dialog';
import {
  ComunidadeProps,
  ContentComunidade,
  InfoUser,
} from '@/context/AuthProvider/type';
import {
  fetchComunidadeName,
  fetchCountLikeContent,
  fetchDataUser,
  fetchDeleteLikeContent,
  fetchUserComunidade,
  handleLikeContent,
  userNewComunidade,
} from '@/context/hooks/getData';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserLocalStorage } from '@/context/AuthProvider/uitl';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

type IValue = {
  item: ContentComunidade;
  liked?: boolean;
};

export const ContentComunidad = (props: IValue) => {
  const [comunidade, setComunidade] = useState<ComunidadeProps | null>(null);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [countLike, setCountLike] = useState(0);
  const [status, setStatus] = useState(false);
  const { name } = useParams<{ name: string }>();
  const queryClient = useQueryClient();

  const strogae = getUserLocalStorage();
  const email = strogae[0];

  const fetchData = async () => {
    try {
      const postData = await fetchComunidadeName(name || '');
      if (postData) {
        setComunidade(postData as ComunidadeProps);
      } else {
        setComunidade(null);
      }

      const dataUser = await fetchDataUser(email);
      if (dataUser) {
        setUserData(dataUser as InfoUser);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const { mutate } = useMutation(
    () =>
      userNewComunidade(
        userData?.id_user || 0,
        name || '',
        comunidade?.tipo || '',
        comunidade?.nome || ''
      ),
    {
      onSuccess: () => fetchStatus(),
    }
  );

  async function fetchStatus() {
    const result = await fetchUserComunidade(
      name || '',
      userData?.id_user || 0
    );
    setStatus(result);
    queryClient.invalidateQueries({ queryKey: ['menu-comunidade'] });
  }

  async function checkLikedStatus() {
    const count = await fetchCountLikeContent(props.item.id_content);
    setCountLike(count);
    queryClient.invalidateQueries({ queryKey: ['likesContent', name] });
  }

  async function handleNewLike(id: number) {
    if (props.liked) {
      if (userData) {
        await fetchDeleteLikeContent(id, userData?.id_user || 0);
      }
    } else {
      if (userData) {
        await handleLikeContent(
          id,
          userData.id_user || 0,
          props.item.nomeOlheiro
        );
      }
    }
  }

  const { mutate: mutateLike, isLoading } = useMutation(
    () => handleNewLike(props.item.id_content),
    {
      onSuccess: () => checkLikedStatus(),
    }
  );

  useEffect(() => {
    fetchData();
    checkLikedStatus();
  }, [name]);

  if (isMobileDevice()) {
    return (
      <>
        <div className="flex flex-col w-full gap-8 px-1 py-3 border border-zinc-100 dark:border-dark-TT2">
          <div className="flex w-full gap-2">
            <Avatar>
              <AvatarFallback>FT</AvatarFallback>
              <AvatarImage src={props.item.fotoOlheiro} />'
            </Avatar>
            <div className="flex flex-col w-full">
              <span className="text-[#747474] dark:text-zinc-300 text-md">
                {props.item.nomeOlheiro}
              </span>
              <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                {props.item.titulo}
              </span>
              <span className="ml-auto">
                <BadgeType type={props.item.tipo} variant="default" />
              </span>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: props.item.conteudo }} />
          <span className="flex items-center gap-2 ml-auto">
            <Heart
              size={24}
              className={`cursor-pointer  ${
                props.liked ? 'text-red-500' : 'text-zinc-500'
              }`}
            />
            {countLike}

            <ChatCircle size={24} className="cursor-pointer text-zinc-500" />
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col p-2">
        <div className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
          <Avatar>
            <AvatarFallback>FT</AvatarFallback>
            <AvatarImage src={props.item.fotoOlheiro} />'
          </Avatar>
          <div className="flex flex-col gap-5 px-2">
            <div className="flex flex-col">
              <span className="text-[#747474] dark:text-zinc-300 text-md">
                {props.item.nomeOlheiro}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                  {props.item.titulo}
                </span>
                <BadgeType type={props.item.tipo} variant="default" />
              </div>
            </div>
            {status ? (
              <Dialog>
                <DialogTrigger>
                  <div
                    className="text-left"
                    dangerouslySetInnerHTML={{ __html: props.item.conteudo }}
                  />
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>Não foi possivel interagir</DialogHeader>
                  Para avançar, por favor entre na comundiade
                  <button
                    className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]"
                    onClick={() => mutate()}
                  >
                    Entrar
                  </button>
                </DialogContent>
              </Dialog>
            ) : (
              <Link
                to={`/view-content/${props.item.id_content}`}
                className="dark:text-zinc-300"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: props.item.conteudo }}
                />
              </Link>
            )}

            <span className="flex items-center gap-2 ml-auto">
              <Heart
                size={24}
                onClick={() => mutateLike()}
                weight={`${props.liked ? 'fill' : 'regular'}`}
                className={`cursor-pointer ${
                  props.liked ? 'text-red-500' : 'text-zinc-500'
                } ${isLoading ? 'animate-bounce' : ''}`}
              />
              {countLike}

              <ChatCircle size={24} className="cursor-pointer text-zinc-500" />
              {props.item.n_comement}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
