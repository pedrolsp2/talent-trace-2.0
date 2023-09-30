import { MessageSingin } from "../MessageSingin"

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
  const status = localStorage.getItem("u") ? true : false

  if (!status) {
    return <MessageSingin />
  }

  return children
}
