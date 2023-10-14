import { useEffect, useState } from 'react';
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
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';

export function ViewPost() {
  const [dataFetched, setDataFetched] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<PostProps | null>(null);
  const [answ, setAnsw] = useState<PostProps[]>([]);
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const data = getUserLocalStorage();
  const email = data[0];

  const fetchData = async () => {
    try {
      const postData = await fetchPost(Number(id));
      if (postData) {
        setPost(postData as PostProps);
      }

      const answers = await fetchAnswers(Number(id));
      setAnsw(answers as PostProps[]);

      const userData = await fetchDataUser(email);
      if (userData && userData.id_user) {
        setUserData(userData as InfoUser);
      } else {
        console.error('Property id_user not found in user data.');
      }

      setIsLoading(true);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateAnswers = async () => {
    try {
      const answers = await fetchAnswers(Number(id));
      setAnsw(answers as PostProps[]);
    } catch (error) {
      console.error('Error updating answers:', error);
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      fetchData();
      setDataFetched(true);
    }
  }, []);

  if (!isLoading) {
    return (
      <div className="px-5 py-6 flex flex-col">
        <div className="grid grid-cols-[auto,1fr] gap-3">
          <Skeleton className="w-12 h-12 bg-slate-300 dark:bg-dark-TT3 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold">
                <Skeleton className="w-[10rem] h-4 bg-slate-300 dark:bg-dark-TT3" />
              </span>
              <small className="text-slate-400">
                <Skeleton className="w-[5rem] h-3 bg-slate-300 dark:bg-dark-TT3" />
              </small>
            </div>
            <div className="p-1 flex gap-1 flex-col">
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
              <Skeleton className="w-full h-5 bg-slate-300 dark:bg-dark-TT3" />
            </div>
            <div className="pt-3 flex items-center">
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
          <FormPost value={userData} answer fetch={updateAnswers} />
          <Separator />
        </>
      )}
      {answ.map((item) => (
        <Post key={item.id_post} value={item} answer />
      ))}
    </>
  );
}
