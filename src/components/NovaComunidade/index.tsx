import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { BadgePlus } from 'lucide-react';
import { ComunidadeProps, InfoUser } from '../../context/AuthProvider/type';
import { handleNewComunidade } from '../../context/hooks/getData';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface value {
  userData: InfoUser;
}

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

interface AccentsMapType {
  [key: string]: string;
}

export const NovaComunidade = (props: value) => {
  const { register, handleSubmit } = useForm<ComunidadeProps>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const accentsMap: AccentsMapType = {
    a: '[àáâãäå]',
    e: '[èéêë]',
    i: '[ìíîï]',
    o: '[òóôõö]',
    u: '[ùúûü]',
    c: 'ç',
    n: 'ñ',
    z: 'źžż',
    s: 'ßšś',
    l: 'ł',
    r: 'ř',
    y: 'ýÿ',
    t: 'ť',
  };

  function transformString(str: string): string {
    let newStr = str.toLowerCase();
    for (const letter in accentsMap) {
      const regex = new RegExp(accentsMap[letter], 'g');
      newStr = newStr.replace(regex, letter);
    }
    return newStr.replace(/\s+/g, '-');
  }

  const onSubmit = async (data: ComunidadeProps) => {
    const id = Math.floor(Math.random() * 10000);
    const dataCr = new Date();
    const nameURL = transformString(data.nome);

    try {
      handleNewComunidade({
        banner: 'https://github.com/pedrolsp2.png',
        fotoOlheiro: props.userData.fotoPerfil || '',
        descricao: data.descricao,
        nome: data.nome,
        tipo: data.tipo,
        id_olheiro: props.userData.id_user,
        id_comunidade: id,
        dataCriacao: dataCr,
        nameURL: nameURL,
      });
      toast({
        variant: 'default',
        title: 'Sucesso!',
        description: 'Post cadastrado com sucesso.',
      });
      setTimeout(() => {
        navigate('/comunidade/' + nameURL);
      }, 2000);
    } catch (error) {
      console.error('Erro ao inserir:', error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2.5 py-1 px-2 rounded border border-[#129f62] bg-[#14af6c]">
        <BadgePlus size={18} className="text-white" />
        {!isMobileDevice() && (
          <div className="text-[#e8f7f0] text-xs font-medium leading-[normal]">
            Criar comunidade
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-dark-TT dark:border-dark-TT2">
        <DialogHeader>
          <DialogTitle className="dark:text-zinc-300">
            Nova comunidade
          </DialogTitle>
          <DialogDescription className="dark:text-zinc-400">
            Olheiro, crie comunidades para interagir com outros olheiros e
            jogadores.
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('nome', { required: true })}
              id="nome"
              type="text"
              placeholder="Qual o nome da sua comunidade?"
              className="dark:text-zinc-300"
            />
            <div className="flex flex-col w-full p-2">
              <div className="grid grid-cols-[74px,1fr] items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-400 dark:bg-dark-TT2">
                  <img
                    src="https://github.com/pedrolsp2.png"
                    alt="Foto da comunidade"
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <span className="dark:text-zinc-300">
                  Banner para sua comunidade
                </span>
              </div>
              <Textarea
                {...register('descricao', { required: true })}
                id="descricao"
                placeholder="De uma breve descrição de sobre o que é a comunidade"
                className="dark:text-zinc-300"
              />
              <select {...register('tipo', { required: true })} name="tipo">
                <option value="Peneiras">Peneiras</option>
                <option value="Curiosidades">Curiosidades</option>
                <option value="Treinos">Treinos</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
