import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header"; 

export function Default() {
  return (
    <div className="grid grid-cols-[auto,1fr] dark:bg-dark-TT bg-slate-50 dark:text-zinc-50 text-zinc-900">
      <SideBar />
      <div className="max-w-[1250px] w-full mx-auto px-5">
        <Header />
        <div className="border border-slate-200 dark:border-zinc-900"><Outlet /></div>
      </div>
    </div>
  );
}
