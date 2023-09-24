import { ChatsCircle, GlobeHemisphereWest, Heart, NotePencil, Notebook, Sparkle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const currentRouteRef = useRef<string | null>(null); // Change the type here
  const [icon, setIcon] = useState<React.ReactNode | null>(null);
  const [page, setPage] = useState<string | null>(null);
  const viewPostRegex = /^\/view-post\/\d+$/;
  const icons: Record<string, JSX.Element> = {
    '/': <Sparkle size={28} />,
    '/search': <GlobeHemisphereWest size={28} />,
    '/new-post': <NotePencil size={28} />,
    '/view-post': ( <Notebook size={28} /> ),
    '/favoritos': <Heart size={28} />,
    '/conversas': <ChatsCircle size={28} />,
  };
  const pages: Record<string, string> = {
    '/': 'Home',
    '/search': 'Pesquise',
    '/new-post': 'Nova Publicação',
    '/view-post': "Post",
    '/favoritos': 'Amigos',
    '/conversas': 'Chat',
  }

  useEffect(() => {
    currentRouteRef.current = location.pathname;
    const currentPath = currentRouteRef.current;
    Object.keys(icons).forEach((path) => {
      if (viewPostRegex.test(currentPath)) {
        setIcon(icons['/view-post']);
        setPage(pages['/view-post']);
      } else if (path === currentPath) {
        setIcon(icons[path]);
        setPage(pages[path]);
      }
    });

    if (pages[currentPath]) {
      setPage(pages[currentPath]);
    }
  }, [location.pathname]);

  return (
    <div className="border-x border-slate-200 dark:border-zinc-900 flex items-center justify-between px-5 py-6">
      <span className="font-bold">{page}</span>
      <span className="text-secondary-40">{icon}</span>
    </div>
  );
}
