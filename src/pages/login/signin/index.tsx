import { useState } from "react"
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
  CardTitle,
} from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { useToast } from "../../../components/ui/use-toast"
import { Loader } from "../../../components/ui/loader"

import { useAuth } from "../../../context/AuthProvider/useAuth"

import { useNavigate } from "react-router-dom"

import iconLogin from "../../../assets/icon-login.png"
import { Eye, EyeOff, KeyRound, User2 } from "lucide-react"
import { getLogin, setLocalStorage } from "../../../hooks"

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

    let hasError = false

    if (!user) {
      setBorderUser("border border-rose-500 bg-rose-200")
      hasError = true
    } else {
      setBorderUser("border border-gray-200 bg-slate-50")
    }

    if (!password) {
      setBorderPsw("border border-rose-500 bg-rose-200")
      hasError = true
    } else {
      setBorderPsw("border border-gray-200 bg-slate-50")
    }

    if (!hasError) {
      getLogin(user, password)
        .then((result) => {
          setLocalStorage(result[0].email, result[0].token)
          navigate("/")
        })
        .catch((error) => {
          console.error(error)
          toast({
            variant: "destructive",
            title: "Não foi possivel prosseguir.",
            description: "E-mail ou senha inválidos.",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
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

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[350px] h-auto pb-2 bg-white rounded-2xl relative">
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
                placeholder="Digite seu e-mail"
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
          <CardFooter className="">
            <Button
              type="submit"
              className="bg-secondary-50 mt-8 w-screen text-xl text-bold text-white rounded-2xl h-14 hover:bg-secondary-40"
            >
              {isLoading ? <Loader /> : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
