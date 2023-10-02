import axios from "axios"
import { IChat, IMessage, InfoUser, PostProps } from "../AuthProvider/type"
import firebase from "../../../src/services/firebase/config"
import { toast } from "../../components/ui/use-toast"

export const fetchDataPost = async () => {
  const postsCollection = await firebase.firestore().collection("post").get()

  if (!postsCollection.empty) {
    return postsCollection.docs.map((doc) => doc.data())
  } else {
    console.error("Erro ao buscar dados.")
    return []
  }
}

export const fetchPost = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection("post")
    .where("id_post", "==", id)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs[0].data()
  } else {
    return null
  }
}

export const fetchAnswers = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection("answers")
    .where("id_post", "==", id)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data())
  } else {
    console.error("Erro ao buscar dados.")
    return []
  }
}

export const fetchDataUser = async (email: string) => {
  const userDoc = await firebase
    .firestore()
    .collection("users")
    .where("email", "==", email)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs[0].data()
  } else {
    console.error("Erro ao inserir dados:")
    return null
  }
}

export const fetchNewPost = async (
  value: InfoUser,
  content: string,
  image?: string
) => {
  const id = Math.floor(Math.random() * 10000)
  const data = new Date()
  try {
    await firebase
      .firestore()
      .collection("post")
      .add({
        content: content,
        email_user: value.email,
        foto_user: value.fotoPerfil,
        id_post: id,
        id_user: value.id_user,
        n_comement: 0,
        n_likes: 0,
        nome_user: value.user,
        cref: value.cref,
        dataPost: data,
        image: image || null,
      })
    toast({
      variant: "default",
      title: "Sucesso!",
      description: "Dados inseridos com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao inserir os dados:", error)
    toast({
      variant: "destructive",
      title: "Erro!",
      description: "Erro ao inserir os dados. Por favor, tente novamente.",
    })
  }
}

export const fetchNewAnswers = async (
  value: InfoUser,
  content: string,
  post: PostProps,
  image?: string
) => {
  try {
    await firebase
      .firestore()
      .collection("answers")
      .add({
        content: content,
        email_user: value.email,
        foto_user: value.fotoPerfil,
        id_post: post.id_post,
        id_user: value.id_user,
        n_comement: post.n_comement,
        n_likes: post.n_likes,
        nome_user: value.user,
        cref: value.cref,
        image: image || null,
      })
    toast({
      variant: "default",
      title: "Sucesso!",
      description: "Dados inseridos com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao inserir os dados:", error)
    toast({
      variant: "destructive",
      title: "Erro!",
      description: "Erro ao inserir os dados. Por favor, tente novamente.",
    })
  }
}

export const fetchDeletePost = async (id_post: number) => {
  await firebase
    .firestore()
    .collection("post")
    .where("id_post", "==", id_post)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        documentSnapshot.ref
          .delete()
          .then(() => {
            console.log("Documento deletado com sucesso!")
          })
          .catch((error) => {
            console.error("Erro ao deletar documento: ", error)
          })
      })
    })
    .catch((error) => {
      console.error("Erro ao buscar documento: ", error)
    })
}

export const fetchNewMessage = async (
  id_chat: number,
  content: string,
  data_message: string,
  id_user_friend: number
) => {
  try {
    const response = await axios.post("http://localhost:8800/newMessage/", {
      id_chat: id_chat,
      content: content,
      data_message: data_message,
      id_user_friend: id_user_friend,
    })
    return response.data
  } catch (error) {
    console.error("Erro ao inserir dados:", error)
    return null
  }
}

export const fetchChat = async (id_user: number) => {
  try {
    const response = await axios.post<IChat[]>("http://localhost:8800/chat", {
      id_user,
    })
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return null
  }
}

export const fetchMessage = async (
  id_user_sender: number,
  id_user_receiver: number
) => {
  try {
    const response = await axios.post<IMessage[]>(
      "http://localhost:8800/message",
      {
        id_user_sender: id_user_sender,
        id_user_receiver: id_user_receiver,
      }
    )
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return null
  }
}
