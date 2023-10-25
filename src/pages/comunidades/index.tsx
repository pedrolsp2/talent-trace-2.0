import { ListComunidades } from '../../components/ListComunidades';
import { CardComunidade } from '../../components/CardComunidade';
import { ListComunidadesMobile } from '../../components/ListComunidadesMobile';
import { useEffect, useState } from 'react';
import { fetchComunidade, fetchDataUser } from '../../context/hooks/getData';
import { ComunidadeProps, InfoUser } from '../../context/AuthProvider/type';
import { ComunidadeHeader } from '../../components/ComunidadeHeader';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function Comunidades() {
  const [userData, setUserData] = useState<InfoUser | null>(null);

  const fetchComunidades = async (): Promise<ComunidadeProps[]> => {
    const data = await fetchComunidade();
    if (data) {
      return data as ComunidadeProps[];
    } else {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['comunidades'],
    queryFn: fetchComunidades,
  });

  const storage = getUserLocalStorage();
  const email = storage[0];
  const itemsToDisplay = isMobileDevice()
    ? data?.slice(0, 2)
    : data?.slice(0, 5);

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData();
  }, [email]);

  if (isLoading) {
    return (
      <div className="w-12 h-12 mx-auto my-8">
        <Lottie animationData={animation} loop={true} />
      </div>
    );
  }

  return (
    <>
      {data && userData && (
        <ComunidadeHeader userData={userData} fetch={fetchComunidades} />
      )}
      <div className="flex flex-col gap-4 p-2 bg-white dark:bg-dark-TT">
        <div className="flex justify-center gap-2">
          {itemsToDisplay &&
            itemsToDisplay.map((card) => (
              <CardComunidade key={card.nome} value={card} />
            ))}
        </div>
        {data &&
          data.map((card) => (
            <div key={card.nome}>
              {isMobileDevice() ? (
                <ListComunidadesMobile value={card} />
              ) : (
                <ListComunidades value={card} />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
