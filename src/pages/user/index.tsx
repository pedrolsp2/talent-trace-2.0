import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import {
  InfoUser,
  LikeProps,
  PostProps,
} from '../../context/AuthProvider/type';
import {
  fetchAlertLiked,
  fetchDataUsername,
  fetchPostUser,
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

export function User() {
  const [isMobile, setIsMobile] = useState(false);
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [likes, setLikes] = useState<LikeProps[]>([]);
  const data = getUserLocalStorage();
  const email = data[0];

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
      <div className="flex justify-between items-center self-stretch py-6 px-4 border-b border-b-[#dedede]">
        <div className="flex items-center gap-3">
          <Avatar className="w-20 h-20">
            <AvatarFallback>IMG</AvatarFallback>
            <AvatarImage src={userData?.fotoPerfil} />
          </Avatar>
          <div className="flex flex-col items-start gap-1 h-[4.75rem]">
            <div className="text-black text-2xl font-bold leading-[normal]">
              {userData?.user}
            </div>
            <div className="text-[#878787] font-semibold leading-[normal]">
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
      <div className="flex items-center gap-3 self-stretch py-4 px-3 border-b border-b-zinc-150">
        <AlignCenter size={24} className="text-primary-50" />
        <div className="text-[#b3b3b3] text-base leading-[normal]">
          Atividades
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-10 self-stretch p-4 bg-zinc-100">
        <div className="flex justify-center items-center gap-2">
          <BookDownIcon size={20} className="text-primary-50" />
          <div className="text-[#444] text-base leading-[normal]">
            4 {userData?.cref ? 'novas comunidades' : 'posts novos'}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Heart size={20} className="text-primary-50" />
          <div className="text-[#444] text-base leading-[normal]">
            50 likes recebidos
          </div>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Footprints size={20} className="text-primary-50" />
          <div className="text-[#444] text-base leading-[normal]">
            4 {userData?.cref ? 'peneiras criadas' : 'peneiras participadas'}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Sticker size={20} className="text-primary-50" />
          <div className="text-[#444] text-base leading-[normal]">
            6 {userData?.cref ? 'feedbacks enviados' : 'feedbacks recebidos'}
          </div>
        </div>
      </div>
      {userData?.email === email && (
        <div className="flex items-center gap-3 self-stretch py-4 px-3 border-y border-y-zinc-150">
          <Bell size={24} className="text-primary-50" />
          <div className="text-[#b3b3b3] text-base leading-[normal] ">
            Notificações
          </div>
        </div>
      )}

      {userData?.email === email &&
        likes &&
        likes.map((item) => (
          <HoverCardLike key={item.content_post} value={item} />
        ))}

      <div className="flex items-center gap-3 self-stretch py-4 px-3 border-y border-y-zinc-150">
        <ClipboardEdit size={24} className="text-primary-50" />
        <div className="text-[#b3b3b3] text-base leading-[normal] ">
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
