import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { House, Moon, SidebarSimple, Sun } from '@phosphor-icons/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
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
import { fetchDataUser } from '../../context/hooks/getData';
import { BadgeCheck, SlackIcon } from 'lucide-react';

export function SideBar() {
  const location = useLocation();
  const [isOlheiro, setIsOlheiro] = useState(false);
  const currentRouteRef = useRef<{ current: string } | null>(null);
  const [home, setHome] = useState(false);
  const [comunidades, setComunidades] = useState(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [user, setUser] = useState<InfoUser | null>(null);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  );
  const navigate = useNavigate();
  const auth = useAuth();
  const data = getUserLocalStorage();
  const email = data[0];
  const [userData, setUserData] = useState<InfoUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataUser(email || '');
      setUserData((data as InfoUser) || null);
    };
    fetchData();
  }, [email]);

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
      document.querySelector('html')?.setAttribute('data-mode', 'dark');
    }
    if (theme === 'dark') {
      setTheme('light');
      document.querySelector('html')?.setAttribute('data-mode', 'light');
    }
  };

  useEffect(() => {
    const theme: string = 'light';
    localStorage.setItem('theme', theme);
    const localTheme: string | null = localStorage.getItem('theme');
    document
      .querySelector('html')
      ?.setAttribute('data-mode', localTheme || 'light');
  }, [theme]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataUser(email);
      if (data) {
        if (data.cref) {
          setIsOlheiro(true);
        }
        setUser(data as InfoUser);
      } else {
        setUser(null);
      }
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    currentRouteRef.current = { current: location.pathname };
    const currentPath = currentRouteRef.current.current;
    switch (currentPath) {
      case '/':
        setHome(true);
        setComunidades(false);
        break;
      case '/comunidades':
        setHome(false);
        setComunidades(true);
        break;
    }
  }, [location.pathname]);

  function handleLogout() {
    try {
      auth.logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  if (!toggle) {
    return (
      <div
        className="w-20 dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between items-center h-screen sticky top-0 py-2"
        id="side-bar"
      >
        <div>
          <span className="text-white font-bold text-lg flex items-center justify-center">
            <SidebarSimple
              size={32}
              className="cursor-pointer"
              onClick={() => setToggle(!toggle)}
            />
          </span>
          <div className="mt-8 flex flex-col gap-2">
            <span
              onClick={() => navigate('/')}
              className={`flex gap-4 p-2 rounded-xl items-center justify-center ${
                home ? 'bg-secondary-40' : ''
              } text-white text-xl cursor-pointer hover:bg-secondary-40`}
            >
              {home ? (
                <House weight="fill" size={24} />
              ) : (
                <House
                  size={24}
                  className=" dark:text-secondary-40 dark:hover:text-secondary-20"
                />
              )}
            </span>
            <span
              onClick={() => navigate('/comunidades')}
              className={`flex gap-4 p-2 rounded-xl items-center justify-center ${
                comunidades ? 'bg-secondary-40' : ''
              } text-white text-xl cursor-pointer hover:bg-secondary-40`}
            >
              {comunidades ? (
                <SlackIcon
                  size={24}
                  className=" dark:text-secondary-30 dark:hover:text-secondary-10"
                />
              ) : (
                <SlackIcon
                  size={24}
                  className=" dark:text-secondary-40 dark:hover:text-secondary-20"
                />
              )}
            </span>
          </div>
        </div>
        <Sheet>
          <SheetTrigger>
            <Avatar
              className={`w-10 h-10 ${
                isOlheiro && 'border-2 border-primary-50'
              }`}
            >
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={user?.fotoPerfil} alt="Pedro Lucas" />
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
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              ) : (
                <Moon
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              )}
              <Button onClick={handleLogout}>Sair</Button>
              <Button onClick={() => navigate(`/user/${userData?.username}`)}>
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
      className="w-[14rem] dark:bg-dark-TT2 bg-secondary-50 flex flex-col justify-between h-screen sticky top-0"
      id="side-bar"
    >
      <div className="py-4">
        <span className="text-white font-bold text-lg flex items-center justify-between p-2">
          Talent Trace
          <SidebarSimple
            size={32}
            className="cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
        </span>
        <div className="p-2 mt-8 flex flex-col gap-2">
          <span
            onClick={() => navigate('/')}
            className={`flex gap-4 p-2 rounded-xl items-center ${
              home ? 'bg-secondary-40 ' : ''
            } text-white text-lg cursor-pointer hover:bg-secondary-40`}
          >
            {home ? (
              <House weight="fill" size={22} />
            ) : (
              <House size={22} className=" dark:text-secondary-20" />
            )}
            <span className="text-base">Inicio</span>
          </span>
          <div className="flex flex-col items-start gap-2.5 self-stretch mt-2">
            <Link
              to="/comunidades"
              className="flex items-start gap-2.5 self-stretch py-1 px-0 border-b border-b-[#4a1ecb] text-white text-sm leading-[normal] cursor-pointer"
            >
              Comunidades
            </Link>
            <div className="flex items-start gap-2.5 pb-0 text-[#a5a5a5] text-xs leading-[normal]">
              Minha comunidades
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3">
        <Sheet>
          <SheetTrigger>
            <Avatar
              className={`w-10 h-10 ${
                isOlheiro && 'border-2 border-primary-50'
              }`}
            >
              <AvatarFallback>
                <Skeleton className="w-10 h-10 rounded-full bg-secondary-40" />
              </AvatarFallback>
              <AvatarImage src={user?.fotoPerfil} alt="Pedro Lucas" />
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
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              ) : (
                <Moon
                  size={20}
                  className="cursor-pointer h-10 w-10 bg-gray-300 border border-gray-200 dark:bg-dark-TT p-2 rounded-2xl"
                  onClick={handleSetTheme}
                />
              )}
              <Button onClick={handleLogout}>Sair</Button>
              <Button onClick={() => navigate(`/user/${userData?.username}`)}>
                Editar Perfil
              </Button>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <span className="text-white font-semibold text-lg line-clamp-1 flex items-center gap-1">
          {user?.user}
          {isOlheiro && <BadgeCheck size={16} color="#14AF6C" />}
        </span>
      </div>
    </div>
  );
}
