import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Button } from "../../../../components/ui/button"
import { useToast } from "../../../../components/ui/use-toast"
import { Loader } from "../../../../components/ui/loader"

import { useAuth } from "../../../../context/AuthProvider/useAuth"

import { useNavigate } from "react-router-dom"

import iconLogin from "../../../../assets/icon-login.png"
import { Eye, EyeOff, KeyRound, User2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "../../../../components/ui/dialog"

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState("password")
  const [borderUser, setBorderUser] = useState(
    "border border-gray-200 bg-slate-50"
  )
  const [borderPsw, setBorderPsw] = useState(
    "border border-gray-200 bg-slate-50"
  )
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const auth = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (!user) {
      setBorderUser("border border-rose-500 bg-rose-200")
      setIsLoading(false)
    } else {
      setBorderUser("border border-gray-200 bg-slate-50")
      setIsLoading(false)
    }
    if (!password) {
      setBorderPsw("border border-rose-500 bg-rose-200")
      setIsLoading(false)
    } else {
      setBorderPsw("border border-gray-200 bg-slate-50")
      setIsLoading(false)
    }

    const values = {
      email: user,
      password: password,
    }

    onHandleSignIn(values)
  }

  function handlePswdText() {
    if (isActive) {
      setIsActive(!isActive)
      setInput("password")
    }
    if (!isActive) {
      setIsActive(!isActive)
      setInput("text")
    }
  }

  async function onHandleSignIn(values: { email: string; password: string }) {
    setIsLoading(true)
    try {
      await auth.authenticate(values.email, values.password)
      setIsLoading(false)
      navigate("/")
    } catch (error) {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Não foi possivel prosseguir.",
        description: "E-mail ou senha inválidos.",
      })
      setBorderUser("border border-rose-500 bg-rose-200")
      setBorderPsw("border border-rose-500 bg-rose-200")
      setTimeout(() => {
        setBorderUser("border border-gray-200 bg-slate-50")
        setBorderPsw("border border-gray-200 bg-slate-50")
      }, 5000)
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <Dialog>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-md">
          <DialogHeader>
            <DialogTitle className="text-secondary-50">
              Qual sua habilidade?
            </DialogTitle>
            <DialogDescription>
              Você é olheiro, ou uma promessa do futebol?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button
              type="button"
              onClick={() => navigate("/novo-olheiro")}
              className="text-white bg-secondary-50 hover:bg-secondary-60 w-full"
            >
              Olheiro
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/novo-jogador")}
              className="text-white bg-primary-50 hover:bg-primary-60 w-full"
            >
              Jogador
            </Button>
          </DialogFooter>
        </DialogContent>
        <Card className="w-full h-auto pb-2 bg-white rounded-2xl relative">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex items-center gap-1">
              <Avatar className="w-[82px] h-[82px]">
                <AvatarImage src={iconLogin} />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <CardTitle className="text-secondary-70">Entrar</CardTitle>
              <CardTitle className="text-secondary-50">Talent Trace</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Label htmlFor="user">Usuário</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User2 size={28} className="text-gray-400" />
                </span>
                <Input
                  className={`pl-12 rounded-xl mb-3 h-14 text-base placeholder:text-gray-500 ${borderUser}`}
                  type="text"
                  id="user"
                  placeholder="Digite seu usuário"
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>

              <Label htmlFor="password" className="relative">
                Senha
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <KeyRound size={28} className="text-gray-400" />
                  </span>
                  <Input
                    className={`pl-12 rounded-xl h-14 text-base placeholder:text-gray-500 ${borderPsw}`}
                    type={input}
                    id="password"
                    placeholder="Digite sua senha"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {!isActive ? (
                    <Eye
                      size={28}
                      className="absolute right-2 top-4 cursor-pointer text-gray-500"
                      onClick={handlePswdText}
                    ></Eye>
                  ) : (
                    <EyeOff
                      size={28}
                      className="absolute right-2 top-4 cursor-pointer text-gray-500"
                      onClick={handlePswdText}
                    ></EyeOff>
                  )}
                </div>
              </Label>
              <Button
                variant="link"
                className="absolute right-4 p-0 mt-[-8px] text-xs"
              >
                Esqueci minha senha
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="bg-secondary-50 mt-8 w-full text-xl text-bold text-white rounded-2xl h-14 hover:bg-secondary-40"
              >
                {isLoading ? <Loader /> : "Entrar"}
              </Button>
              <DialogTrigger asChild>
                <span className="text-zinc-500">
                  Não tem acesso?
                  <span className="text-primary-50 font-bold">
                    &nbsp; Faça agora!
                  </span>
                </span>
              </DialogTrigger>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </div>
  )
}
