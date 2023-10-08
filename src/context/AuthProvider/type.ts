export interface IUser {
  email?: string;
  token?: string;
}

export interface InfoUser {
  id_user: number;
  idade?: string;
  email: string;
  fotoPerfil: string;
  fotoCapa: string;
  estado?: string;
  user: string;
  perna?: string;
  peso?: string;
  cidade?: string;
  posicao?: string;
  password: string;
  altura?: string;
  cpf?: string;
  cref?: string;
  dataNascimento?: string;
  username: string;
}

export interface IPost {
  value: PostProps;
  answer?: boolean;
  fetch?: () => void;
}

export interface PostProps {
  foto_user: string;
  nome_user: string;
  email_user: string;
  id_post: number;
  id_answers?: number;
  id_user: number;
  content: string;
  n_likes?: number;
  n_comement?: number;
  cref?: number;
  image?: string;
  dataPost?: string;
  username: string;
}
export interface LikeProps {
  id_sendLike: number;
  id_user: number;
  image?: string;
  cref?: string;
  nomeUser: string;
  fotoUser: string;
  content_post: string;
  username: string;
}

export interface ComunidadeProps {
  banner: string;
  fotoOlheiro: string;
  descricao: string;
  id_comunidade: number;
  nome: string;
  tipo: 'Peneira' | 'Curiosidades' | 'Treinos';
}

export interface IChat {
  id_chat: number;
  id_user_receiver: number;
  Nome: string;
  Foto: string;
  Mensagem: string;
}

export interface IMessage {
  id_chat: number;
  id_user_sender: number;
  id_user_friend?: number;
  data_envio: Date;
  Mensagem: string;
  NomeSender: string;
  FotoSender: string;
  content?: string;
}

export interface IContext extends IUser {
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}
