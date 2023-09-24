import axios from "axios";
import { IChat, IMessage, PostProps } from "../AuthProvider/type";

export const fetchDataPost = async () => {
  try {
    const response = await axios.get<PostProps[]>('http://localhost:8800/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

export const fetchPost = async (id: number) => {
  try {
    const response = await axios.post<PostProps[]>('http://localhost:8800/view-post',{
      id
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

export const fetchAnswers = async (id: number) => {
  try {
    const response = await axios.post<PostProps[]>('http://localhost:8800/answers',{
      id
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

export const fetchDataUser = async (email: string) => {
  try {
    const response = await axios.post('http://localhost:8800/user/', {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

export const fetchNewPost = async (id_user: number, content: string) => {
  try {
    const response = await axios.post('http://localhost:8800/newPost/', {
      id_user: id_user,
      content: content
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    return null;
  }
};

export const fetchNewMessage = async (id_chat: number, content: string, data_message: string, id_user_friend:number) => {
  try {
    const response = await axios.post('http://localhost:8800/newMessage/', {
      id_chat: id_chat,
      content: content,
      data_message: data_message,
      id_user_friend: id_user_friend,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    return null;
  }
}

export const fetchNewAnswers = async (id_user: number, content: string, id_post: number) => {
  try {
    const response = await axios.post('http://localhost:8800/newAnswers', {
      id_user: id_user,
      content: content,
      id_post: id_post,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    return null;
  }
}

export const fetchDeletePost = async (id_post: number) => {
  try {
    const response = await axios.delete(`http://localhost:8800/post/${id_post}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir dados:', error);
    return null;
  }
}

export const fetchChat = async (id_user: number) => {
  try {
    const response = await axios.post<IChat[]>('http://localhost:8800/chat',{
      id_user
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
}

export const fetchMessage = async (id_user_sender: number, id_user_receiver: number) => {
  try {
    const response = await axios.post<IMessage[]>('http://localhost:8800/message',{
      id_user_sender: id_user_sender,
      id_user_receiver: id_user_receiver
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
}
