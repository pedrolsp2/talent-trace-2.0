import { Outlet } from "react-router-dom"
import { SideBar } from "../components/SideBar"
import { Header } from "../components/Header"

function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  )
}

export function Default() {
  if (isMobileDevice()) {
    return (
      <div className="dark:bg-dark-TT bg-slate-50 dark:text-zinc-50 text-zinc-900">
        <div className="w-full mx-auto px-1">
          <Header />
          <div className="border border-slate-200 dark:border-zinc-900">
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[auto,1fr] dark:bg-dark-TT bg-slate-50 dark:text-zinc-50 text-zinc-900">
      <SideBar />
      <div className="max-w-[1250px] w-full mx-auto px-5">
        <Header />
        <div className="border border-slate-200 dark:border-zinc-900">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
