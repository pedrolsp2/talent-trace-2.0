import { useQuery } from '@tanstack/react-query';
import { IPeneira } from '../../context/AuthProvider/type';
import { fetchPeneira } from '../../context/hooks/getData';
import { useParams } from 'react-router-dom';

export const Peneira = () => {
  const { id } = useParams();

  async function getPeneira(): Promise<IPeneira[]> {
    const data = await fetchPeneira(Number(id));
    if (data) {
      return data as IPeneira[];
    } else {
      return [];
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['peneira'],
    queryFn: getPeneira,
  });

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  return <></>;
};
