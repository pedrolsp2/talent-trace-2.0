import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Smile, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { LikeProps } from '../../context/AuthProvider/type';

interface value {
  value: LikeProps;
}

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function HoverCardLike(item: value) {
  return (
    <HoverCard>
      <div className="flex flex-col gap-2 p-4 bg-[#fafafa] relative dark:bg-dark-TT">
        <Alert className="border border-primary-50 bg-[#fff] max-w-xl dark:bg-dark-TT2">
          <Smile className="h-4 w-4" color="#290398" />
          <AlertTitle className="dark:text-zinc-50">
            Você recebeu uma curtida!
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span className="text-secondary-60 dark:text-zinc-400">
              {item.value.cref ? 'O olheiro ' : 'O jogador '}
              <HoverCardTrigger>
                {' '}
                <span className="text-zinc-50 font-bold cursor-pointer">
                  {item.value.username}{' '}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white flex gap-2">
                <Avatar>
                  <AvatarFallback>FT</AvatarFallback>
                  <AvatarImage src={item.value.fotoUser} />
                </Avatar>
                <span className="flex flex-col">
                  <span className="font-bold">{item.value.username}</span>
                  <Link to={`/user/${item.value.username}`}>
                    <small>Ver perfil</small>
                  </Link>
                </span>
              </HoverCardContent>
              curtiu seu post!
            </span>
            <Trash className="text-secondary-50 w-4 h-4 mt-[-15px] cursor-pointer" />
            {item.value.image && !isMobileDevice() && (
              <img
                src={item.value.image}
                alt="Foto do post"
                className="w-6 absolute right-12 top-6 rounded-[2px]"
              />
            )}
          </AlertDescription>
        </Alert>
      </div>
    </HoverCard>
  );
}
