import { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { useToast } from "../../../components/ui/use-toast"
import iconLogin from "../../../assets/icon-login.png"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import firebase from "../../../services/firebase/config"
import { firebase as fb } from "../../../services/firebase/firebasestorageconfig"

import {
  Compass,
  Contact2,
  Dumbbell,
  Eye,
  EyeOff,
  Flag,
  Image,
  KeyRound,
  MapPin,
  Ruler,
  Split,
  User2,
} from "lucide-react"

type FormValues = {
  user: string
  email: string
  password: string
  confirmedPassword: string
  estado: string
  cidade: string
  altura: string
  peso: string
  idade: string
  perna: string
  posicao: string
  fotoPerfil: string
  fotoCapa: string
}

type ufProps = {
  id: number
  nome: string
  city: string
}

const initialState = ""

export default function Signup() {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState(initialState)
  const [isMobile, setIsMobile] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isActive2, setIsActive2] = useState(false)
  const [activeFieldset, setActiveFieldset] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewCover, setPreviewCover] = useState<string | null>(null)
  const [altura, setAltura] = useState("")
  const [idade, setIdade] = useState("")
  const [peso, setPeso] = useState("")
  const [posicao, setPosicao] = useState("")
  const [capaName, setCapaName] = useState<string | null>(null)
  const [coverName, setCoverName] = useState<string | null>(null)

  const [perna, setPerna] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState("")
  const [inputPassword, setInputPassword] = useState("password")
  const [inputConfirmed, setInputConfirmed] = useState("password")
  const [email, setEmail] = useState("")
  const [ufs, setUFs] = useState<ufProps[] | null>(null)
  const { toast } = useToast()
  const { register, handleSubmit } = useForm<FormValues>()

  useEffect(() => {
    const newTitle = "Talent Trace | Cadastrar"
    document.title = newTitle
  }, [])

  const onSubmit = async (data: FormValues) => {
    const id = Math.floor(Math.random() * 10000)
    try {
      await firebase.firestore().collection("users").add({
        id_user: id,
        altura: data.altura,
        cidade: data.cidade,
        email: data.email,
        estado: data.estado,
        fotoCapa: coverName,
        fotoPerfil: capaName,
        idade: data.idade,
        password: data.password,
        perna: data.perna,
        peso: data.peso,
        posicao: data.posicao,
        user: data.user,
      })
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Dados inseridos com sucesso!",
      })
      navigate("/login")
    } catch (error) {
      console.error("Erro ao inserir os dados:", error)
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Erro ao inserir os dados. Por favor, tente novamente.",
      })
    }
  }

  function getCity(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value
    setSelectedCity(selected)

    getAllCitiesByState(selected)
      .then((cities) => {
        const sortedCities = cities.sort(
          (a: { nome: string }, b: { nome: string }) =>
            a.nome.localeCompare(b.nome)
        )
        setUFs(sortedCities)
      })

      .catch((error) => {
        console.error("Erro ao obter cidades:", error)
      })
  }

  async function getAllCitiesByState(uf: string) {
    try {
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`
      )
      const cities = response.data
      return cities
    } catch (error) {
      console.error("Erro ao obter as cidades")
      return []
    }
  }

  const handleNext = (event: React.FormEvent) => {
    if (activeFieldset === 0) {
      const regex = /^[^\s@]+[a-zA-Z0-9._-]+@[^\s@]+\.[^\s@]+$/
      const result = regex.test(email)

      if (!password || !confirmedPassword || !user || !email) {
        toast({
          variant: "destructive",
          title: "Não foi possivel prosseguir.",
          description: "Preencha todos os campos para avançar!",
        })
        return
      }
      if (!result) {
        toast({
          variant: "destructive",
          title: "Não foi possivel prosseguir.",
          description: "Digite um e-mail valido.",
        })
        return
      }
      if (password !== confirmedPassword) {
        toast({
          variant: "destructive",
          title: "Não foi possivel prosseguir.",
          description: "As senhas não se conferem.",
        })
        return
      }
    }
    if (activeFieldset === 1) {
      if (!selectedCity || !altura || !peso || !idade || !perna || !posicao) {
        toast({
          variant: "destructive",
          title: "Não foi possivel prosseguir.",
          description: "Preencha todos os campos para avançar!",
        })
        return
      }
    }
    event.preventDefault()
    setActiveFieldset((prev) => prev + 1)
  }

  const handlePrev = (event: React.FormEvent) => {
    event.preventDefault()
    if (activeFieldset > 0) {
      setActiveFieldset((prev) => prev - 1)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 1400)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  function handlePswdText() {
    if (isActive) {
      setIsActive(!isActive)
      setInputPassword("password")
    }
    if (!isActive) {
      setIsActive(!isActive)
      setInputPassword("text")
    }
  }

  function handleConfirmedPswdText() {
    if (isActive2) {
      setIsActive2(!isActive2)
      setInputConfirmed("password")
    }
    if (!isActive2) {
      setIsActive2(!isActive2)
      setInputConfirmed("text")
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

    // Criar uma referência para o arquivo no Firebase Storage
    const fileRef = fb.storage().ref().child(`${folder}/${randomFileName}`)

    // Fazer o upload do arquivo
    await fileRef.put(file)

    // Obter a URL de download
    const downloadURL = await fileRef.getDownloadURL()

    return { url: downloadURL, name: randomFileName }
  }

  const handleFileChangeCapa = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await uploadImageToFirebase(file, "capa")
        setPreviewImage(result.url)
        setCapaName(result.url)
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
      }
    }
  }

  const handleFileChangeCover = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await uploadImageToFirebase(file, "cover")
        setPreviewCover(result.url)
        setCoverName(result.url)
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
      }
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card
        className={`w-[550px] h-auto ${
          isMobile && "pb-2"
        } bg-white rounded-2xl relative`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="flex items-center gap-1">
            {isMobile && (
              <Avatar className="w-[82px] h-[82px] mb-4">
                <AvatarImage src={iconLogin} />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
            )}
            <div className="w-full h-[82px] flex justify-stretch">
              <span
                className="flex-1 border-b-2 border-primary-50 grid justify-center items-center cursor-pointer"
                onClick={() => setActiveFieldset(0)}
              >
                <h1 className="text-secondary-50 font-bold text-2xl text-center">
                  Dados
                </h1>
              </span>
              <span
                className={`flex-1 border-b-2 ${
                  activeFieldset >= 1 ? "border-primary-50" : "border-gray-100"
                } grid justify-center items-center cursor-pointer`}
                onClick={() => setActiveFieldset(1)}
              >
                <h1 className="text-secondary-50 font-bold text-2xl text-center">
                  Habilidades
                </h1>
              </span>
              <span
                className={`flex-1 border-b-2 ${
                  activeFieldset >= 2 ? "border-primary-50" : "border-gray-100"
                } grid justify-center items-center cursor-pointer`}
                onClick={() => setActiveFieldset(2)}
              >
                <h1 className="text-secondary-50 font-bold text-2xl text-center">
                  Fotos
                </h1>
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <fieldset
              className={`${activeFieldset === 0 ? "visibel" : "hidden"}`}
            >
              <Label className="text-zinc-400" htmlFor="user">
                Nome
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User2 size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("user", { required: true })}
                  onChange={(e) => setUser(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="text"
                  id="user"
                  value={user}
                  placeholder="Digite seu nome"
                />
              </div>
              <Label className="text-zinc-400" htmlFor="user">
                E-mail
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Contact2 size={28} className="text-gray-400" />
                </span>
                <Input
                  value={email}
                  {...register("email", { required: true })}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                />
              </div>
              <Label className="text-zinc-400" htmlFor="user">
                Senha
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <KeyRound size={28} className="text-gray-400" />
                </span>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {!isActive ? (
                    <Eye
                      size={28}
                      className="text-gray-400"
                      onClick={handlePswdText}
                    ></Eye>
                  ) : (
                    <EyeOff
                      size={28}
                      className="text-gray-400"
                      onClick={handlePswdText}
                    ></EyeOff>
                  )}
                </span>
                <Input
                  {...register("password", { required: true })}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type={inputPassword}
                  value={password}
                  id="password"
                  placeholder="Digite sua senha"
                />
              </div>
              <Label className="text-zinc-400" htmlFor="user">
                Confirme sua senha
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <KeyRound size={28} className="text-gray-400" />
                </span>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {!isActive2 ? (
                    <Eye
                      size={28}
                      className="text-gray-400"
                      onClick={handleConfirmedPswdText}
                    ></Eye>
                  ) : (
                    <EyeOff
                      size={28}
                      className="text-gray-400"
                      onClick={handleConfirmedPswdText}
                    ></EyeOff>
                  )}
                </span>
                <Input
                  {...register("confirmedPassword", { required: true })}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type={inputConfirmed}
                  value={confirmedPassword}
                  id="confirmedPassword"
                  placeholder="Digite novamente sua senha"
                />
              </div>
            </fieldset>
            <fieldset
              className={`${activeFieldset === 1 ? "visibel" : "hidden"}`}
            >
              <div className="relative">
                <span className="absolute left-3 top-7 transform -translate-y-1/2">
                  <Compass size={28} className="text-gray-400" />
                </span>
                <select
                  {...register("estado", { required: true })}
                  className="w-full rounded-xl px-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  onChange={(e) => {
                    getCity(e)
                  }}
                  value={selectedCity}
                >
                  <option className="bg-zinc-100" disabled>
                    Qual seu estado?
                  </option>
                  <option className="bg-zinc-100" value="AL">
                    Acre
                  </option>
                  <option className="bg-zinc-100" value="AC">
                    Alagoas
                  </option>
                  <option className="bg-zinc-100" value="AP">
                    Amapá
                  </option>
                  <option className="bg-zinc-100" value="AM">
                    Amazonas
                  </option>
                  <option className="bg-zinc-100" value="BA">
                    Bahia
                  </option>
                  <option className="bg-zinc-100" value="CE">
                    Ceará
                  </option>
                  <option className="bg-zinc-100" value="DF">
                    Distrito Federal
                  </option>
                  <option className="bg-zinc-100" value="ES">
                    Espírito Santo
                  </option>
                  <option className="bg-zinc-100" value="GO">
                    Goiás
                  </option>
                  <option className="bg-zinc-100" value="MA">
                    Maranhão
                  </option>
                  <option className="bg-zinc-100" value="MT">
                    Mato Grosso
                  </option>
                  <option className="bg-zinc-100" value="MS">
                    Mato Grosso do Sul
                  </option>
                  <option className="bg-zinc-100" value="MG">
                    Minas Gerais
                  </option>
                  <option className="bg-zinc-100" value="PA">
                    Pará
                  </option>
                  <option className="bg-zinc-100" value="PB">
                    Paraíba
                  </option>
                  <option className="bg-zinc-100" value="PR">
                    Paraná
                  </option>
                  <option className="bg-zinc-100" value="PE">
                    Pernambuco
                  </option>
                  <option className="bg-zinc-100" value="PI">
                    Piauí
                  </option>
                  <option className="bg-zinc-100" value="RJ">
                    Rio de Janeiro
                  </option>
                  <option className="bg-zinc-100" value="RN">
                    Rio Grande do Norte
                  </option>
                  <option className="bg-zinc-100" value="RS">
                    Rio Grande do Sul
                  </option>
                  <option className="bg-zinc-100" value="RO">
                    Rondônia
                  </option>
                  <option className="bg-zinc-100" value="RR">
                    Roraima
                  </option>
                  <option className="bg-zinc-100" value="SC">
                    Santa Catarina
                  </option>
                  <option className="bg-zinc-100" value="SP">
                    São Paulo
                  </option>
                  <option className="bg-zinc-100" value="SE">
                    Sergipe
                  </option>
                  <option className="bg-zinc-100" value="TO">
                    Tocantins
                  </option>
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-7 transform -translate-y-1/2">
                  <MapPin size={28} className="text-gray-400" />
                </span>
                <select
                  className="w-full rounded-xl px-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  {...register("cidade", { required: true })}
                >
                  <option className="bg-zinc-100" disabled>
                    Qual sua cidade?
                  </option>
                  {ufs &&
                    ufs.map((city: ufProps) => (
                      <option
                        key={city.id}
                        value={city.nome}
                        className="bg-zinc-100"
                      >
                        {city.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-7 transform -translate-y-1/2">
                    <Ruler size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("altura", { required: true })}
                    onChange={(e) => setAltura(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="number"
                    id="altura"
                    placeholder="Qual sua altura?"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-7 transform -translate-y-1/2">
                    <Dumbbell size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("peso", { required: true })}
                    onChange={(e) => setPeso(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="number"
                    id="peso"
                    placeholder="Qual seu peso?"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-7 transform -translate-y-1/2">
                    <User2 size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("idade", { required: true })}
                    onChange={(e) => setIdade(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="number"
                    id="idade"
                    placeholder="Qual seu idade?"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-7 transform -translate-y-1/2">
                    <Split size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("perna", { required: true })}
                    onChange={(e) => setPerna(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="text"
                    id="perna"
                    placeholder="Qual sua perna?"
                  />
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Flag size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("posicao", { required: true })}
                  onChange={(e) => setPosicao(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="text"
                  id="posicao"
                  placeholder="Qual sua posição?"
                />
              </div>
            </fieldset>
            <fieldset
              className={`${activeFieldset === 2 ? "visibel" : "hidden"}`}
            >
              <h1 className="text-center text-2xl text-primary-50 font-bold pb-2">
                Foto de perfil
              </h1>
              <div
                className={`flex ${
                  isMobile ? "flex-col" : "flex-row"
                } items-center gap-2`}
              >
                <Avatar className={`${isMobile ? "h-36 w-36" : "h-32 w-32"}`}>
                  {previewImage && (
                    <AvatarImage src={previewImage} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-gray-200">
                    <User2 size={52} className="text-zinc-400" />
                  </AvatarFallback>
                </Avatar>
                <Input
                  {...register("fotoPerfil", { required: true })}
                  type="file"
                  onChange={handleFileChangeCapa}
                  accept="image/jpeg, image/png"
                  className="w-auto rounded-xl text-sm border border-gray-200 bg-slate-50 cursor-pointer placeholder:text-gray-500"
                  id="foto-perfil"
                />
              </div>
              <h1
                className={`text-center text-2xl text-primary-50 font-bold pb-2 ${
                  isMobile ? "pt-6" : "pt-0"
                }`}
              >
                Foto de capa
              </h1>
              <div
                className={`flex ${
                  isMobile ? "flex-col" : "flex-row"
                } items-center gap-2`}
              >
                <div
                  className={`bg-gray-200 ${
                    isMobile ? "h-52" : "h-40"
                  } w-full rounded-xl grid items-center justify-center`}
                >
                  {previewCover ? (
                    <img
                      src={previewCover}
                      alt="Imagem de capa"
                      className={`object-cover ${isMobile ? "h-52" : "h-40"}`}
                    />
                  ) : (
                    <Image size={100} className="text-zinc-400" />
                  )}
                </div>
                <Input
                  {...register("fotoCapa", { required: true })}
                  type="file"
                  onChange={handleFileChangeCover}
                  accept="image/jpeg, image/png"
                  className="w-auto rounded-xl text-sm border border-gray-200 bg-slate-50 cursor-pointer placeholder:text-gray-500"
                  id="foto-capa"
                />
              </div>
            </fieldset>
          </CardContent>
          <CardFooter className="flex gap-2">
            {activeFieldset > 0 && (
              <Button
                onClick={handlePrev}
                className="bg-secondary-50 mt-8 w-screen text-xl text-bold text-white rounded-2xl h-14 hover:bg-secondary-40"
              >
                Voltar
              </Button>
            )}
            {activeFieldset < 2 ? (
              <Button
                onClick={handleNext}
                className="bg-primary-50 mt-8 w-screen text-xl text-bold text-white rounded-2xl h-14 hover:bg-primary-40"
              >
                Avançar
              </Button>
            ) : (
              <input
                type="submit"
                className="bg-primary-50 mt-8 w-screen text-xl text-bold text-white rounded-2xl h-14 hover:bg-primary-40 cursor-pointer"
              />
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
