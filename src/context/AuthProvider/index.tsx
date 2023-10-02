import { createContext, useEffect, useState } from "react"
import { IAuthProvider, IContext, IUser } from "./type"
import { LoginRequeste, getUserLocalStorage, setUserLocalStorage } from "./uitl"

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<IUser | null>()

  useEffect(() => {
    const user = getUserLocalStorage()

    if (user) {
      setUser(user)
    }
  }, [])

  async function authenticate(email: string, password: string) {
    const resp = await LoginRequeste(email, password)

    const payload = { token: resp.token, email }
    setUser(payload)
    setUserLocalStorage(payload)
  }

  function logout() {
    setUser(null)
    setUserLocalStorage(null)
    localStorage.removeItem("u")
  }

  return (
    <AuthContext.Provider value={{ ...user, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
