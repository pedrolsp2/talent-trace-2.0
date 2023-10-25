import { CardInfoBar } from './Card';

export const InfoBar = () => {
  return (
    <div className="sticky top-0 flex flex-col gap-4 w-full h-screen text-white dark:bg-dark-TT2 bg-[#fff] border dark:border-dark-TT3 p-2">
      <div className="flex flex-col p-2 border rounded dark:border-dark-TT3">
        <span className="font-bold text-zinc-400">Mais populares</span>
        <CardInfoBar />
      </div>
      <div className="flex flex-col p-2 border rounded dark:border-dark-TT3">
        <span className="font-bold text-zinc-400">Mais avaliados</span>
        <CardInfoBar avaliados />
      </div>
    </div>
  );
};
