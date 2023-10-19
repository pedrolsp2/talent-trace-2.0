import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  InfoUser,
  ComunidadeProps,
  ContentComunidade,
} from '../../context/AuthProvider/type';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import {
  countUserComunidade,
  fetchComunidadeName,
  fetchContentComundiade,
  fetchDataUser,
  fetchUserComunidade,
  userNewComunidade,
} from '../../context/hooks/getData';
import { Heart, UserCheck } from 'lucide-react';
import { ComunidadeHeader } from '../../components/ComunidadeHeader';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { ChatCircle } from '@phosphor-icons/react';
import { BadgeType } from '../../components/BadgeType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export const Comunidade = () => {
  const [comunidade, setComunidade] = useState<ComunidadeProps | null>(null);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [count, setCount] = useState(0);
  const { name } = useParams<{ name: string }>();
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const strogae = getUserLocalStorage();
  const email = strogae[0];

  const fetchComunidades = async (): Promise<ContentComunidade[]> => {
    const dataComunidade = await fetchContentComundiade(name || '');
    if (dataComunidade) {
      return dataComunidade as ContentComunidade[];
    } else {
      return [];
    }
  };

  const { data } = useQuery({
    queryKey: ['comunidade_contet'],
    queryFn: fetchComunidades,
  });

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

  async function fetchStatus() {
    const result = await fetchUserComunidade(
      name || '',
      userData?.id_user || 0
    );
    setStatus(result);
    setIsLoading(false);

    const count = await countUserComunidade(name || '');
    setCount(count);
    queryClient.invalidateQueries({ queryKey: ['menu-comunidade'] });
  }

  useEffect(() => {
    fetchData();
    const newTitle = 'Talent Trace | Comunidade';
    document.title = newTitle;
  }, [name]);

  useEffect(() => {
    setIsLoading(true);

    if (userData) {
      fetchStatus();
    }
  }, [name, userData]);

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-10 w-full dark:bg-dark-TT3 rounded-none bg-slate-100" />
        <Skeleton className="flex justify-between items-center self-stretch py-1 px-8 border-b border-b-[#e8e8e8] dark:border-dark-TT">
          <Skeleton className="flex justify-center items-center py-3 gap-4 px-0">
            <Skeleton className="rounded-full w-20 h-20 dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col justify-between gap-1">
              <Skeleton className="text-[#3c3c3c] dark:text-zinc-300 text-[2rem] font-semibold leading-[100%] h-6 w-48 dark:bg-dark-TT3 bg-slate-100"></Skeleton>
              <Skeleton className="flex items-center gap-1 h-4 w-24 dark:bg-dark-TT3 bg-slate-100">
                <Skeleton className="text-[#888] dark:text-zinc-400 text-sm leading-[155.99%]"></Skeleton>
              </Skeleton>
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="p-2 flex flex-col">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 w-16 h-4 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-2" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="p-2 flex flex-col">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 w-16 h-4 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-2" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="p-2 flex flex-col">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 w-16 h-4 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-2" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="p-2 flex flex-col">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 w-16 h-4 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-2" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="p-2 flex flex-col">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 w-16 h-4 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-2" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
      </>
    );
  }

  return (
    <>
      {userData &&
        userData.cref &&
        (status ? (
          <ComunidadeHeader
            userData={userData}
            new
            status
            key={userData.id_user}
          />
        ) : (
          <ComunidadeHeader userData={userData} new key={userData.id_user} />
        ))}

      {isMobileDevice() ? (
        <>
          {' '}
          <div className="flex flex-col p-1">
            <div className="flex py-3 gap-4 px-0">
              <img
                src={comunidade?.banner}
                alt={comunidade?.nome}
                className="rounded-full w-12 h-12"
              />
              <div className="flex flex-col justify-between gap-1">
                <div className="text-[#3c3c3c] dark:text-zinc-300 text-[1.5rem] font-semibold leading-[100%]">
                  {comunidade?.nome}
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="w-5 h-5 text-zinc-400" />
                  <div className="text-[#888] dark:text-zinc-400 text-sm leading-[155.99%]">
                    {count} membros
                  </div>
                </div>
              </div>
            </div>

            {!status ? (
              <button
                className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]"
                onClick={() => mutate()}
              >
                Entrar
              </button>
            ) : (
              <button className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]">
                Sair
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {' '}
          <div className="flex justify-between items-center self-stretch py-1 px-8">
            <div className="flex justify-center items-center py-3 gap-4 px-0">
              <img
                src={comunidade?.banner}
                alt={comunidade?.nome}
                className="rounded-full w-20 h-20"
              />
              <div className="flex flex-col justify-between gap-1">
                <div className="text-[#3c3c3c] dark:text-zinc-300 text-[2rem] font-semibold leading-[100%]">
                  {comunidade?.nome}
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="w-5 h-5 text-zinc-400" />
                  <div className=" text-[#888] dark:text-zinc-400 text-sm leading-[155.99%]">
                    {count} membros
                  </div>
                </div>
              </div>
            </div>

            {!status ? (
              <button
                className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]"
                onClick={() => mutate()}
              >
                Entrar
              </button>
            ) : (
              <button className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]">
                Sair
              </button>
            )}
          </div>
        </>
      )}

      {data?.length == 0 && (
        <>
          <h1 className="text-center my-6">
            Sem post nesta comunidade.
            <Link to={`/comunidades`} className="text-primary-50">
              {' '}
              Voltar para comunidades
            </Link>
          </h1>
        </>
      )}
      {data &&
        data.map((item) =>
          isMobileDevice() ? (
            <>
              <div className="flex flex-col gap-8 px-1 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
                <div className="flex gap-2 w-full">
                  <Avatar>
                    <AvatarFallback>FT</AvatarFallback>
                    <AvatarImage src={item.fotoOlheiro} />'
                  </Avatar>
                  <div className="flex flex-col  w-full">
                    <span className="text-[#3c3c3c] dark:text-zinc-300 text-md">
                      {item.nomeOlheiro}
                    </span>
                    <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                      {item.titulo}
                    </span>
                    <span className="ml-auto">
                      <BadgeType type={item.tipo} variant="default" />
                    </span>
                  </div>
                </div>
                <p className="dark:text-zinc-400">{item.conteudo}</p>
                <span className="ml-auto flex items-center gap-2">
                  <Heart size={24} className="cursor-pointer text-zinc-500" />
                  <ChatCircle
                    size={24}
                    className="cursor-pointer text-zinc-500"
                  />
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 flex flex-col">
                <div className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
                  <Avatar>
                    <AvatarFallback>FT</AvatarFallback>
                    <AvatarImage src={item.fotoOlheiro} />'
                  </Avatar>
                  <div className="flex flex-col gap-5 px-2">
                    <div className="flex flex-col">
                      <span className="text-[#3c3c3c] dark:text-zinc-300 text-md">
                        {item.nomeOlheiro}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                          {item.titulo}
                        </span>
                        <BadgeType type={item.tipo} variant="default" />
                      </div>
                    </div>
                    <p className="dark:text-zinc-400">{item.conteudo}</p>
                    <span className="ml-auto flex items-center gap-2">
                      <Heart
                        size={24}
                        className="cursor-pointer text-zinc-500"
                      />
                      <ChatCircle
                        size={24}
                        className="cursor-pointer text-zinc-500"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </>
          )
        )}
    </>
  );
};
