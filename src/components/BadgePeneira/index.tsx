import { IPeneira } from '../../context/AuthProvider/type';

interface value {
  value: IPeneira[];
}

export function BadgePeneira(props: value) {
  return (
    <>
      {props.value.map((peneira) => (
        <div key={peneira.id_peneira} className="flex items-center gap-2">
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-secondary-40 text-white">
            {peneira.tipoDesejo}
          </div>
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-[#FFE576] text-[#a5860c]">
            {peneira.idadeMaxima} a {peneira.idadeMinima} anos
          </div>
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-primary-30 text-white">
            {peneira.cidade}
          </div>
        </div>
      ))}
    </>
  );
}
