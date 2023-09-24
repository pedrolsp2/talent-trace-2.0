import { useEffect, useState } from "react";
import { getUserLocalStorage } from "../../context/AuthProvider/uitl";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { InfoUser } from "../../context/AuthProvider/type";
import { fetchDataUser } from "../../context/hooks/getData";

interface IAvatar{
  size?: number;
}

export function AvatarUser(props: IAvatar){
  const {email} = getUserLocalStorage();
  const [user, setUser] = useState<InfoUser | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataUser(email);
      if (data) {
        setUser(data);
      }
    };
    fetchData();
  }, [email]);
  
  return(
    <Avatar className={props.size? `w-${props.size} h-${props.size}` : 'w-12 h-12'}>
      <AvatarFallback><Skeleton className="w-10 h-10 rounded-full bg-secondary-40"/></AvatarFallback>
      <AvatarImage src={user?.u_foto} alt="Pedro Lucas"/>
    </Avatar>
  )
}