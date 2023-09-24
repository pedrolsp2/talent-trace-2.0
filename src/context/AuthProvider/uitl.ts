import { Api } from "../../services/api";
import { IUser } from "./type";

export function setUserLocalStorage (user: IUser | null) {
  localStorage.setItem('u', JSON.stringify(user))
}

export function getUserLocalStorage () {
  const json = localStorage.getItem('u')

  if(!json){
    return null;
  }

  const user = JSON.parse(json)
  return user ?? null;
}

export async function LoginRequeste (email: string, password: string){
  try{
    const res = await Api.post('login',{email, password});
    return res.data;

  } catch (error){
    return null;
  }
}
