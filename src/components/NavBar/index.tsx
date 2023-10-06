import logoImage from '../../assets/logo.svg';
import { Menu } from 'lucide-react';
import { AvatarUser } from '../AvatarUser';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { House } from '@phosphor-icons/react';
export function Navbar() {
  return (
    <Sheet>
      <div className="w-full h-16 flex justify-between items-center px-3 bg-secondary-60/90 backdrop-blur-sm">
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
        <SheetDescription>
          <section className="w-full flex flex-col mt-12 gap-2">
            <Link to={`/`} className="flex items-center gap-2 p-2">
              <House size={32} className="text-white" />
              Inicio
            </Link>
            <div className="flex flex-col items-start gap-2.5 self-stretch mt-20">
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
          </section>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
