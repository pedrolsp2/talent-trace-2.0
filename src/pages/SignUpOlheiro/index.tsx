import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import background from "../../assets/back-olheiro.png"
import imgBack from "../../assets/img-back.jpg"
import iconLogin from "../../assets/icon-login.png"

import {
  Award,
  Contact2,
  Eye,
  EyeOff,
  FileImage,
  Fingerprint,
  KeyRound,
  User,
  User2,
  UserSquare,
  Image,
  CalendarDays,
  UserCheck,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import firebase from "../../services/firebase/config"
import { firebase as fb } from "../../services/firebase/firebasestorageconfig"
import { toast } from "../../components/ui/use-toast"

type FormValues = {
  user: string
  username: string
  email: string
  password: string
  confirmedPassword: string
  cpf: string
  cref: string
  dataNascimento: string
  fotoPerfil: string
  fotoCapa: string
}

export default function SignUpOlheiro() {
  const [isActiveSenha, setIsActiveSenha] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [typeSenha, setTypeSenha] = useState("password")
  const [typeConfirmaSenha, setTypeConfirmaSenha] = useState("password")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewCover, setPreviewCover] = useState<string | null>(null)
  const [activeFieldset, setActiveFieldset] = useState(0)
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [cpf, setCpf] = useState("")
  const [cref, setCref] = useState("")
  const [data, setData] = useState("")
  const [capaFile, setCapaFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const { register, handleSubmit } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    const id = Math.floor(Math.random() * 10000)
    try {
      let capaURL = ""
      let coverURL = ""

      if (capaFile) {
        const resultCapa = await uploadImageToFirebase(capaFile, "capa")
        capaURL = resultCapa.url
      }

      if (coverFile) {
        const resultCover = await uploadImageToFirebase(coverFile, "cover")
        coverURL = resultCover.url
      }
      await firebase.firestore().collection("users").add({
        id_user: id,
        email: data.email,
        fotoCapa: coverURL,
        fotoPerfil: capaURL,
        password: data.password,
        user: data.user,
        cpf: data.cpf,
        cref: data.cref,
        dataNascimento: data.dataNascimento,
        username: data.username,
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

  const uploadImageToFirebase = async (
    file: File,
    folder: string
  ): Promise<{ url: string; name: string }> => {
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

  const handleFileChangeCapa = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCapaFile(file)
      const fileURL = URL.createObjectURL(file)
      setPreviewImage(fileURL)
    }
  }

  const handleFileChangeCover = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const fileURL = URL.createObjectURL(file)
      setPreviewCover(fileURL)
    }
  }

  const handlePrev = (event: React.FormEvent) => {
    event.preventDefault()
    if (activeFieldset > 0) {
      setActiveFieldset((prev) => prev - 1)
    }
  }

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault()
    if (activeFieldset >= 0) {
      setActiveFieldset((prev) => prev + 1)
    }
  }

  const handleViewPassword = (input: string) => {
    if (input === "senha") {
      setIsActive(!isActive)
      if (typeSenha === "password") {
        setTypeSenha("text")
      } else {
        setTypeSenha("password")
      }
    } else {
      setIsActiveSenha(!isActiveSenha)
      if (typeConfirmaSenha === "password") {
        setTypeConfirmaSenha("text")
      } else {
        setTypeConfirmaSenha("password")
      }
    }
  }

  useEffect(() => {
    const newTitle = "Talent Trace | Novo Cadastro"
    document.title = newTitle
  }, [])

  return (
    <div className="h-screen grid grid-cols-[400px,1fr]">
      <div
        style={{
          backgroundImage: `url(${imgBack}), linear-gradient(146deg, #14AF6C 0%, #1A0751 100%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col w-auto py-4 gap-4 sticky top-0">
          <span
            onClick={() => setActiveFieldset(0)}
            className={`flex gap-2 px-3 py-2 rounded-s items-center bg-white w-52 ml-auto text-primary-50 cursor-pointer ${
              activeFieldset !== 0 && "opacity-30 transition-opacity"
            }`}
          >
            <User />
            Info Pessoais
          </span>
          <span
            onClick={() => setActiveFieldset(1)}
            className={`flex gap-2 px-3 py-2 rounded-s items-center bg-white w-52 ml-auto text-primary-50 cursor-pointer ${
              activeFieldset !== 1 && "opacity-30 transition-opacity"
            }`}
          >
            <UserSquare />
            Docs Pessoais
          </span>
          <span
            onClick={() => setActiveFieldset(2)}
            className={`flex gap-2 px-3 py-2 rounded-s items-center bg-white w-52 ml-auto text-primary-50 cursor-pointer ${
              activeFieldset !== 2 && "opacity-30 transition-opacity"
            }`}
          >
            <FileImage />
            Fotos
          </span>
        </div>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 py-8 max-lg:gap-2 p-4"
        style={{
          backgroundImage: `url(${background}), linear-gradient(146deg, #14AF6C 0%, #1A0751 100%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1 className="font-semibold text-[24px] text-center text-zinc-500 ">
          Olheiro, faça o seu cadastro para ter acesso ao{" "}
          <span className="text-primary-50 font-bold">Talent Trace</span>
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="form"
          style={{ background: "rgba(255, 255, 255, 0.19)" }}
          className={`max-w-[950px] mx-auto p-7 justify-between mt-8 h-[650px] w-full rounded-sm backdrop-blur-sm shadow-md flex flex-col gap-4 items-center`}
        >
          <Avatar className="w-[82px] h-[82px]">
            <AvatarImage src={iconLogin} />
            <AvatarFallback>TT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <fieldset
              className={`${activeFieldset === 0 ? "visibel" : "hidden"}`}
            >
              <div className="flex gap-2 ">
                <div className="relative w-full">
                  <Label className="text-zinc-400">Nome</Label>
                  <span className="absolute left-3 top-[55%] transform -translate-y-1/2">
                    <User2 size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("user", { required: true })}
                    onChange={(e) => setNome(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="text"
                    id="user"
                    value={nome}
                    placeholder="Digite seu nome"
                  />
                </div>
                <div className="relative w-full">
                  <Label className="text-zinc-400">Usuário</Label>
                  <span className="absolute left-3 top-[55%] transform -translate-y-1/2">
                    <UserCheck size={28} className="text-gray-400" />
                  </span>
                  <Input
                    {...register("username", { required: true })}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                    type="text"
                    id="username"
                    value={username}
                    placeholder="Digite seu usuario"
                  />
                </div>
              </div>
              <div className="relative">
                <Label className="text-zinc-400">E-mail</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <Contact2 size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("email", { required: true })}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Digite seu e-mail"
                />
              </div>
              <div className="relative">
                <Label className="text-zinc-400">Senha</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <KeyRound size={28} className="text-gray-400" />
                </span>

                <span className="absolute right-3 top-[65%] transform -translate-y-1/2">
                  {!isActive ? (
                    <Eye
                      size={28}
                      className="text-gray-400"
                      onClick={() => handleViewPassword("senha")}
                    ></Eye>
                  ) : (
                    <EyeOff
                      size={28}
                      className="text-gray-400"
                      onClick={() => handleViewPassword("senha")}
                    ></EyeOff>
                  )}
                </span>
                <Input
                  {...register("password", { required: true })}
                  onChange={(e) => setSenha(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type={typeSenha}
                  id="password"
                  value={senha}
                  placeholder="Digite sua senha"
                />
              </div>
              <div className="relative">
                <Label className="text-zinc-400">Confirme sua senha</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <KeyRound size={28} className="text-gray-400" />
                </span>

                <span className="absolute right-3 top-[65%] transform -translate-y-1/2">
                  {!isActiveSenha ? (
                    <Eye
                      size={28}
                      className="text-gray-400"
                      onClick={() => handleViewPassword("ConfirmaSenha")}
                    ></Eye>
                  ) : (
                    <EyeOff
                      size={28}
                      className="text-gray-400"
                      onClick={() => handleViewPassword("ConfirmaSenha")}
                    ></EyeOff>
                  )}
                </span>
                <Input
                  {...register("confirmedPassword", { required: true })}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type={typeConfirmaSenha}
                  id="confirmedPassword"
                  value={confirmaSenha}
                  placeholder="Confirme sua senha"
                />
              </div>
            </fieldset>
            <fieldset
              className={`${activeFieldset === 1 ? "visibel" : "hidden"}`}
            >
              <div className="relative">
                <Label className="text-zinc-400">CPF</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <Fingerprint size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("cpf", { required: true })}
                  onChange={(e) => setCpf(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="text"
                  id="cpf"
                  value={cpf}
                  placeholder="Digite seu CPF"
                />
              </div>
              <div className="relative">
                <Label className="text-zinc-400">CREF</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <Award size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("cref", { required: true })}
                  onChange={(e) => setCref(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="text"
                  id="cref"
                  value={cref}
                  placeholder="Digite seu cref"
                />
              </div>
              <div className="relative">
                <Label className="text-zinc-400">Data de nascimento</Label>
                <span className="absolute left-3 top-[65%] transform -translate-y-1/2">
                  <CalendarDays size={28} className="text-gray-400" />
                </span>
                <Input
                  {...register("dataNascimento", { required: true })}
                  onChange={(e) => setData(e.target.value)}
                  className="rounded-xl pl-12 mb-3 h-14 text-base border border-gray-200 bg-slate-50 placeholder:text-gray-500"
                  type="date"
                  value={data}
                  id="dataNascimento"
                />
              </div>
            </fieldset>
            <fieldset
              className={`${activeFieldset === 2 ? "visibel" : "hidden"}`}
            >
              <h1 className="text-center text-2xl text-primary-50 font-bold pb-2">
                Foto de perfil
              </h1>
              <div className={`flex flex-row items-center gap-2`}>
                <Avatar className={`h-32 w-32`}>
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
                className={`text-center text-2xl text-primary-50 font-bold pb-2 pt-0`}
              >
                Foto de capa
              </h1>
              <div className={`flex flex-row items-center gap-2`}>
                <div
                  className={`bg-gray-200 h-40 w-full rounded-xl grid items-center justify-center`}
                >
                  {previewCover ? (
                    <img
                      src={previewCover}
                      alt="Imagem de capa"
                      className={`object-cover h-40`}
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
          </div>
          <span className="flex gap-3">
            {activeFieldset > 0 && (
              <Button
                onClick={handlePrev}
                className="px-6 text-white bg-secondary-50 hover:bg-secondary-60"
              >
                Voltar
              </Button>
            )}
            {activeFieldset < 2 ? (
              <Button
                onClick={handleNext}
                className="px-6 text-white bg-primary-50 hover:bg-primary-60"
              >
                Avançar
              </Button>
            ) : (
              <Button
                className="px-6 text-white bg-primary-50 hover:bg-primary-60"
                type="submit"
              >
                Enviar
              </Button>
            )}
          </span>
        </form>
      </div>
    </div>
  )
}
