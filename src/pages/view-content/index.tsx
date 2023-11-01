import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  fetchAnswersComunidade,
  fetchContentPostComunidade,
  fetchDataUser,
  newAnswerContent,
} from '../../context/hooks/getData';
import { IConent, InfoUser } from '../../context/AuthProvider/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeType } from '@/components/BadgeType';
import { Heart, Loader } from 'lucide-react';
import { Separator } from '@/components/Separator';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import { getUserLocalStorage } from '@/context/AuthProvider/uitl';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

interface IAnswers {
  foto: string;
  conteudo: string;
  nome: string;
  id_content: number;
  id_user: number;
}

export const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const [editorContent, setEditorContent] = useState<string>('');
  const queryCliente = useQueryClient();
  const stroage = getUserLocalStorage();
  const email = stroage[0];

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

  const getContent = async (): Promise<IConent> => {
    return (await fetchContentPostComunidade(Number(id))) as IConent;
  };

  const fetchData = async (): Promise<InfoUser> => {
    const userData = await fetchDataUser(email);
    if (userData) {
      return userData as InfoUser;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const newAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    userData &&
      data &&
      (await newAnswerContent(
        userData?.id_user,
        data?.id_content,
        userData?.user,
        userData?.fotoPerfil,
        editorContent
      ));
  };

  const getAnswers = async (): Promise<IAnswers[]> => {
    return (await fetchAnswersComunidade(Number(id))) as IAnswers[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: getContent,
  });

  const { data: userData } = useQuery({
    queryKey: ['user', id],
    queryFn: fetchData,
  });

  const { data: dataAnswers } = useQuery({
    queryKey: ['answer', id],
    queryFn: getAnswers,
  });

  const { mutate, isLoading: isLoadingMutate } = useMutation({
    mutationFn: (e: React.FormEvent) => newAnswers(e),
    onSuccess() {
      queryCliente.invalidateQueries({ queryKey: ['answer', id] });
      setEditorContent('');
    },
  });

  if (isLoading) {
    return (
      <div className="w-12 h-12 mx-auto my-8">
        <Lottie animationData={animation} loop={true} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col p-2">
        <div className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
          <Avatar>
            <AvatarFallback>FT</AvatarFallback>
            <AvatarImage src={data?.fotoOlheiro} />'
          </Avatar>
          <div className="flex flex-col gap-5 px-2">
            <div className="flex flex-col">
              <span className="text-[#747474] dark:text-zinc-300 text-md">
                {data?.nomeOlheiro}
              </span>
              <div className="flex gap-2 datas-center">
                <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                  {data?.titulo}
                </span>
                <BadgeType
                  type={data?.tipo || 'Curiosidades'}
                  variant="default"
                />
              </div>
            </div>
            <div className="dark:text-zinc-300">
              <div dangerouslySetInnerHTML={{ __html: data?.conteudo || '' }} />
            </div>
            <span className="flex gap-2 ml-auto datas-center">
              <Heart size={24} className="cursor-pointer text-zinc-500" />
            </span>
          </div>
        </div>
      </div>
      <Separator />
      <form onSubmit={(e) => mutate(e)} className="flex flex-col gap-2 p-2">
        <article className="grid grid-cols-[auto,1fr] gap-2">
          <Avatar>
            <AvatarFallback>FT</AvatarFallback>
            <AvatarImage src={userData?.fotoPerfil} />
          </Avatar>
          <ReactQuill
            value={editorContent}
            onChange={(content) => setEditorContent(content)}
            placeholder={`Digite uma respota para ${data?.nomeOlheiro}`}
            modules={quillModules}
            className="dark:text-zinc-200 min-h-[150px]"
          />
        </article>
        <Button
          type="submit"
          className="px-6 py-5 mt-12 ml-auto bg-secondary-40 text-zinc-50 rounded-xl hover:bg-secondary-50"
        >
          {isLoadingMutate ? (
            <div className="animate-spin">
              <Loader />
            </div>
          ) : (
            'Responder'
          )}
        </Button>
      </form>
      <Separator />
      {dataAnswers &&
        dataAnswers.map((item) => (
          <div key={item.id_content}>
            <div className="grid grid-cols-[2.25rem,1fr] gap-2 px-2 py-3 w-full border border-zinc-100 dark:border-dark-TT2">
              <Avatar>
                <AvatarFallback>FT</AvatarFallback>
                <AvatarImage src={item.foto} />'
              </Avatar>
              <div className="flex flex-col gap-5 px-2">
                <div className="flex flex-col">
                  <span className="text-[#3c3c3c] dark:text-zinc-200 font-semibold text-xl">
                    {item.nome}
                  </span>
                </div>
                <div className="dark:text-zinc-300">
                  <div dangerouslySetInnerHTML={{ __html: item.conteudo }} />
                </div>
                <span className="flex gap-2 ml-auto datas-center">
                  <Heart size={24} className="cursor-pointer text-zinc-500" />
                </span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
