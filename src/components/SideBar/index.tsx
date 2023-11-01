import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { House, Moon, SidebarSimple, Sun } from '@phosphor-icons/react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { InfoUser } from '../../context/AuthProvider/type';
import { getUserLocalStorage } from '../../context/AuthProvider/uitl';
import { Skeleton } from '../ui/skeleton';
import { fetchDataUser, fetchMyCom } from '../../context/hooks/getData';
import { BadgeCheck, Flame, LogOut, SlackIcon, User } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeType } from '../BadgeType';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type IComunidade = {
  nameURL: string;
  nome: string;
  tipo: 'Peneiras' | 'Curiosidades' | 'Treinos';
};

export function SideBar() {
  const [toggle, setToggle] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') ? localStorage.getItem('theme')! : 'light'
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const auth = useAuth();
  const storoga = getUserLocalStorage();
  const email = storoga[0];

  const fetchData = async (): Promise<InfoUser | null> => {
    const data = await fetchDataUser(email || '');
    if (data) {
      return data as InfoUser;
    } else {
      return null;
    }
  };

  const { data, isLoading } = useQuery({
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

  const handleResize = () => {
    if (window.innerWidth < 900) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };

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

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleLogout() {
    try {
      auth.logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return (
      <Skeleton
        className="w-[14rem] dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between items-center h-screen sticky top-0 py-2"
        id="side-bar"
      ></Skeleton>
    );
  }

  if (!toggle) {
    return (
      <div
        className="sticky top-0 flex flex-col items-center justify-between w-20 h-screen py-2 text-white dark:bg-dark-TT2 bg-secondary-50"
        id="side-bar"
      >
        <div className="flex flex-col items-center w-full p-1">
          <span className="flex items-center justify-center text-lg font-bold text-white">
            <SidebarSimple
              size={32}
              className="cursor-pointer"
              onClick={() => setToggle(!toggle)}
            />
          </span>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mt-8 p-3 rounded grid items-center justify-center ${
                isActive
                  ? 'text-white bg-secondary-60 hover:opacity-90'
                  : 'text-secondary-40 bg-secondary-90/10 '
              }`
            }
          >
            <House weight="fill" size={24} />
          </NavLink>
          <NavLink
            to="/comunidades"
            className={({ isActive }) =>
              `mt-2 p-3 rounded grid items-center justify-center ${
                isActive
                  ? 'text-white bg-secondary-60 hover:opacity-90'
                  : 'text-secondary-40 bg-secondary-90/10 '
              }`
            }
          >
            <SlackIcon size={24} />
          </NavLink>
          <NavLink
            to="/peneiras"
            className={({ isActive }) =>
              `mt-2 p-3 rounded grid items-center justify-center ${
                isActive
                  ? 'text-white bg-secondary-60 hover:opacity-90'
                  : 'text-secondary-40 bg-secondary-90/10 '
              }`
            }
          >
            <Flame size={24} />
          </NavLink>
        </div>
        <Sheet>
          <SheetTrigger>
            <Avatar
              className={`w-10 h-10 ${
                data?.cref && 'border-2 border-primary-50'
              }`}
            >
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={data?.fotoPerfil} alt="Pedro Lucas" />
            </Avatar>
          </SheetTrigger>
          <SheetContent
            className="z-[999999999] w-[400px] sm:w-[540px] bg-slate-50 dark:bg-dark-TT2 dark:border-x-dark-TT dark:text-zinc-50 text-zinc-900"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>Ações rapidas do perfil</SheetTitle>
            </SheetHeader>
            <SheetDescription>
              {theme === 'light' ? (
                <Sun
                  size={20}
                  className="w-10 h-10 p-2 bg-gray-300 border border-gray-200 cursor-pointer dark:bg-dark-TT rounded-2xl"
                  onClick={handleSetTheme}
                />
              ) : (
                <Moon
                  size={20}
                  className="w-10 h-10 p-2 bg-gray-300 border border-gray-200 cursor-pointer dark:bg-dark-TT rounded-2xl"
                  onClick={handleSetTheme}
                />
              )}
              <Button onClick={handleLogout}>Sair</Button>
              <Button onClick={() => navigate(`/user/${data?.username}`)}>
                Editar Perfil
              </Button>
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div
      className="w-[14rem] dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between h-screen sticky top-0 text-white"
      id="side-bar"
    >
      <div className="py-4">
        <span className="flex items-center justify-between p-2 text-lg font-bold text-white">
          Talent Trace
          <SidebarSimple
            size={32}
            className="cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
        </span>
        <div className="flex flex-col p-2 mt-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              ` w-full p-2 rounded flex gap-2 items-center justify-center${
                isActive
                  ? 'text-white bg-secondary-60 hover:opacity-90'
                  : 'text-secondary-40 bg-secondary-90/10'
              }`
            }
          >
            <House weight="fill" size={18} />
            Inicio
          </NavLink>
          <div className="flex flex-col items-start gap-2.5 self-stretch mt-2">
            <NavLink
              to="/comunidades"
              className={({ isActive }) =>
                ` w-full p-2 rounded flex gap-2 items-center justify-center${
                  isActive
                    ? 'text-white bg-secondary-60 hover:opacity-90'
                    : 'text-secondary-40 bg-secondary-90/10'
                }`
              }
            >
              <SlackIcon size={18} />
              Comunidades
            </NavLink>
            <div className="flex items-start gap-2.5 pb-2 text-[#c7c7c7] text-xs leading-[normal] border-b border-b-secondary-40 dark:border-b-zinc-800 w-full">
              Minhas comunidades
            </div>
            <div className="flex flex-col px-2 my-2">
              {menuComunidade &&
                menuComunidade.map((item) => (
                  <Link
                    onClick={() =>
                      queryClient.invalidateQueries(['comunidade_contet'])
                    }
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
                ` w-full p-2 rounded flex gap-2 items-center justify-center${
                  isActive
                    ? 'text-white bg-secondary-60 hover:opacity-90'
                    : 'text-secondary-40 bg-secondary-90/10'
                }`
              }
            >
              <Flame size={18} />
              Peneiras
            </NavLink>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar
              className={`w-10 h-10 ${
                data?.cref && 'border-2 border-primary-50'
              }`}
            >
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={data?.fotoPerfil} alt="Pedro Lucas" />
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="ml-1 w-44 text-zinc-300 dark:border-dark-TT3 border-secondary-30">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-secondary-30 dark:bg-dark-TT3" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer hover:dark:bg-dark-T hover:bg-secondary-40"
                onClick={() => navigate(`/user/${data?.username}`)}
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer hover:dark:bg-dark-T hover:bg-secondary-40"
                onClick={handleSetTheme}
              >
                {theme === 'light' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span>Mudar tema</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-secondary-30 dark:bg-dark-TT3" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer hover:dark:bg-dark-T hover:bg-secondary-40"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="flex items-center gap-1 text-lg font-semibold text-white line-clamp-1">
          {data?.user}
          {data?.cref && <BadgeCheck size={16} color="#14AF6C" />}
        </span>
      </div>
    </div>
  );
}
