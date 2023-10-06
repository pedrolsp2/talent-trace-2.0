import { InfoUser, PostProps } from "../AuthProvider/type"
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

export const fetchPostUser = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection("post")
    .where("id_user", "==", id)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data())
  } else {
    return []
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

export const fetchDataUsername = async (username: string) => {
  const userDoc = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs[0].data()
  } else {
    console.error("Erro ao buscar dados:")
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
        cref: value.cref || null,
        dataPost: data,
        username: value.username,
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
  const id = Math.floor(Math.random() * 10000)
  const data = new Date()
  try {
    await firebase
      .firestore()
      .collection("answers")
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
      })

    const userDoc = await firebase
      .firestore()
      .collection("post")
      .where("id_post", "==", post.id_post)
      .limit(1) // Fetch only one matching document, since we expect only one match
      .get()

    if (!userDoc.empty) {
      const doc = userDoc.docs[0]
      const id = doc.id
      const data = doc.data()

      await firebase
        .firestore()
        .collection("post")
        .doc(id)
        .update({
          n_comement: firebase.firestore.FieldValue.increment(1),
        })
      console.log(data.n_comement)
    } else {
      console.log("vazio")
    }

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
  const postRef = firebase.firestore().collection("post")
  const postSnapshot = await postRef.where("id_post", "==", id_post).get()

  postSnapshot.forEach((documentSnapshot) => {
    documentSnapshot.ref
      .delete()
      .then(() => {
        console.log("Documento deletado com sucesso em 'post'!")
      })
      .catch((error) => {
        console.error("Erro ao deletar documento em 'post': ", error)
      })
  })
}

export const fetchDeleteAnswer = async (id_answers: number) => {
  const postRef = firebase.firestore().collection("answers")
  const postSnapshot = await postRef.where("id_answers", "==", id_answers).get()

  postSnapshot.forEach((documentSnapshot) => {
    documentSnapshot.ref
      .delete()
      .then(() => {
        console.log("Documento deletado com sucesso em 'post'!")
      })
      .catch((error) => {
        console.error("Erro ao deletar documento em 'post': ", error)
      })
  })
}

export const fetchLike = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection("liked")
    .where("id_user", "==", id)
    .get()
  if (!userDoc.empty) {
    return userDoc.docs.map((doc) => doc.data())
  } else {
    return []
  }
}

export const fetchCountLike = async (id: number) => {
  const userDoc = await firebase
    .firestore()
    .collection("liked")
    .where("id_post", "==", id)
    .get()
  if (!userDoc.empty) {
    const doc = userDoc.docs.map((doc) => doc.data())
    console.log(doc.length)
    return doc.length
  } else {
    return 0
  }
}
