import { useQuery } from '@tanstack/react-query';
import { CardInfoBar } from './Card';
import { fetchUserPopularityData } from '../../context/hooks/getData';
import { Skeleton } from '../ui/skeleton';

export const InfoBar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['info'],
    queryFn: fetchUserPopularityData,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 py-8">
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
        <Skeleton className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <p className="w-24 p-2 text-sm font-bold rounded bg-zinc-800"></p>
              <p className="w-40 p-2 text-sm font-bold rounded bg-zinc-800"></p>
            </div>
          </div>
        </Skeleton>
      </div>
    );
  }
  return (
    <div className="sticky top-0 flex flex-col gap-4 w-full h-screen text-white dark:bg-dark-TT2 bg-[#fff] border dark:border-dark-TT3 p-2">
      <div className="flex flex-col p-2 border rounded dark:border-dark-TT3">
        <span className="font-bold text-zinc-400">Mais populares</span>
        {data
          ? data.map((item) => <CardInfoBar key={item.id_user} info={item} />)
          : null}
      </div>
    </div>
  );
};
