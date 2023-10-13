import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InfoUser, ComunidadeProps } from '../../context/AuthProvider/type';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import {
  fetchComunidadeName,
  fetchDataUser,
  fetchUserComunidade,
} from '../../context/hooks/getData';
import { UserCheck } from 'lucide-react';
import { ComunidadeHeader } from '../../components/ComunidadeHeader';

export const Comunidade = () => {
  const [comunidade, setComunidade] = useState<ComunidadeProps | null>(null);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const { name } = useParams<{ name: string }>();
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const data = getUserLocalStorage();
  const email = data[0];

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

  useEffect(() => {
    fetchData();
    const newTitle = 'Talent Trace | Comunidade';
    document.title = newTitle;
  }, [name]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchStatus() {
      const result = await fetchUserComunidade(
        name || '',
        userData?.id_user || 0
      );
      setStatus(result);
      setIsLoading(false);
    }

    if (userData) {
      fetchStatus();
    }
  }, [name, userData]);

  if (isLoading) {
    return (
      <>
        <h1>carregando</h1>
      </>
    );
  }

  return (
    <>
      {userData && userData.cref && (
        <ComunidadeHeader userData={userData} new />
      )}
      <div className="flex justify-between items-center self-stretch py-1 px-8 border-b border-b-[#e8e8e8] dark:border-dark-TT">
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
              <div className="742_membros text-[#888] dark:text-zinc-400 text-sm leading-[155.99%]">
                742 membros
              </div>
            </div>
          </div>
        </div>
        {!status && (
          <button className="flex justify-center items-center gap-2.5 py-3 px-8 rounded bg-[#14af6c] text-white text-sm font-bold leading-[100%]">
            Entrar
          </button>
        )}
      </div>
    </>
  );
};
