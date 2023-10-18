import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import {
  IInfoProfile,
  InfoUser,
  LikeProps,
  PostProps,
} from '../../context/AuthProvider/type';
import {
  fetchAlertLiked,
  fetchDataUsername,
  fetchPostUser,
  getInfoProfile,
} from '../../context/hooks/getData';

import {
  AlignCenter,
  Bell,
  BookDownIcon,
  ClipboardEdit,
  FileEdit,
  Footprints,
  Heart,
  Sticker,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Post } from '../../components/Post';
import { HoverCardLike } from '../../components/HoverCard';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/ui/accordion';
import { useQuery } from '@tanstack/react-query';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function User() {
  const [isMobile, setIsMobile] = useState(false);
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [likes, setLikes] = useState<LikeProps[]>([]);
  const stroage = getUserLocalStorage();
  const email = stroage[0];

  const fetchInfo = async (): Promise<IInfoProfile> => {
    const data = await getInfoProfile(userData?.id_user || 0);
    if (data) {
      const infoArray = data.map((item) => ({
        comunidades: item.comunidades || 0,
        likes: item.likes || 0,
        posts: item.posts || 0,
      }));
      const infoProfile = infoArray.reduce(
        (acc, item) => ({
          comunidades: acc.comunidades + item.comunidades,
          likes: acc.likes + item.likes,
          posts: acc.posts + item.posts,
        }),
        { comunidades: 0, likes: 0, posts: 0 }
      );

      return infoProfile;
    }
    return {
      comunidades: 0,
      likes: 0,
      posts: 0,
    };
  };

  const { data } = useQuery({
    queryKey: ['infoUser'],
    queryFn: fetchInfo,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataUsername(username || '');
      const dataLike = await fetchAlertLiked(data?.id_user || 0);
      setLikes((dataLike as LikeProps[]) || []);
      setUserData((data as InfoUser) || null);
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    fetchInfo();
    const handleResize = () => {
      setIsMobile(window.innerWidth > 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (userData?.id_user) {
        const dataPosts = await fetchPostUser(userData?.id_user);
        setPosts(dataPosts as PostProps[]);
      }
    };
    fetchPost();
  }, [userData]);

  if (!userData) {
    return <h1>Nenhum usuario encontrado</h1>;
  }

  return (
    <div>
      <div className="flex justify-between items-center self-stretch py-6 px-4 border-b border-b-[#dedede] dark:border-b-zinc-900 dark:bg-dark-TT">
        <div className="flex items-center gap-3">
          <Avatar className="w-20 h-20">
            <AvatarFallback>IMG</AvatarFallback>
            <AvatarImage src={userData?.fotoPerfil} />
          </Avatar>
          <div className="flex flex-col items-start gap-1 h-[4.75rem]">
            <div className="text-black dark:text-zinc-300 text-2xl font-bold leading-[normal]">
              {userData?.user}
            </div>
            <div className="text-[#878787] font-light leading-[normal]">
              {userData?.cref ? 'Olheiro' : 'Jogador'}
            </div>
          </div>
        </div>
        {userData?.email === email && (
          <Button className="flex justify-center items-center gap-2.5 py-2 px-3 rounded bg-primary-50 hover:bg-primary-40">
            <FileEdit size={24} color="#fff" />
            {isMobile && (
              <div className="text-white text-sm font-bold leading-[100%]">
                Editar Perfil
              </div>
            )}
          </Button>
        )}
      </div>
      {!isMobileDevice() ? (
        <>
          <div className="flex items-center gap-3 self-stretch py-4 px-3 border-b border-b-zinc-150 dark:border-b-zinc-900 dark:bg-dark-TT">
            <AlignCenter size={24} className="text-primary-50" />
            <div className="text-[#b3b3b3] dark:text-white text-base leading-[normal]">
              Atividades
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-10 self-stretch p-4 bg-zinc-100 dark:bg-zinc-900">
            <div className="flex justify-center items-center gap-2">
              <BookDownIcon size={20} className="text-primary-50" />
              <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                {userData.cref ? data?.comunidades : data?.posts}{' '}
                {userData?.cref ? 'novas comunidades' : 'posts novos'}
              </div>
            </div>

            <div className="flex justify-center items-center gap-2">
              <Heart size={20} className="text-primary-50" />
              <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                {data?.likes} likes recebidos
              </div>
            </div>

            <div className="flex justify-center items-center gap-2">
              <Footprints size={20} className="text-primary-50" />
              <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                4{' '}
                {userData?.cref ? 'peneiras criadas' : 'peneiras participadas'}
              </div>
            </div>
            {userData.cref && (
              <div className="flex justify-center items-center gap-2">
                <Sticker size={20} className="text-primary-50" />
                <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                  {data?.posts}{' '}
                  {userData?.cref ? 'posts enviados' : 'posts recebidos'}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="w-full py-1 px-3 border-b border-b-zinc-150 dark:border-b-zinc-900 dark:bg-dark-TT"
            >
              <AccordionTrigger>
                <div className="text-[#b3b3b3] dark:text-white text-base leading-[normal] flex gap-3">
                  <AlignCenter size={24} className="text-primary-50" />
                  Atividades
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap items-center gap-10 self-stretch p-4 bg-zinc-100 dark:bg-dark-TT">
                  <div className="flex justify-center items-center gap-2">
                    <BookDownIcon size={20} className="text-primary-50" />
                    <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                      {data?.posts}{' '}
                      {userData?.cref ? 'novas comunidades' : 'posts novos'}
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <Heart size={20} className="text-primary-50" />
                    <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                      {data?.likes} likes recebidos
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <Footprints size={20} className="text-primary-50" />
                    <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                      4{' '}
                      {userData?.cref
                        ? 'peneiras criadas'
                        : 'peneiras participadas'}
                    </div>
                  </div>
                  {userData.cref && (
                    <div className="flex justify-center items-center gap-2">
                      <Sticker size={20} className="text-primary-50" />
                      <div className="text-[#444] dark:text-zinc-400 text-base leading-[normal]">
                        {data?.posts}{' '}
                        {userData?.cref ? 'posts enviados' : 'posts recebidos'}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
      {userData?.email === email && (
        <>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="w-full py-1 px-3 border-b border-b-zinc-150 dark:border-b-zinc-900 dark:bg-dark-TT"
            >
              <AccordionTrigger>
                <div className="flex items-center gap-3 self-stretch py-4 px-3dark:bg-dark-TT relative">
                  <Bell size={24} className="text-primary-50" />
                  <div className="text-[#b3b3b3] dark:text-white text-base leading-[normal] ">
                    Notificações
                  </div>
                  {likes && (
                    <div className="w-2 h-2 rounded-full bg-secondary-30"></div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {userData?.email === email &&
                  likes &&
                  likes.map((item) => (
                    <HoverCardLike key={item.content_post} value={item} />
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}

      <div className="flex items-center gap-3 self-stretch py-4 px-3 border-y border-y-zinc-150 dark:border-y-zinc-900 dark:bg-dark-TT">
        <ClipboardEdit size={24} className="text-primary-50" />
        <div className="text-[#b3b3b3] dark:text-white text-base leading-[normal] ">
          Últimos posts
        </div>
      </div>
      {posts ? (
        posts.map((item) => (
          <div key={item.id_post}>
            <Post value={item} />
          </div>
        ))
      ) : (
        <span>Sem publicações.</span>
      )}
    </div>
  );
}
