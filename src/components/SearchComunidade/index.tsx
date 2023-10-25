import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandList,
  CommandGroup,
  CommandItem,
} from '../ui/command';
import { useEffect, useState } from 'react';
import { ComunidadeProps } from '../../context/AuthProvider/type';
import { fetchComunidadeNames } from '../../context/hooks/getData';
import { BadgeType } from '../BadgeType';
import { Link } from 'react-router-dom';

export const SearchComunidade = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ComunidadeProps[]>();
  const [name, setName] = useState<string>('');

  const fetchComunidades = async (nome: string): Promise<ComunidadeProps[]> => {
    const dataComunidade = await fetchComunidadeNames(nome || '');
    if (dataComunidade) {
      return dataComunidade as ComunidadeProps[];
    } else {
      return [];
    }
  };

  async function handleChangeKey(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    setData(await fetchComunidades(value));
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div
      className="flex items-center justify-between w-64 px-2 py-2 border rounded dark:border-zinc-700"
      onClick={() => setOpen((open) => !open)}
    >
      <span className="text-sm dark:text-zinc-700 text-zinc-400">
        Procurar comunidade
      </span>
      <p className="text-sm text-muted-foreground">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center px-3 border-b">
          <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
          <input
            type="text"
            placeholder="Pesquise uma comunidade"
            className="w-full h-12 bg-transparent outline-none focus:border-none"
            onChange={handleChangeKey}
            value={name}
          />
        </div>
        <CommandGroup heading="Comunidades">
          {data ? (
            data?.map((comunidade) => (
              <CommandList key={comunidade.id_comunidade}>
                <Link to={`/comunidade/${comunidade.nameURL}`}>
                  <CommandItem>
                    <BadgeType type={comunidade.tipo} variant="menu" />
                    <span className="ml-2">{comunidade.nome}</span>
                  </CommandItem>
                </Link>
              </CommandList>
            ))
          ) : (
            <h1 className="text-sm text-center">Sem resultados.</h1>
          )}
        </CommandGroup>
      </CommandDialog>
    </div>
  );
};
