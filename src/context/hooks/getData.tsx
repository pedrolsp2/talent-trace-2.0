import {
  ComunidadeProps,
  ContentComunidade,
  InfoUser,
  LikeProps,
  PostProps,
  UserPopularity,
} from '../AuthProvider/type';
import firebase from '../../../src/services/firebase/config';
import { toast } from '../../components/ui/use-toast';
import { ToastAction } from '../../components/ui/toast';

export const fetchDataPost = async () => {
  const postsCollection = await firebase.firestore().collection('post').get();

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data());
  } else {
    console.error('Erro ao buscar dados.');
    return [];
  }
};

export const fetchPost = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('post')
    .where('id_post', '==', id)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs[0].data();
  } else {
    return null;
  }
};

export const fetchPostUser = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('post')
    .where('id_user', '==', id)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data());
  } else {
    return [];
  }
};

export const fetchAnswers = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('answers')
    .where('id_post', '==', id)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data());
  } else {
    console.error('Erro ao buscar dados.');
    return [];
  }
};

export const fetchDataUser = async (email: string) => {
  const userDoc = await firebase
    .firestore()
    .collection('users')
    .where('email', '==', email)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs[0].data();
  } else {
    console.error('Erro ao inserir dados:');
    return null;
  }
};

export const fetchDataUsername = async (username: string) => {
  const userDoc = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs[0].data();
  } else {
    console.error('Erro ao buscar dados:');
    return null;
  }
};

export const fetchNewPost = async (
  value: InfoUser,
  content: string,
  image?: string
) => {
  const id = Math.floor(Math.random() * 10000);
  const data = new Date();
  try {
    await firebase
      .firestore()
      .collection('post')
      .add({
        content: content,
        email_user: value.email,
        foto_user: value.fotoPerfil,
        id_post: id,
        id_user: value.id_user,
        n_comement: 0,
        n_likes: 0,
        nome_user: value.user,
        cref: value.cref || null,
        dataPost: data,
        username: value.username,
        image: image || null,
      });
    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Dados inseridos com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao inserir os dados. Por favor, tente novamente.',
    });
  }
};

export const fetchNewAnswers = async (
  value: InfoUser,
  content: string,
  post: PostProps,
  image?: string
) => {
  const id = Math.floor(Math.random() * 10000);
  const data = new Date();
  try {
    await firebase
      .firestore()
      .collection('answers')
      .add({
        id_answers: id,
        content: content,
        email_user: value.email,
        username: value.username,
        foto_user: value.fotoPerfil,
        id_post: post.id_post,
        id_user: value.id_user,
        n_comement: post.n_comement,
        n_likes: post.n_likes,
        nome_user: value.user,
        dataPost: data,
        cref: value.cref || null,
        image: image || null,
      });

    const userDoc = await firebase
      .firestore()
      .collection('post')
      .where('id_post', '==', post.id_post)
      .limit(1) // Fetch only one matching document, since we expect only one match
      .get();

    if (!userDoc.empty) {
      const doc = userDoc.docs[0];
      const id = doc.id;
      const data = doc.data();

      await firebase
        .firestore()
        .collection('post')
        .doc(id)
        .update({
          n_comement: firebase.firestore.FieldValue.increment(1),
        });
      console.log(data.n_comement);
    } else {
      console.log('vazio');
    }

    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Dados inseridos com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao inserir os dados. Por favor, tente novamente.',
    });
  }
};

export const fetchDeletePost = async (id_post: number) => {
  const postRef = firebase.firestore().collection('post');
  const postSnapshot = await postRef.where('id_post', '==', id_post).get();

  postSnapshot.forEach((documentSnapshot) => {
    documentSnapshot.ref
      .delete()
      .then(() => {
        console.log("Documento deletado com sucesso em 'post'!");
      })
      .catch((error) => {
        console.error("Erro ao deletar documento em 'post': ", error);
      });
  });
};

export const fetchDeleteAnswer = async (id_answers: number) => {
  const postRef = firebase.firestore().collection('answers');
  const postSnapshot = await postRef
    .where('id_answers', '==', id_answers)
    .get();

  postSnapshot.forEach((documentSnapshot) => {
    documentSnapshot.ref
      .delete()
      .then(() => {
        console.log("Documento deletado com sucesso em 'post'!");
      })
      .catch((error) => {
        console.error("Erro ao deletar documento em 'post': ", error);
      });
  });
};

export const fetchLike = async (id_user: number, id_post: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('liked')
    .where('id_user', '==', id_user)
    .where('id_post', '==', id_post)
    .get();
  if (!userDoc.empty) {
    return true;
  } else {
    return false;
  }
};

export const fetchDeleteLike = async (id_post: number, id_user: number) => {
  const postRef = firebase.firestore().collection('liked');
  const postSnapshot = await postRef
    .where('id_user', '==', id_user)
    .where('id_post', '==', id_post)
    .get();

  postSnapshot.forEach((documentSnapshot) => {
    documentSnapshot.ref
      .delete()
      .then(() => {
        console.log("Documento deletado com sucesso em 'post'!");
      })
      .catch((error) => {
        console.error("Erro ao deletar documento em 'post': ", error);
      });
  });
};

export const fetchCountLike = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('liked')
    .where('id_post', '==', id)
    .get();
  if (!userDoc.empty) {
    const doc = userDoc.docs.map((doc) => doc.data());
    console.log(doc.length);
    return doc.length;
  } else {
    return 0;
  }
};

export const fetchAlertLiked = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('alertLike')
    .where('id_user', '==', id)
    .get();
  if (!userDoc.empty) {
    console.log(userDoc.docs.map((doc) => doc.data()));
    return userDoc.docs.map((doc) => doc.data());
  } else {
    return [];
  }
};

export const handleLike = async (
  value: LikeProps,
  id: number,
  id_user: number,
  id_user_revice: number
) => {
  try {
    await firebase
      .firestore()
      .collection('alertLike')
      .add({
        content_post: value.content_post,
        cref: value.cref || '',
        fotoUser: value.fotoUser,
        id_sendLike: value.id_sendLike,
        id_user: value.id_user,
        image: value.image || '',
        nomeUser: value.nomeUser,
        username: value.username,
      });
    await firebase.firestore().collection('liked').add({
      id_user: id_user,
      id_post: id,
      id_revice: id_user_revice,
    });
    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Você deu like!',
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao inserir os dados. Por favor, tente novamente.',
    });
  }
};

export const fetchComunidade = async () => {
  const postsCollection = await firebase
    .firestore()
    .collection('comunidade')
    .get();

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data());
  } else {
    console.error('Erro ao buscar dados.');
    return [];
  }
};

export const handleNewComunidade = async (value: ComunidadeProps) => {
  try {
    await firebase.firestore().collection('comunidade').add({
      banner: value.banner,
      fotoOlheiro: value.fotoOlheiro,
      descricao: value.descricao,
      nome: value.nome,
      nameURL: value.nameURL,
      tipo: value.tipo,
      id_comunidade: value.id_comunidade,
      id_olheiro: value.id_olheiro,
      dataCriacao: value.dataCriacao,
    });
    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Comunidade criada com sucesso!',
      action: (
        <ToastAction altText="Ver a comunidade criada">
          <a href={`/comunidade/${value.nameURL}`}>Ver</a>
        </ToastAction>
      ),
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao inserir os dados. Por favor, tente novamente.',
    });
  }
};

export const fetchComunidadeName = async (name: string) => {
  const userDoc = await firebase
    .firestore()
    .collection('comunidade')
    .where('nameURL', '==', name)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs[0].data();
  } else {
    return null;
  }
};

export const fetchComunidadeNames = async (name: string) => {
  const userDocs = await firebase
    .firestore()
    .collection('comunidade')
    .where('nome', '>=', name)
    .where('nome', '<=', name + '\uf8ff')
    .get();

  const results: Array<ComunidadeProps> = [];
  userDocs.forEach((doc) => {
    results.push(doc.data() as ComunidadeProps);
  });

  return results;
};

export const fetchUserComunidade = async (
  name: string,
  id: number
): Promise<boolean> => {
  const userDoc = await firebase
    .firestore()
    .collection('userComunidade')
    .where('nameURL', '==', name)
    .where('id_user', '==', id)
    .get();

  return !userDoc.empty;
};

export const fetchContentComundiade = async (name: string) => {
  const postsCollection = await firebase
    .firestore()
    .collection('contentComunidade')
    .where('nameURL', '==', name)
    .get();

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data());
  } else {
    console.error('Erro ao buscar dados.');
    return [];
  }
};

export const handleNewContentComundiade = async (value: ContentComunidade) => {
  try {
    await firebase.firestore().collection('contentComunidade').add({
      nameURL: value.nameURL,
      conteudo: value.conteudo,
      titulo: value.titulo,
      tipo: value.tipo,
      nomeOlheiro: value.nomeOlheiro,
      fotoOlheiro: value.fotoOlheiro,
      img: value.img,
    });
    toast({
      variant: 'default',
      title: 'Sucesso!',
      description: 'Dados inseridos com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao inserir os dados. Por favor, tente novamente.',
    });
  }
};

export const userNewComunidade = async (
  id_user: number,
  nameURL: string,
  type: string,
  nome: string
) => {
  try {
    await firebase.firestore().collection('userComunidade').add({
      id_user: id_user,
      nameURL: nameURL,
      tipo: type,
      nome: nome,
    });
  } catch (error) {
    console.error('Erro ao inserir os dados:', error);
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao entrar. Por favor, tente novamente.',
    });
  }
};

export const countUserComunidade = async (nameURL: string) => {
  const postsCollection = await firebase
    .firestore()
    .collection('userComunidade')
    .where('nameURL', '==', nameURL)
    .get();

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data()).length;
  } else {
    console.error('Erro ao buscar dados.');
    return 0;
  }
};

export const getInfoProfile = async (id_user: number) => {
  const array = [];

  const comDoc = await firebase
    .firestore()
    .collection('comunidade')
    .where('id_olheiro', '==', id_user)
    .get();
  if (!comDoc.empty) {
    const value = comDoc.docs.map((doc) => doc.data()).length;
    array.push({
      comunidades: value,
    });
  } else {
    array.push({
      comunidades: 0,
    });
  }

  const likesDoc = await firebase
    .firestore()
    .collection('liked')
    .where('id_revice', '==', id_user)
    .get();
  if (!likesDoc.empty) {
    const value = likesDoc.docs.map((doc) => doc.data()).length;
    array.push({
      likes: value,
    });
  } else {
    array.push({
      likes: 0,
    });
  }

  const postDocs = await firebase
    .firestore()
    .collection('post')
    .where('id_user', '==', id_user)
    .get();
  if (!postDocs.empty) {
    const value = postDocs.docs.map((doc) => doc.data()).length;
    array.push({
      posts: value,
    });
  } else {
    array.push({
      posts: 0,
    });
  }

  return array;
};

export const fetchPeneiras = async () => {
  const postsCollection = await firebase
    .firestore()
    .collection('listPeneira')
    .get();

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data());
  } else {
    console.error('Erro ao buscar dados.');
    return [];
  }
};

export const fetchMyCom = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('userComunidade')
    .where('id_user', '==', id)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data());
  } else {
    return [];
  }
};

export const fetchPeneira = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection('listPeneira')
    .where('id_peneira', '==', id)
    .get();
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data());
  } else {
    return [];
  }
};

export const fetchUserPopularityData = async () => {
  try {
    const usersCollection = firebase
      .firestore()
      .collection('users')
      .where('altura', '!=', '');
    const userSnapshots = await usersCollection.get();

    const userPopularityData: UserPopularity[] = [];

    // Usar `map` para criar um array de Promises
    const promises = userSnapshots.docs.map(async (doc) => {
      const userData = doc.data();

      const likesSnapshot = await firebase
        .firestore()
        .collection('liked')
        .where('id_revice', '==', userData.id_user)
        .get();
      const likesData = likesSnapshot.docs.map((doc) => doc.data());

      const numberOfLikes = likesData.length;

      const userPopularity: UserPopularity = {
        id_user: userData.id_user,
        idade: userData.idade,
        cidade: userData.cidade,
        username: userData.username,
        fotoPerfil: userData.fotoPerfil,
        numberOfLikes,
      };

      userPopularityData.push(userPopularity);
    });
    await Promise.all(promises);
    return userPopularityData;
  } catch (error) {
    throw new Error('Erro ao buscar os dados de popularidade dos usuários');
  }
};
