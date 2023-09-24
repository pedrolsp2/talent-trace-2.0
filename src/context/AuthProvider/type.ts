export interface IUser {
  email?: string;
  token?: string;
}

export interface InfoUser{
  id_user: number
  u_name: string 
  u_user: string 
  u_foto: string
}

export interface IPost{
  value: PostProps;
  answer?: boolean;
}

export interface PostProps{
  id_post: number;
  u_foto: string;
  u_name: string;
  u_user: string;
  u_email: string;
  content: string;
  number_comment?: number;
  number_reply?: number;
  number_likes: number;
  id_answers?: number;
}

export interface IChat {
  id_chat: number;
  id_user_receiver:  number;
  Nome: string; 
  Foto: string;
  Mensagem: string;
}

export interface IMessage {
  id_chat: number;
  id_user_sender: number;
  data_envio: Date;
  Mensagem: string;
  NomeSender: string;
  FotoSender: string;
}

export interface IContext extends IUser {
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}