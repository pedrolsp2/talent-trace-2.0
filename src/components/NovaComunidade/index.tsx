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
import { BadgePlus, Image, Loader } from 'lucide-react';
import { ComunidadeProps, InfoUser } from '../../context/AuthProvider/type';
import {
  handleNewComunidade,
  userNewComunidade,
} from '../../context/hooks/getData';
import { useState } from 'react';
import { firebase as fb } from '../../services/firebase/firebasestorageconfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const queryClient = useQueryClient();

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

  const uploadImageToFirebase = async (
    file: File,
    folder: string
  ): Promise<{ url: string; name: string }> => {
    // Gerar um nome aleatório para o arquivo
    const randomFileName =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      '_' +
      file.name;

    // Criar uma referência para o arquivo no Firebase Storage
    const fileRef = fb.storage().ref().child(`${folder}/${randomFileName}`);

    // Fazer o upload do arquivo
    await fileRef.put(file);

    // Obter a URL de download
    const downloadURL = await fileRef.getDownloadURL();

    return { url: downloadURL, name: randomFileName };
  };

  const handleFileChangeCapa = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const fileURL = URL.createObjectURL(file);
      setPreviewCover(fileURL);
    }
  };

  const onSubmit = async (data: ComunidadeProps) => {
    const id = Math.floor(Math.random() * 10000);
    const dataCr = new Date();
    const nameURL = transformString(data.nome);
    let coverURL = '';

    try {
      if (coverFile) {
        const resultCover = await uploadImageToFirebase(
          coverFile,
          'comunidades'
        );
        coverURL = resultCover.url;
      }
      handleNewComunidade({
        banner: coverURL,
        fotoOlheiro: props.userData.fotoPerfil || '',
        descricao: data.descricao,
        nome: data.nome,
        tipo: data.tipo,
        id_olheiro: props.userData.id_user,
        id_comunidade: id,
        dataCriacao: dataCr,
        nameURL: nameURL,
      });
      userNewComunidade(
        props.userData?.id_user || 0,
        nameURL || '',
        data.tipo || '',
        data.nome || ''
      );
    } catch (error) {
      console.error('Erro ao inserir:', error);
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: onSubmit,

    onSuccess() {
      queryClient.invalidateQueries(['comunidades']);
      setStatus(!status);
    },
  });

  return (
    <Dialog open={status}>
      {isLoading ? (
        <span className="animate-spin text-primary-50">
          <Loader />
        </span>
      ) : (
        <>
          <DialogTrigger
            className="flex items-center gap-2.5 py-1 px-2 rounded border border-[#129f62] bg-[#14af6c]"
            onClick={() => setStatus(!status)}
          >
            <BadgePlus size={18} className="text-white" />
            {!isMobileDevice() && (
              <div className="text-[#e8f7f0] text-xs font-medium">
                Criar comunidade
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="p-4 bg-white dark:bg-dark-TT2 dark:border-dark-TT3">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold dark:text-zinc-300">
                Nova comunidade
              </DialogTitle>
              <DialogDescription className="dark:text-zinc-400">
                Olheiro, crie comunidades para interagir com outros olheiros e
                jogadores.
              </DialogDescription>
            </DialogHeader>{' '}
            <form onSubmit={handleSubmit(mutate)} className="pt-4 space-y-4">
              <Input
                {...register('nome', { required: true })}
                id="nome"
                type="text"
                placeholder="Qual o nome da sua comunidade?"
                className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
              />
              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-[74px,1fr] items-center gap-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800">
                    {previewCover ? (
                      <img
                        src={previewCover}
                        alt="Imagem de capa"
                        className="object-cover w-20 h-20 rounded-full"
                      />
                    ) : (
                      <Image size={32} className="text-zinc-400" />
                    )}
                  </div>{' '}
                  <Input
                    {...register('banner', { required: true })}
                    type="file"
                    onChange={handleFileChangeCapa}
                    accept="image/jpeg, image/png"
                    className="w-auto text-sm border border-gray-200 cursor-pointer rounded-xl bg-slate-50 placeholder:text-gray-500"
                    id="foto-perfil"
                  />
                </div>
                <Textarea
                  {...register('descricao', { required: true })}
                  id="descricao"
                  placeholder="De uma breve descrição sobre o que é a comunidade"
                  className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                />
                <select
                  {...register('tipo', { required: true })}
                  name="tipo"
                  className="p-2 bg-transparent border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                >
                  <option
                    value="Peneiras"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Peneiras
                  </option>
                  <option
                    value="Curiosidades"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Curiosidades
                  </option>
                  <option
                    value="Treinos"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Treinos
                  </option>
                </select>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setStatus(!status)}
                  className="px-4 py-2 text-white rounded bg-secondary-50 hover:bg-secondary-40"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#14af6c] text-white py-2 px-4 rounded hover:bg-[#129f62]"
                >
                  Criar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
