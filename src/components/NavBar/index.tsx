import logoImage from '../../assets/logo.svg';
import { Flame, LogOut, Menu, Moon, SlackIcon, Sun } from 'lucide-react';
import { AvatarUser } from '../AvatarUser';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { House } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { useQuery } from '@tanstack/react-query';
import { fetchDataUser, fetchMyCom } from '../../context/hooks/getData';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { InfoUser } from '../../context/AuthProvider/type';
import { BadgeType } from '../BadgeType';

type IComunidade = {
  nameURL: string;
  nome: string;
  tipo: 'Peneiras' | 'Curiosidades' | 'Treinos';
};

export function Navbar() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') ? localStorage.getItem('theme')! : 'light'
  );

  const storoga = getUserLocalStorage();
  const email = storoga[0];
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSetTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.querySelector('html')?.setAttribute('data-mode', 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.querySelector('html')?.setAttribute('data-mode', 'light');
    }
  };

  function handleLogout() {
    try {
      auth.logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async (): Promise<InfoUser | null> => {
    const data = await fetchDataUser(email || '');
    if (data) {
      return data as InfoUser;
    } else {
      return null;
    }
  };

  const { data } = useQuery({
    queryKey: ['sidebar-userData'],
    queryFn: fetchData,
  });

  const fetchCom = async (): Promise<IComunidade[]> => {
    const comunidades = await fetchMyCom(data?.id_user || 0);
    if (comunidades) {
      return comunidades as IComunidade[];
    } else {
      return [];
    }
  };

  const { data: menuComunidade } = useQuery({
    queryKey: ['menu-comunidade'],
    queryFn: fetchCom,
  });

  useEffect(() => {
    const localTheme: string | null = localStorage.getItem('theme');
    if (localTheme) {
      setTheme(localTheme);
    } else {
      const userPrefersDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (userPrefersDark) {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        setTheme('light');
        localStorage.setItem('theme', 'light');
      }
    }
    document.querySelector('html')?.setAttribute('data-mode', theme);
  }, []);

  return (
    <Sheet>
      <div className="flex items-center justify-between w-full h-16 px-3 bg-secondary-60/90 backdrop-blur-sm">
        <SheetTrigger>
          <Menu size={32} className="text-white" />
        </SheetTrigger>
        <Link to={`/`}>
          <img
            src={logoImage}
            alt="Logo do sistema"
            className="w-16 h-16 ml-2"
          />
        </Link>
        <AvatarUser />
      </div>
      <SheetContent
        className="w-[80%] bg-secondary-50 text-zinc-50 border-0"
        side="left"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Talent Trace</SheetTitle>
        </SheetHeader>
        <SheetDescription className="flex flex-col justify-between">
          <section className="flex flex-col w-full gap-2 mt-12">
            <NavLink
              to="/"
              className={({ isActive }) =>
                ` w-full p-2 rounded flex gap-2 items-center text- ${
                  isActive
                    ? 'text-white bg-secondary-60 hover:opacity-90'
                    : 'text-secondary-40 bg-secondary-90/10'
                }`
              }
            >
              <House weight="fill" size={24} />
              Inicio
            </NavLink>
            <div className="flex flex-col items-start gap-2.5 self-stretch mt-2">
              <NavLink
                to="/comunidades"
                className={({ isActive }) =>
                  ` w-full p-2 rounded flex gap-2 items-center ${
                    isActive
                      ? 'text-white bg-secondary-60 hover:opacity-90'
                      : 'text-secondary-40 bg-secondary-90/10'
                  }`
                }
              >
                <SlackIcon size={24} />
                Comunidades
              </NavLink>
              <div className="flex items-start gap-2.5 pb-0 text-[#a5a5a5] text-xs leading-[normal]">
                Minhas comunidades
              </div>
              <div className="flex flex-col px-2 my-2">
                {menuComunidade &&
                  menuComunidade.map((item) => (
                    <Link
                      to={`/comunidade/${item.nameURL}`}
                      className="flex items-center gap-2"
                      key={item.nameURL}
                    >
                      <BadgeType type={item.tipo} variant="menu" />
                      <span className="line-clamp-1">{item.nome}</span>
                    </Link>
                  ))}
              </div>
              <NavLink
                to="/peneiras"
                className={({ isActive }) =>
                  ` w-full p-2 rounded flex gap-2 items-center ${
                    isActive
                      ? 'text-white bg-secondary-60 hover:opacity-90'
                      : 'text-secondary-40 bg-secondary-90/10'
                  }`
                }
              >
                <Flame size={24} />
                Peneiras
              </NavLink>
            </div>
          </section>
          <div className="w-full h-[2px] mt-8 bg-secondary-40" />
          <section className="flex flex-col items-start gap-3 mt-8 ">
            <div className="flex items-center gap-2" onClick={handleSetTheme}>
              {theme === 'light' ? (
                <Sun size={20} className="w-8 h-8" />
              ) : (
                <Moon size={20} className="w-8 h-8" />
              )}
              <span>Mudar tema</span>
            </div>
            <Button onClick={handleLogout} className="flex gap-2">
              <LogOut size={20} className="w-6 h-6 ml-[-12px]" />
              Sair
            </Button>
          </section>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
