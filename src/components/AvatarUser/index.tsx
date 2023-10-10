import { useEffect, useState } from 'react';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { InfoUser } from '../../context/AuthProvider/type';
import { fetchDataUser } from '../../context/hooks/getData';
import { useNavigate } from 'react-router-dom';

interface IAvatar {
  size?: number;
}

export function AvatarUser(props: IAvatar) {
  const data = getUserLocalStorage();
  const email = data[0];
  const [user, setUser] = useState<InfoUser | null>(null);
  const [isOlheiro, setIsOlheiro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataUser(email);
      if (data) {
        if (data.cref) {
          setIsOlheiro(true);
        }
        setUser(data as InfoUser);
      } else {
        setUser(null);
      }
    };
    fetchData();
  }, [email]);

  return (
    <Avatar
      onClick={() => navigate(`/user/${user?.username}`)}
      className={`${
        props.size ? `w-${props.size} h-${props.size}` : 'w-12 h-12'
      } ${isOlheiro && 'border border-primary-50'}`}
    >
      <AvatarFallback>
        <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
      </AvatarFallback>
      <AvatarImage src={user?.fotoPerfil} alt="Pedro Lucas" />
    </Avatar>
  );
}
