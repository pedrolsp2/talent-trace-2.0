import { ListComunidades } from '../../components/ListComunidades';
import { CardComunidade } from '../../components/CardComunidade';
import { ListComunidadesMobile } from '../../components/ListComunidadesMobile';
import { useEffect, useState } from 'react';
import { fetchComunidade } from '../../context/hooks/getData';
import { ComunidadeProps } from '../../context/AuthProvider/type';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function Comunidades() {
  const [comunidade, setComunidade] = useState<ComunidadeProps[] | null>(null);

  async function fetchData() {
    try {
      const postData = await fetchComunidade();
      if (postData) {
        setComunidade(postData as ComunidadeProps[]);
      } else {
        setComunidade(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col p-2 gap-4 bg-white dark:bg-dark-TT">
      <div className="flex gap-2">
        {comunidade &&
          comunidade.map((card) => (
            <CardComunidade key={card.nome} value={card} />
          ))}
      </div>
      {comunidade &&
        comunidade.map((card) => (
          <div key={card.nome}>
            {isMobileDevice() ? (
              <ListComunidadesMobile value={card} />
            ) : (
              <ListComunidades value={card} />
            )}
          </div>
        ))}
    </div>
  );
}
