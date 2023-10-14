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
import { ContentComunidade, InfoUser } from '../../context/AuthProvider/type';
import { handleNewContentComundiade } from '../../context/hooks/getData';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface value {
  userData: InfoUser;
  fetch?: () => void;
}

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export const NovoPost = (props: value) => {
  const { register, handleSubmit } = useForm<ContentComunidade>();
  const { name } = useParams<{ name: string }>();

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['comunidade_contet']);
    },
  });

  const onSubmit = async (data: ContentComunidade) => {
    try {
      handleNewContentComundiade({
        nameURL: name || '',
        conteudo: data.conteudo,
        titulo: data.titulo,
        tipo: data.tipo,
        nomeOlheiro: props.userData.user,
        fotoOlheiro: props.userData.fotoPerfil,
        img: data.img || '',
      });
      mutate();
      queryClient.invalidateQueries(['comunidade_contet']);
    } catch (error) {
      console.error('Erro ao inserir:', error);
    }
  };
  if (isLoading) {
    return <p>Carregando...</p>;
  }
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2.5 py-1 px-2 rounded border border-[#129f62] bg-[#14af6c]">
        {props.userData.cref && (
          <>
            <BadgePlus size={18} className="text-white" />
            {!isMobileDevice() && (
              <div className="text-[#e8f7f0] text-xs font-medium leading-[normal]">
                Novo Post
              </div>
            )}
          </>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-dark-TT dark:border-dark-TT2">
        <DialogHeader>
          <DialogTitle className="dark:text-zinc-300"></DialogTitle>
          <DialogDescription className="dark:text-zinc-400">
            Olheiro, crie comunidades para interagir com outros olheiros e
            jogadores.
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('titulo', { required: true })}
              id="titulo"
              type="text"
              placeholder="Titulo do post"
              className="dark:text-zinc-300"
            />
            <div className="flex flex-col w-full p-2">
              <Textarea
                {...register('conteudo', { required: true })}
                id="conteudo"
                placeholder="Conteudo do post"
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
