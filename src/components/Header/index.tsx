import {
  Notebook,
  SoccerBall,
  Sparkle,
  UserSquare,
} from '@phosphor-icons/react';
import { SlackIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const currentRouteRef = useRef<string | null>(null); // Change the type here
  const [icon, setIcon] = useState<React.ReactNode | null>(null);
  const [page, setPage] = useState<string | null>(null);
  const viewPostRegex = /^\/view-post\/\d+$/;
  const userPostRegex = /^\/user\/[\w-]+$/;

  const icons: Record<string, JSX.Element> = {
    '/': <Sparkle size={28} />,
    '/view-post': <Notebook size={28} />,
    '/user': <UserSquare size={28} />,
    '/comunidades': <SlackIcon size={28} />,
    '/peneiras': <SoccerBall size={28} />,
  };
  const pages: Record<string, string> = {
    '/': 'Home',
    '/view-post': 'Post',
    '/user': 'Perfil do usuário',
    '/comunidades': 'Comunidades',
    '/comunidade': 'Comunidade',
    '/peneiras': 'Peneiras',
  };

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
      if (userPostRegex.test(currentPath)) {
        setIcon(icons['/user']);
        setPage(pages['/user']);
      } else if (path === currentPath) {
        setIcon(icons[path]);
        setPage(pages[path]);
      }
    });

    if (pages[currentPath]) {
      setPage(pages[currentPath]);
    }
  }, [location.pathname]);

  if (
    page === 'Comunidade' ||
    page === 'Comunidades' ||
    null ||
    page === 'Peneiras'
  ) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-5 py-6 bg-white border-x border-slate-200 dark:border-zinc-900 dark:bg-dark-TT">
      <span className="font-bold">{page}</span>
      <span className="text-secondary-40">{icon}</span>
    </div>
  );
}
