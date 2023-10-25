import {
  fetchAnswers,
  fetchDataUser,
  fetchPost,
} from '../../context/hooks/getData';
import { useParams } from 'react-router-dom';
import { InfoUser, PostProps } from '../../context/AuthProvider/type';
import { Skeleton } from '../../components/ui/skeleton';
import { ChatCircle, Heart, ShareNetwork, Swap } from '@phosphor-icons/react';
import { Post } from '../../components/Post';
import { Separator } from '../../components/Separator';
import { FormPost } from '../../components/FormPost';
import { useQuery } from '@tanstack/react-query';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';

export function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const data = getUserLocalStorage();
  const email = data[0];

  const fetchDUser = async (): Promise<InfoUser> => {
    const postData = await fetchDataUser(email);
    if (postData) {
      return postData as InfoUser;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const fetchDataPost = async (): Promise<PostProps> => {
    const postData = await fetchPost(Number(id));
    if (postData) {
      return postData as PostProps;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const fetchDataAnswers = async (): Promise<PostProps[]> => {
    const postData = await fetchAnswers(Number(id));
    if (postData) {
      return postData as PostProps[];
    } else {
      return [];
    }
  };

  const { data: post, isLoading } = useQuery({
    queryKey: [`post${id}`],
    queryFn: fetchDataPost,
  });

  const { data: answ } = useQuery({
    queryKey: [`answers${id}`],
    queryFn: fetchDataAnswers,
  });

  const { data: userData } = useQuery({
    queryKey: [`answersUser${id}`],
    queryFn: fetchDUser,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col px-5 py-6">
        <div className="grid grid-cols-[auto,1fr] gap-3">
          <Skeleton className="w-12 h-12 rounded-full bg-slate-300 dark:bg-dark-TT3" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold">
                <Skeleton className="w-[10rem] h-4 bg-slate-300 dark:bg-dark-TT3" />
              </span>
              <small className="text-slate-400">
                <Skeleton className="w-[5rem] h-3 bg-slate-300 dark:bg-dark-TT3" />
              </small>
            </div>
            <div className="flex flex-col gap-1 p-1">
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
            </div>
            <div className="flex items-center pt-3">
              <div className="flex gap-12">
                <span className="flex items-center justify-center gap-2 text-zinc-500">
                  <ChatCircle size={24} className="cursor-pointer" />
                  <span className="text-base">
                    <Skeleton className="w-8 h-8 bg-slate-300 dark:bg-dark-TT3" />
                  </span>
                </span>
                <span className="flex items-center justify-center gap-2 text-zinc-500">
                  <Swap size={24} className="cursor-pointer" />
                  <span className="text-base">
                    <Skeleton className="w-8 h-8 bg-slate-300 dark:bg-dark-TT3" />
                  </span>
                </span>
                <span className="flex items-center justify-center gap-2 text-zinc-500">
                  <Heart size={24} className="cursor-pointer" />
                  <span className="text-base">
                    <Skeleton className="w-8 h-8 bg-slate-300 dark:bg-dark-TT3" />
                  </span>
                </span>
              </div>
              <ShareNetwork
                size={24}
                className="ml-auto cursor-pointer text-zinc-400"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {post && (
        <>
          <Post value={post} />
          <Separator />
          <FormPost value={userData || null} answer />
          <Separator />
        </>
      )}
      {answ &&
        answ.map((item) => <Post key={item.id_post} value={item} answer />)}
    </>
  );
}
