import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { AvatarUser } from "../AvatarUser"
import { useToast } from "../ui/use-toast"
import {
  fetchNewPost,
  fetchNewAnswers,
  fetchPost,
} from "../../context/hooks/getData"
import { InfoUser, PostProps } from "../../context/AuthProvider/type"
import { useParams } from "react-router-dom"
import { Image } from "lucide-react"
import { firebase as fb } from "../../services/firebase/firebasestorageconfig"

type IForm = {
  value: InfoUser | null
  answer?: boolean
  fetch?: () => void
}

export function FormPost(props: IForm) {
  const { toast } = useToast()
  const [post, setPost] = useState<PostProps | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [newContent, setNewContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [caracter, setCaracter] = useState(255)
  const { id } = useParams<{ id: string }>()

  function handleNewContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const content = e.target.value
    setNewContent(content)

    const lengthCount = content.length
    setCaracter(255 - lengthCount)
  }

  const fetchData = async () => {
    try {
      const postData = await fetchPost(Number(id))
      if (postData) {
        setPost(postData as PostProps)
      } else {
        setPost(null)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const uploadImageToFirebase = async (
    file: File,
    folder: string
  ): Promise<{ url: string; name: string }> => {
    // Gerar um nome aleatório para o arquivo
    const randomFileName =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      "_" +
      file.name
    const fileRef = fb.storage().ref().child(`${folder}/${randomFileName}`)
    await fileRef.put(file)
    const downloadURL = await fileRef.getDownloadURL()
    return { url: downloadURL, name: randomFileName }
  }

  async function handleNewPost(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    let uploadedImageUrl = null
    if (selectedImage) {
      const result = await uploadImageToFirebase(selectedImage, "post")
      uploadedImageUrl = result.url
    }

    if (!newContent) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Campo vazio.",
      })
    } else {
      try {
        if (props?.value && uploadedImageUrl) {
          fetchNewPost(props?.value, newContent, uploadedImageUrl)
        } else if (props?.value) {
          fetchNewPost(props?.value, newContent, "")
        }
        setNewContent("")
        setImageUrl(null)
        setIsLoading(false)
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Post cadastrado com sucesso.",
        })
        props?.fetch && props.fetch()
      } catch (error) {
        console.error("Erro ao inserir:", error)
        setIsLoading(false)
      }
    }
  }

  async function handleNewAnswer(e: React.FormEvent) {
    setIsLoading(true)
    e.preventDefault()

    let uploadedImageUrl = null
    if (selectedImage) {
      const result = await uploadImageToFirebase(selectedImage, "post")
      uploadedImageUrl = result.url
    }
    if (!newContent) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Campo vazio.",
      })
    } else {
      try {
        if (props?.value && post && uploadedImageUrl) {
          fetchNewAnswers(props?.value, newContent, post, uploadedImageUrl)
        } else if (props?.value && post) {
          fetchNewAnswers(props?.value, newContent, post, "")
        }
        setNewContent("")
        setImageUrl(null)
        setIsLoading(false)
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Post cadastrado com sucesso.",
        })
        props?.fetch && props.fetch()
      } catch (error) {
        console.error("Erro ao inserir:", error)
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchData()
    setNewContent("")
  }, [setNewContent])

  return (
    <form
      onSubmit={props?.answer ? handleNewAnswer : handleNewPost}
      className="px-5 py-6 flex flex-col"
    >
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <AvatarUser />
        <div>
          <Textarea
            className="resize-none border-0 placeholder:text-slate-400 pt-3 text-lg"
            placeholder={
              props?.answer ? "Digite sua resposta?" : "O que há de bom?"
            }
            value={newContent}
            onChange={handleNewContent}
          />
          {imageUrl && (
            <div className="w-72 h-72">
              <img src={imageUrl} alt="Selected" />
            </div>
          )}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <small className="mr-4 dark:text-gray-700 text-gray-400">
          {caracter} caracter restantes.
        </small>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Image size={24} className="text-zinc-400 cursor-pointer" />
        </label>
        <Button
          type="submit"
          className="bg-secondary-40 text-zinc-50 px-6 py-5 rounded-xl hover:bg-secondary-50"
        >
          {isLoading ? "Carregando..." : props?.answer ? "Responder" : "Postar"}
        </Button>
      </div>
    </form>
  )
}
