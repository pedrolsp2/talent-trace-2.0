import { fetchLike } from '../context/hooks/getData';
import firebase from '../services/firebase/config';

export const getLogin = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email or password is not provided.');
  }
  try {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    const usuarios = [];

    snapshot.forEach((doc) => {
      usuarios.push(doc.data());
    });

    if (usuarios.length === 0) {
      throw new Error('Erro ao processar os dados do usuário.');
    }

    const token = Math.random().toString(36).substring(2);
    return [{ email: email, token: token }];
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    throw error;
  }
};

export const setLocalStorage = async (email: string, token: string) => {
  const user = [email, token];
  localStorage.setItem('u', JSON.stringify(user));
};

export async function checkLikedStatus(
  id_user: number,
  id_post: number
): Promise<boolean | undefined> {
  const like = await fetchLike(id_user, id_post);
  return like;
}
