import { useEffect, useState } from "react"
import { Separator } from "../../components/Separator"
import { FormPost } from "../../components/FormPost"
import { Post } from "../../components/Post"
import { fetchDataPost, fetchDataUser } from "../../context/hooks/getData"
import { InfoUser, PostProps } from "../../context/AuthProvider/type"
import { getUserLocalStorage } from "../../context/AuthProvider/uitl"

export default function Home() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [userData, setUserData] = useState<InfoUser | null>(null)
  const { email } = getUserLocalStorage()

  const fetchData = async () => {
    try {
      const postData = await fetchDataPost()
      if (postData) {
        setPosts(postData)
      }

      const userData = await fetchDataUser(email)
      if (userData && userData.id_user) {
        setUserData(userData)
      } else {
        console.error(
          "Propriedade id_user não encontrada nos dados do usuário."
        )
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
    }
  }

  useEffect(() => {
    fetchData()
    const newTitle = "Talent Trace | Início"
    document.title = newTitle
  }, [])

  return (
    <>
      <FormPost value={userData} fetch={fetchData} />
      <Separator />
      <div className="divide-y divide-slate-200 dark:divide-zinc-900">
        {posts.map((item) => (
          <div key={item.id_post}>
            <Post value={item} />
          </div>
        ))}
      </div>
    </>
  )
}
