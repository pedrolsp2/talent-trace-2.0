import { Link } from 'react-router-dom';
import { BadgePeneira } from '../../components/BadgePeneira';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Filter, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPeneiras } from '../../context/hooks/getData';
import { IPeneira } from '../../context/AuthProvider/type';

export const Peneiras = () => {
  const fetchPeneira = async (): Promise<IPeneira[]> => {
    const data = await fetchPeneiras();
    if (data) {
      return data as IPeneira[];
    } else {
      return [];
    }
  };

  const { data, isLoading } = useQuery<IPeneira[]>({
    queryKey: ['listPeneira'],
    queryFn: fetchPeneira,
  });

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className="flex flex-col gap-1 p-3">
        <section className="flex items-center justify-between p-2">
          <h1>Filtros</h1>
          <Filter />
        </section>
        <section className="flex flex-wrap items-center gap-2 px-4 py-2 border dark:border-zinc-900">
          <span className="flex flex-col gap-1 p-1">
            <label htmlFor="cidade">Filtrar por cidade</label>
            <input
              type="text"
              className="bg-transparent border border-zinc-500"
            />
          </span>
          <span className="flex flex-col gap-1 p-1">
            <label htmlFor="cidade">Filtrar por posição</label>
            <input
              type="text"
              className="bg-transparent border border-zinc-500"
            />
          </span>
          <span className="flex flex-col gap-1 p-1">
            <label htmlFor="idade">Filtrar por idade</label>
            <input
              type="text"
              className="bg-transparent border border-zinc-500"
            />
          </span>
        </section>
      </div>
      {data &&
        data.map((peneira: IPeneira) => (
          <Link to={`/peneira/${peneira.id_peneira}`} key={peneira.id_peneira}>
            <div className="grid grid-cols-[75%,1fr] gap-x-12 items-center border dark:border-zinc-800 border-[#fafafa] p-2 rounded">
              <div className="flex flex-col gap-2 p-1">
                <span className="text-[#3c3c3c] dark:text-zinc-300 text-lg font-bold leading-[normal] flex items-center gap-2">
                  <svg
                    width={22}
                    height={17}
                    viewBox="0 0 22 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <svg
                      width={22}
                      height={17}
                      viewBox="0 0 22 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 16.5V12.5C0 11.9333 0.195833 11.4583 0.5875 11.075C0.979167 10.6917 1.45 10.5 2 10.5H5.275C5.60833 10.5 5.925 10.5833 6.225 10.75C6.525 10.9167 6.76667 11.1417 6.95 11.425C7.43333 12.075 8.02917 12.5833 8.7375 12.95C9.44583 13.3167 10.2 13.5 11 13.5C11.8167 13.5 12.5792 13.3167 13.2875 12.95C13.9958 12.5833 14.5833 12.075 15.05 11.425C15.2667 11.1417 15.5208 10.9167 15.8125 10.75C16.1042 10.5833 16.4083 10.5 16.725 10.5H20C20.5667 10.5 21.0417 10.6917 21.425 11.075C21.8083 11.4583 22 11.9333 22 12.5V16.5H15V14.225C14.4167 14.6417 13.7875 14.9583 13.1125 15.175C12.4375 15.3917 11.7333 15.5 11 15.5C10.2833 15.5 9.58333 15.3875 8.9 15.1625C8.21667 14.9375 7.58333 14.6167 7 14.2V16.5H0ZM11 12.5C10.3667 12.5 9.76667 12.3542 9.2 12.0625C8.63333 11.7708 8.15833 11.3667 7.775 10.85C7.49167 10.4333 7.1375 10.1042 6.7125 9.8625C6.2875 9.62083 5.825 9.5 5.325 9.5C5.69167 8.88333 6.46667 8.39583 7.65 8.0375C8.83333 7.67917 9.95 7.5 11 7.5C12.05 7.5 13.1667 7.67917 14.35 8.0375C15.5333 8.39583 16.3083 8.88333 16.675 9.5C16.1917 9.5 15.7333 9.62083 15.3 9.8625C14.8667 10.1042 14.5083 10.4333 14.225 10.85C13.8583 11.3833 13.3917 11.7917 12.825 12.075C12.2583 12.3583 11.65 12.5 11 12.5ZM3 9.5C2.16667 9.5 1.45833 9.20833 0.875 8.625C0.291667 8.04167 0 7.33333 0 6.5C0 5.65 0.291667 4.9375 0.875 4.3625C1.45833 3.7875 2.16667 3.5 3 3.5C3.85 3.5 4.5625 3.7875 5.1375 4.3625C5.7125 4.9375 6 5.65 6 6.5C6 7.33333 5.7125 8.04167 5.1375 8.625C4.5625 9.20833 3.85 9.5 3 9.5ZM19 9.5C18.1667 9.5 17.4583 9.20833 16.875 8.625C16.2917 8.04167 16 7.33333 16 6.5C16 5.65 16.2917 4.9375 16.875 4.3625C17.4583 3.7875 18.1667 3.5 19 3.5C19.85 3.5 20.5625 3.7875 21.1375 4.3625C21.7125 4.9375 22 5.65 22 6.5C22 7.33333 21.7125 8.04167 21.1375 8.625C20.5625 9.20833 19.85 9.5 19 9.5ZM11 6.5C10.1667 6.5 9.45833 6.20833 8.875 5.625C8.29167 5.04167 8 4.33333 8 3.5C8 2.65 8.29167 1.9375 8.875 1.3625C9.45833 0.7875 10.1667 0.5 11 0.5C11.85 0.5 12.5625 0.7875 13.1375 1.3625C13.7125 1.9375 14 2.65 14 3.5C14 4.33333 13.7125 5.04167 13.1375 5.625C12.5625 6.20833 11.85 6.5 11 6.5Z"
                        fill="#666666"
                      />
                    </svg>
                  </svg>
                  {peneira.nomePeneira}
                  {data && <BadgePeneira value={data} />}
                </span>
                <p className="text-[#666] dark:text-zinc-400 p-2 text-sm">
                  {peneira.descricaoPeneira}
                </p>
              </div>

              <div className="flex justify-between">
                <Avatar>
                  <AvatarFallback>TT</AvatarFallback>
                  <AvatarImage src={peneira.fotoOlheiro} />
                </Avatar>
                <div className="flex items-center gap-2">
                  <UserCheck size={24} color="#8D8D8D" />
                  <div className="text-[#888]  text-xs ">10 inscritos</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </>
  );
};
