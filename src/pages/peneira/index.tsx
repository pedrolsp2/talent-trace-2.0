import { useMutation, useQuery } from '@tanstack/react-query';
import { IPeneira, InfoUser } from '../../context/AuthProvider/type';
import {
  deleteUserPeneira,
  fetchDataUser,
  fetchPeneira,
  fetchUserPeneira,
  getParticipantes,
  userNewPeneira,
} from '../../context/hooks/getData';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CountdownTimer from '@/components/CoutdownTime';
import { getUserLocalStorage } from '@/context/AuthProvider/uitl';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

type IPart = {
  cref?: number;
  email: string;
  foto: string;
  id_peneira: number;
  id_user: number;
  nome: string;
  nomeUser: string;
};

export const Peneira = () => {
  const { id } = useParams();
  const [status, setStatus] = useState(false);
  const stroage = getUserLocalStorage();
  const email = stroage[0];

  const fetchData = async (): Promise<InfoUser> => {
    const userData = await fetchDataUser(email);
    if (userData) {
      return userData as InfoUser;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['user', id],
    queryFn: fetchData,
  });

  async function getPeneira(): Promise<IPeneira> {
    const data = await fetchPeneira(Number(id));
    if (data) {
      return (data[0] as IPeneira) || '';
    } else {
      return {} as IPeneira;
    }
  }

  async function getParticipantesData(): Promise<IPart[]> {
    const data = await getParticipantes(Number(id));
    if (data) {
      return data as IPart[];
    } else {
      return [];
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['peneira'],
    queryFn: getPeneira,
  });

  const {
    data: dataParticipantes,
    isLoading: loading,
    mutate,
  } = useMutation({
    mutationFn: getParticipantesData,
  });

  const { mutate: mutateInscreva, isLoading: loadingInscreva } = useMutation(
    () =>
      userNewPeneira(
        userData?.id_user || 0,
        Number(id),
        data?.nomePeneira || '',
        userData?.user || '',
        userData?.fotoPerfil || '',
        userData?.email || ''
      ),
    {
      onSuccess() {
        fetchStatus();
      },
    }
  );

  const { mutate: mutateSair, isLoading: loadingSair } = useMutation({
    mutationFn: () =>
      deleteUserPeneira(userData?.id_user || 0, Number(id) || 0),
    mutationKey: ['sair'],
    onSuccess: () => {
      fetchStatus();
    },
    onError(error) {
      console.log(error);
    },
  });

  async function fetchStatus() {
    const result = await fetchUserPeneira(
      Number(id) || 0,
      userData?.id_user || 0
    );
    console.log(result);
    setStatus(result);
  }

  useEffect(() => {
    fetchStatus();
    const newTitle = 'Talent Trace | Peneira';
    document.title = newTitle;
  }, [id]);

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className="grid items-center justify-between grid-cols-[240px,1fr] gap-8 p-2 ">
        <div className="flex items-center justify-center">
          <img src={data?.banner} alt="Banner" />
        </div>
        <div className="flex flex-col gap-2 p-4 border dark:border-dark-TT2">
          <span className="font-bold text-[24px] text-zinc-800 dark:text-white flex justify-between">
            {data?.nomePeneira}
            <CountdownTimer targetDate={data?.dataPeneira} />
          </span>
          <div className="flex items-center gap-2">
            <img
              src={data?.fotoOlheiro}
              alt={data?.nomeOlheiro}
              className="w-12 h-12 rounded-full"
            />
            <span className="text-zinc-500">Olheiro organizador</span>
          </div>
          <span className="mt-4 text-zinc-600 dark:text-zinc-300">
            {data?.descricaoPeneira}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mt-4 ml-auto text-white bg-primary-50 hover:bg-primary-60"
                onClick={() => mutate()}
              >
                Ver inscritos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-dark-TT2 max-w-fit">
              {loading && <h1>Carregando...</h1>}
              {dataParticipantes && dataParticipantes?.length > 0 ? (
                dataParticipantes.map((part) => (
                  <div key={part.id_user} className="p-4">
                    <div className="flex items-center gap-2 p-2">
                      <img
                        src={part.foto}
                        alt={part.nomeUser}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[14px]">
                          {part.nomeUser}
                        </span>
                        <span className="text-[12px]">{part.email}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span>Ainda não há participantes.</span>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <main className="relative flex flex-col p-4 my-4">
        {' '}
        <h1 className="font-bold text-[24px] text-zinc-800 dark:text-white text-center my-2 mb-4">
          Ficha da peneira
        </h1>
        <div className="flex flex-col gap-4">
          {' '}
          <span className="dark:text-zinc-300">
            <strong className="text-zinc-800 dark:text-white">
              Quem pode participar:
            </strong>{' '}
            Joves de {data?.idadeMinima} até {data?.idadeMaxima} anos.
          </span>
          <span className="dark:text-zinc-300">
            <strong className="text-zinc-800 dark:text-white">
              Local da peneira:{' '}
            </strong>
            <a
              href={data?.local}
              className="font-bold text-primary-50"
              target="_blank"
            >
              {data?.nomeLocal}
            </a>{' '}
            - {data?.cidade}
          </span>
          <span className="dark:text-zinc-300">
            <strong className="text-zinc-800 dark:text-white">Data:</strong>{' '}
            <time>
              {data?.dataPeneira?.toDate()
                ? `${data?.dataPeneira
                    .toDate()
                    .toLocaleDateString('pt-BR')} - ${data?.dataPeneira
                    .toDate()
                    .toLocaleTimeString()}`
                : 'Data não disponível'}
            </time>
          </span>
          <span className="dark:text-zinc-300">{data?.obs}</span>
        </div>
        {!status ? (
          <Button
            className="px-8 mx-auto mt-4 text-white bg-primary-50 hover:bg-primary-60"
            onClick={() => mutateInscreva()}
          >
            {loadingInscreva ? (
              <Loader className="animate-spin" />
            ) : (
              'Inscrever-se'
            )}
          </Button>
        ) : (
          <Button
            className="px-8 mx-auto mt-4 text-white bg-primary-50 hover:bg-primary-60"
            onClick={() => mutateSair()}
          >
            {loadingSair ? <Loader className="animate-spin" /> : 'Sair'}
          </Button>
        )}
      </main>
    </>
  );
};
