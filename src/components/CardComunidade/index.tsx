import { ComunidadeProps } from '../../context/AuthProvider/type';
import { UserCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface value {
  value: ComunidadeProps;
}

export function CardComunidade(props: value) {
  return (
    <Link to={`/comunidade/${props.value.nameURL}`} className="cursor-pointer">
      <div className="inline-flex flex-col justify-between items-start p-3 w-44 h-[15rem] rounded-md border border-[#eeeeee] dark:border-zinc-800">
        <div className="flex flex-col items-start gap-1">
          <div
            className="relative flex flex-col items-start"
            style={{ backgroundPosition: 'center' }}
          >
            <img
              src={props.value.banner}
              alt="Capa da comunidade"
              className="w-40 h-20 rounded object-cover image-center"
            />
          </div>
          <div className="self-stretch mt-2">
            <div className="text-[#3c3c3c] dark:text-zinc-300 text-lg font-semibold leading-[101.49%]">
              {props.value.nome}
            </div>
          </div>
        </div>
        <div className="text-[#8c8c8c] dark:text-zinc-400 text-xs leading-[100%]">
          {props.value.descricao}
        </div>
        <div className="flex items-center gap-2">
          <UserCheck2 size={24} color="#8D8D8D" className="cursor-pointer" />
          <div className="text-[#888] text-xs">8 membros</div>
        </div>
      </div>
    </Link>
  );
}
