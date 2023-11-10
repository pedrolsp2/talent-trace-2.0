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

export interface UserInfo {
  id_user: number;
  idade?: string;
  email: string;
  fotoPerfil: string;
  cidade?: string;
  username: string;
  cpf?: string;
  cref?: string;
  dataNascimento?: string;
  peso?: string;
  estado?: string;
  perna?: string;
  altura?: string;
}

export interface ILike {
  id_post: number;
  id_revice: number;
  id_user: number;
}

export interface UserPopularity {
  id_user: number;
  idade: string | undefined;
  cidade: string | undefined;
  username: string;
  fotoPerfil: string;
  numberOfLikes: number;
}

export interface IPost {
  value: PostProps;
  answer?: boolean;
  fetch?: () => void;
  liked?: boolean | undefined;
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
  id_olheiro: number;
  nome: string;
  tipo: 'Peneiras' | 'Curiosidades' | 'Treinos';
  dataCriacao: Date;
  nameURL: string;
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

export interface ContentComunidade {
  id_content: number;
  nameURL: string;
  conteudo: string;
  titulo: string;
  tipo: 'Peneiras' | 'Curiosidades' | 'Treinos';
  nomeOlheiro: string;
  fotoOlheiro: string;
  img?: string;
  n_comement: number;
}

export interface IConent {
  nameURL: string;
  img: string;
  id_content: number;
  tipo: 'Peneiras' | 'Curiosidades' | 'Treinos';
  nomeOlheiro: string;
  conteudo: string;
  titulo: string;
  fotoOlheiro: string;
}

export interface IPeneira {
  descricaoPeneira: string;
  idadeMinima: number;
  nomePeneira: string;
  tipoDesejo: string;
  fotoOlheiro: string;
  id_peneira: number;
  nomeLocal: string;
  dataPeneira: Date;
  cidade: string;
  local: string;
  idadeMaxima: number;
  nomeOlheiro: string;
  dataCriação: Date;
  obs: string;
  banner: string;
}

export interface IInfoProfile {
  comunidades: number;
  likes: number;
  posts: number;
}

export interface IContext extends IUser {
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}
