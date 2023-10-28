import { Heart, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { UserPopularity } from '../../../context/AuthProvider/type';
import { Link } from 'react-router-dom';

type CardInfoBarProps = {
  avaliados?: boolean;
  info: UserPopularity;
};

export const CardInfoBar = (props: CardInfoBarProps) => {
  console.log(props);
  return (
    <Link
      to={`/user/${props.info.username}`}
      className="flex items-center justify-between gap-2 p-2"
    >
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={props.info.fotoPerfil} alt={props.info.username} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
            {props.info.username}
          </p>
          <p className="text-xs text-gray-500">
            {props.info.idade || props.info.idade} - {props.info.cidade}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {props.avaliados ? (
          <>
            <span className="flex items-center gap-2">
              <ThumbsUp className="w-4 text-secondary-50 " />{' '}
              <small className="text-zinc-800 dark:text-zinc-300">
                {props.info.numberOfLikes}
              </small>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <Heart className="w-4 text-red-500 " />{' '}
              <small className="text-zinc-800 dark:text-zinc-300">
                {props.info.numberOfLikes}
              </small>
            </span>
          </>
        )}
      </div>
    </Link>
  );
};
