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
import { useForm } from 'react-hook-form';
import { BadgePlus } from 'lucide-react';
import { ContentComunidade, InfoUser } from '../../context/AuthProvider/type';
import { handleNewContentComundiade } from '../../context/hooks/getData';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

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
  const [editorContent, setEditorContent] = useState<string>('');

  const quillModules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic'], // Botões para negrito e itálico
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['comunidade_contet']);
    },
  });

  const onSubmit = async (data: ContentComunidade) => {
    const id = Math.floor(Math.random() * 10000);
    try {
      handleNewContentComundiade({
        id_content: Number(id),
        nameURL: name || '',
        conteudo: editorContent,
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
      <DialogContent className="p-4 bg-white dark:bg-dark-TT2 dark:border-dark-TT3">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold dark:text-zinc-300">
            Novo Post
          </DialogTitle>
          <DialogDescription className="dark:text-zinc-400">
            Post tópicos com contexto da sua comundiade!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('titulo', { required: true })}
            id="titulo"
            type="text"
            placeholder="Título do post"
            className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
          />
          <div className="flex flex-col p-2 space-y-2">
            <ReactQuill
              value={editorContent}
              onChange={(content) => setEditorContent(content)}
              placeholder="Conteúdo do post"
              modules={quillModules}
              className="dark:text-zinc-200"
            />
            <select
              {...register('tipo', { required: true })}
              name="tipo"
              className="p-2 bg-transparent border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
            >
              <option
                value="Peneiras"
                className="dark:border-dark-TT dark:bg-dark-TT2"
              >
                Peneiras
              </option>
              <option
                value="Curiosidades"
                className="dark:border-dark-TT dark:bg-dark-TT2"
              >
                Curiosidades
              </option>
              <option
                value="Treinos"
                className="dark:border-dark-TT dark:bg-dark-TT2"
              >
                Treinos
              </option>
            </select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#14af6c] text-white py-2 px-4 rounded hover:bg-[#129f62]"
            >
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
