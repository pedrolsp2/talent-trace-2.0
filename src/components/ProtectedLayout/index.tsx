import { useAuth } from "../../context/AuthProvider/useAuth";
import { MessageSingin } from "../MessageSingin";

export const ProtectedLayout = ({children}: { children: JSX.Element}) => {
  const auth = useAuth();

  if(!auth.email){
    return <MessageSingin/>
  }

  return children;

}