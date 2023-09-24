import { useEffect, useState } from "react"
import imgBack from "../../assets/img-back.jpg"
import imgLogin from "../../assets/img-back-login.jpg"
import Signin from "./signin"
import Signup from "./signup"

import Image from "../../assets/logo512.svg"
import { ArrowLeft } from "lucide-react"

import { useNavigate } from "react-router-dom"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"

export default function Login() {
  const [status, setStatus] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const newTitle = "Talent Trace | Login"
    document.title = newTitle
  }, [])

  return (
    <div
      className="w-screen h-screen grid grid-cols-2"
      style={{
        backgroundImage: `url(${imgLogin})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
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
          <DialogFooter>
            <Button
              type="button"
              onClick={() => navigate("/novo-olheiro")}
              className="text-white bg-secondary-50 hover:bg-secondary-60"
            >
              Olheiro
            </Button>
            <Button
              type="button"
              onClick={() => setStatus(!status)}
              className="text-white bg-primary-50 hover:bg-primary-60"
            >
              Jogador
            </Button>
          </DialogFooter>
        </DialogContent>

        <div className="relative">
          <div
            className="rounded-r-3xl h-full grid items-center"
            style={{
              backgroundImage: `url(${imgBack}), linear-gradient(146deg, #14AF6C 0%, #1A0751 100%)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="flex justify-center items-center flex-col text-center gap-4">
              <h1 className="font-bold text-6xl text-white">Fala jogador!</h1>
              <h3 className="text-2xl text-gray-100">
                {status
                  ? "Faça o login para começar"
                  : "Siga todos os passos para criar a conta"}
              </h3>
              <img src={Image} alt="Logo" className="w-[60%]" />
              <Button variant="link" className="text-white text-lg">
                {status ? (
                  <DialogTrigger asChild>
                    <span className="text-white">
                      Não tem acesso?
                      <span className="text-primary-50 font-bold">
                        &nbsp; Faça agora!
                      </span>
                    </span>
                  </DialogTrigger>
                ) : (
                  <span
                    className="text-primary-50 font-bold flex gap-1"
                    onClick={() => setStatus(!status)}
                  >
                    <ArrowLeft className="text-primary-50" size={28} />
                    <span className="text-white">Voltar</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
        {status ? <Signin /> : <Signup />}
      </Dialog>
    </div>
  )
}
