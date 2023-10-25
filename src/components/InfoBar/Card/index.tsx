import { Heart, MessageCircle, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

export const CardInfoBar = ({ avaliados }: { avaliados?: boolean }) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            alt="avatar"
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
            John Doe
          </p>
          <p className="text-xs text-gray-500">XXXXXXXXXXXX</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {avaliados ? (
          <>
            <span className="flex items-center gap-2">
              <ThumbsUp className="w-4 text-secondary-50 " />{' '}
              <small className="text-zinc-800 dark:text-zinc-300">32</small>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <Heart className="w-4 text-red-500 " />{' '}
              <small className="text-zinc-800 dark:text-zinc-300">32</small>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 text-primary-50" />{' '}
              <small className="text-zinc-800 dark:text-zinc-300">32</small>
            </span>
          </>
        )}
      </div>
    </div>
  );
};
