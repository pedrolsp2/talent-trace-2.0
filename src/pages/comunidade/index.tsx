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
  deleteUserComunidade,
  fetchComunidadeName,
  fetchContentComundiade,
  fetchDataUser,
  fetchLikeContent,
  fetchUserComunidade,
  userNewComunidade,
} from '../../context/hooks/getData';
import { Loader, UserCheck } from 'lucide-react';
import { ComunidadeHeader } from '../../components/ComunidadeHeader';
import { Skeleton } from '../../components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentComunidad } from '@/components/ContentComunidade';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

async function checkLikedStatus(
  id_user: number,
  id_post: number
): Promise<boolean | undefined> {
  const like = await fetchLikeContent(id_user, id_post);
  return like;
}

export const Comunidade = () => {
  const [comunidade, setComunidade] = useState<ComunidadeProps | null>(null);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const { name } = useParams<{ name: string }>();
  const [count, setCount] = useState(0);
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

  const { mutate: mutateSair, isLoading: isLoadingSair } = useMutation(
    () => deleteUserComunidade(userData?.id_user || 0, name || ''),
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

  const fetchLiked = async () => {
    if (data) {
      const promises = data.map((item) =>
        checkLikedStatus(userData?.id_user || 0, item.id_content)
      );
      return Promise.all(promises);
    } else {
      return [];
    }
  };

  const { data: likedPromises } = useQuery({
    queryKey: ['likesContent', name],
    queryFn: fetchLiked,
  });

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
        <Skeleton className="w-full h-10 rounded-none dark:bg-dark-TT3 bg-slate-100" />
        <Skeleton className="flex justify-between items-center self-stretch py-1 px-8 border-b border-b-[#e8e8e8] dark:border-dark-TT">
          <Skeleton className="flex items-center justify-center gap-4 px-0 py-3">
            <Skeleton className="w-20 h-20 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col justify-between gap-1">
              <Skeleton className="text-[#3c3c3c] dark:text-zinc-300 text-[2rem] font-semibold leading-[100%] h-6 w-48 dark:bg-dark-TT3 bg-slate-100"></Skeleton>
              <Skeleton className="flex items-center w-24 h-4 gap-1 dark:bg-dark-TT3 bg-slate-100">
                <Skeleton className="text-[#888] dark:text-zinc-400 text-sm leading-[155.99%]"></Skeleton>
              </Skeleton>
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="flex flex-col p-2">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="w-16 h-4 dark:bg-dark-TT3 bg-slate-100 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="w-full h-4 mt-2 text-xl font-semibold dark:bg-dark-TT3 bg-slate-100" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="flex flex-col p-2">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="w-16 h-4 dark:bg-dark-TT3 bg-slate-100 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="w-full h-4 mt-2 text-xl font-semibold dark:bg-dark-TT3 bg-slate-100" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="flex flex-col p-2">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="w-16 h-4 dark:bg-dark-TT3 bg-slate-100 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="w-full h-4 mt-2 text-xl font-semibold dark:bg-dark-TT3 bg-slate-100" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="flex flex-col p-2">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="w-16 h-4 dark:bg-dark-TT3 bg-slate-100 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="w-full h-4 mt-2 text-xl font-semibold dark:bg-dark-TT3 bg-slate-100" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
              <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-full h-4 mt-[-12px]" />
            </Skeleton>
          </Skeleton>
        </Skeleton>
        <Skeleton className="flex flex-col p-2">
          <Skeleton className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
            <Skeleton className="w-10 h-10 rounded-full dark:bg-dark-TT3 bg-slate-100" />
            <Skeleton className="flex flex-col gap-5 px-2">
              <Skeleton className="flex flex-col">
                <Skeleton className="w-16 h-4 dark:bg-dark-TT3 bg-slate-100 text-md" />
                <Skeleton className="dark:bg-dark-TT3 bg-slate-100 font-semibold text-xl w-[300px] h-4 mt-1" />
              </Skeleton>
              <Skeleton className="w-full h-4 mt-2 text-xl font-semibold dark:bg-dark-TT3 bg-slate-100" />
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
            <div className="flex gap-4 px-0 py-3">
              <img
                src={comunidade?.banner}
                alt={comunidade?.nome}
                className="object-cover w-12 h-12 rounded-full"
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
              <button
                className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]"
                onClick={() => mutateSair()}
              >
                {isLoadingSair ? <Loader className="animate-spin" /> : 'Sair'}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center self-stretch justify-between px-8 py-1">
            <div className="flex items-center justify-center gap-4 px-0 py-3">
              <img
                src={comunidade?.banner}
                alt={comunidade?.nome}
                className="w-20 h-20 rounded-full"
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
              <button
                className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-primary-50 text-white text-sm font-bold leading-[100%]"
                onClick={() => mutateSair()}
              >
                {isLoadingSair ? <Loader className="animate-spin" /> : 'Sair'}
              </button>
            )}
          </div>
        </>
      )}

      {data?.length == 0 && (
        <>
          <h1 className="my-6 text-center">
            Sem post nesta comunidade.
            <Link to={`/comunidades`} className="text-primary-50">
              {' '}
              Voltar para comunidades
            </Link>
          </h1>
        </>
      )}
      {data &&
        data.map((item, index) => {
          const liked = likedPromises?.[index] ?? null;
          return <ContentComunidad item={item} key={index} liked={liked!} />;
        })}
    </>
  );
};
