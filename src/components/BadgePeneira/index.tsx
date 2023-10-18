import { IPeneira } from '../../context/AuthProvider/type';

interface value {
  value: IPeneira[];
}

export function BadgePeneira(props: value) {
  return (
    <>
      {props.value.map((peneira) => (
        <div key={peneira.id_peneira} className="flex gap-2 items-center">
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-secondary-40 text-white">
            {peneira.tipoDesejo}
          </div>
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-[#FFE576] text-[#D7B21A]">
            {peneira.idadeMaxima} a {peneira.idadeMinima} anos
          </div>
          <div className="px-3 py-1 w-fit text-[12px] rounded-full bg-primary-20 text-white">
            {peneira.cidade}
          </div>
        </div>
      ))}
    </>
  );
}
