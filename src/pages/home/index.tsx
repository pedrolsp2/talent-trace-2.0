import { useEffect, useState } from 'react';
import { Separator } from '../../components/Separator';
import { FormPost } from '../../components/FormPost';
import { Post } from '../../components/Post';
import { fetchDataPost, fetchDataUser } from '../../context/hooks/getData';
import { InfoUser, PostProps } from '../../context/AuthProvider/type';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

export default function Home() {
  const [userData, setUserData] = useState<InfoUser | null>(null);

  const stroage = getUserLocalStorage();
  const email = stroage[0];

  const fetchPost = async (): Promise<PostProps[]> => {
    const data = await fetchDataPost();
    if (data) {
      return data as PostProps[];
    } else {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['post'],
    queryFn: fetchPost,
  });

  const fetchData = async () => {
    try {
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
  };

  useEffect(() => {
    fetchData();
    const newTitle = 'Talent Trace | Início';
    document.title = newTitle;
  }, []);

  if (isLoading) {
    return (
      <div className="w-12 h-12 mx-auto my-8">
        <Lottie animationData={animation} loop={true} />
      </div>
    );
  }
  return (
    <>
      <FormPost value={userData} fetch={fetchData} />
      <Separator />
      <div className="divide-y divide-slate-200 dark:divide-zinc-900">
        {data &&
          [...data]
            .sort((a, b) => {
              const dateA = a.dataPost ? new Date(a.dataPost).getTime() : 0;
              const dateB = b.dataPost ? new Date(b.dataPost).getTime() : 0;
              return dateA - dateB;
            })
            .map((item) => (
              <div key={item.id_post}>
                <Post value={item} fetch={fetchData} />
              </div>
            ))}
      </div>
    </>
  );
}
