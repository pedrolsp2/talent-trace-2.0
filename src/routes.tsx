import { createBrowserRouter } from "react-router-dom"

import Login from "./pages/login"
import Home from "./pages/home"
import MobileLogin from "./pages/mobile/login"
import MobileSignup from "./pages/mobile/login/signup"

import { Default } from "./layout/Default"
import { ProtectedLayout } from "./components/ProtectedLayout"
import Message from "./pages/message"
import NotFound from "./components/NotFound"
import SignUpOlheiro from "./pages/SignUpOlheiro"
import MobileSignUpOlheiro from "./pages/mobile/SignUpOlheiro"
import { ViewPost } from "./pages/viewPost"

function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedLayout children={<Default />}></ProtectedLayout>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/view-post/:id",
        element: <ViewPost />,
      },
    ],
  },
  {
    path: "/login",
    element: isMobileDevice() ? <MobileLogin /> : <Login />,
  },
  {
    path: "/novo-olheiro",
    element: isMobileDevice() ? <MobileSignUpOlheiro /> : <SignUpOlheiro />,
  },
  {
    path: "/novo-jogador",
    element: isMobileDevice() ? <MobileSignup /> : <NotFound />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
])
