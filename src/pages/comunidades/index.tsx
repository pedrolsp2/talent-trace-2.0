import { ListComunidades } from '../../components/ListComunidades';
import { CardComunidade } from '../../components/CardComunidade';
import { ListComunidadesMobile } from '../../components/ListComunidadesMobile';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function Comunidades() {
  const data = [
    {
      banner:
        'https://pbs.twimg.com/profile_images/1287471934683447296/M2IOlQ5x_400x400.jpg',
      nome: 'São Paulo da zoeira',
      membros: 120,
      descricao: 'Tudo sobre o são paulo',
    },
    {
      banner:
        'https://pbs.twimg.com/profile_images/1481728251697508353/OWVC7UFH_400x400.jpg',
      nome: 'Brasileirão Zoeiro',
      membros: 321,
      descricao: 'Noticias e memes do campeonato',
    },
    {
      banner:
        'https://upload.wikimedia.org/wikipedia/pt/thumb/2/2b/Confedera%C3%A7%C3%A3o_Brasileira_de_Futebol_2019.svg/1200px-Confedera%C3%A7%C3%A3o_Brasileira_de_Futebol_2019.svg.png',
      nome: 'CBF Oficial',
      membros: 2141,
      descricao: 'Comunidade oficial da CBF',
    },
    {
      banner:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_FIFA.svg/307px-Flag_of_FIFA.svg.png',
      nome: 'FIFA',
      membros: 241,
      descricao: 'FIFA official',
    },
  ];
  const data1 = [
    {
      banner:
        'https://pbs.twimg.com/profile_images/1287471934683447296/M2IOlQ5x_400x400.jpg',
      nome: 'São Paulo da zoeira',
      membros: 120,
      descricao: 'Tudo sobre o são paulo',
    },
    {
      banner:
        'https://pbs.twimg.com/profile_images/1481728251697508353/OWVC7UFH_400x400.jpg',
      nome: 'Brasileirão Zoeiro',
      membros: 321,
      descricao: 'Noticias e memes do campeonato',
    },
  ];
  const datas = [
    {
      nome: 'Peneira - Frutal/MG',
      ft_olheiro: 'https://github.com/pedrolsp2.png',
      tipo: 'Peneiras',
      n_membros: 412,
      descricao:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit reprehenderit praesentium exercitationem amet ut officia? Totam suscipit accusamus rerum corporis harum aperiam, maiores veniam labore. Voluptate nesciunt a suscipit rerum.',
    },
    {
      nome: 'Peneira - Frutal/MG',
      ft_olheiro: 'https://github.com/pedrolsp2.png',
      tipo: 'Peneiras',
      n_membros: 412,
      descricao:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit reprehenderit praesentium exercitationem amet ut officia? Totam suscipit accusamus rerum corporis harum aperiam, maiores veniam labore. Voluptate nesciunt a suscipit rerum.',
    },
    {
      nome: 'Peneira - Frutal/MG',
      ft_olheiro: 'https://github.com/pedrolsp2.png',
      tipo: 'Peneiras',
      n_membros: 412,
      descricao:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit reprehenderit praesentium exercitationem amet ut officia? Totam suscipit accusamus rerum corporis harum aperiam, maiores veniam labore. Voluptate nesciunt a suscipit rerum.',
    },
  ];
  const dataToRender = isMobileDevice() ? data1 : data;

  return (
    <div className="flex flex-col p-2 gap-4 bg-white">
      <div className="flex gap-2">
        {dataToRender.map((card) => (
          <CardComunidade key={card.nome} value={card} />
        ))}
      </div>
      {datas.map((card) => (
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
