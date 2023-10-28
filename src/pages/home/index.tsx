import { useEffect } from 'react';
import { Separator } from '../../components/Separator';
import { FormPost } from '../../components/FormPost';
import { Post } from '../../components/Post';
import {
  fetchDataPost,
  fetchDataUser,
  fetchLike,
} from '../../context/hooks/getData';
import { InfoUser, PostProps } from '../../context/AuthProvider/type';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

async function checkLikedStatus(
  id_user: number,
  id_post: number
): Promise<boolean | undefined> {
  const like = await fetchLike(id_user, id_post);
  return like;
}

export default function Home() {
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

  const fetchData = async (): Promise<InfoUser> => {
    const userData = await fetchDataUser(email);
    if (userData) {
      return userData as InfoUser;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const fetchLiked = async () => {
    if (data) {
      const promises = data.map((item) =>
        checkLikedStatus(userData?.id_user || 0, item.id_post)
      );
      return Promise.all(promises);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['post'],
    queryFn: fetchPost,
  });

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchData,
  });

  const { data: likedPromises } = useQuery({
    queryKey: ['likes'],
    queryFn: fetchLiked,
  });

  useEffect(() => {
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
      <FormPost value={userData || null} fetch={fetchData} />
      <Separator />
      {data &&
        [...data]
          .sort((a, b) => {
            const dateA = a.dataPost ? new Date(a.dataPost).getTime() : 0;
            const dateB = b.dataPost ? new Date(b.dataPost).getTime() : 0;
            return dateA - dateB;
          })
          .map((item, index) => {
            const liked = likedPromises?.[index] ?? null;
            return (
              <div
                className="divide-y divide-slate-200 dark:divide-zinc-900"
                key={item.id_post}
              >
                <Post value={item} fetch={fetchData} liked={liked!} />
              </div>
            );
          })}
    </>
  );
}
