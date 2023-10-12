import { ListComunidades } from '../../components/ListComunidades';
import { CardComunidade } from '../../components/CardComunidade';
import { ListComunidadesMobile } from '../../components/ListComunidadesMobile';
import { useEffect, useState } from 'react';
import { fetchComunidade, fetchDataUser } from '../../context/hooks/getData';
import { ComunidadeProps, InfoUser } from '../../context/AuthProvider/type';
import { ComunidadeHeader } from '../../components/ComunidadeHeader';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function Comunidades() {
  const [comunidade, setComunidade] = useState<ComunidadeProps[] | null>(null);
  const [userData, setUserData] = useState<InfoUser | null>(null);

  const data = getUserLocalStorage();
  const email = data[0];
  const itemsToDisplay = isMobileDevice()
    ? comunidade?.slice(0, 2)
    : comunidade?.slice(0, 5);

  async function fetchData() {
    try {
      const postData = await fetchComunidade();
      if (postData) {
        setComunidade(postData as ComunidadeProps[]);
      } else {
        setComunidade(null);
      }
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

  return (
    <>
      {comunidade && userData && <ComunidadeHeader userData={userData} />}
      <div className="flex flex-col p-2 gap-4 bg-white dark:bg-dark-TT">
        <div className="flex gap-2">
          {itemsToDisplay &&
            itemsToDisplay.map((card) => (
              <CardComunidade key={card.nome} value={card} />
            ))}
        </div>
        {itemsToDisplay &&
          itemsToDisplay.map((card) => (
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
