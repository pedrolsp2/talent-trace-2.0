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
import { BadgePlus, Image, Loader } from 'lucide-react';
import { IPeneira, InfoUser } from '../../context/AuthProvider/type';
import { handleNewPeneira, userNewPeneira } from '../../context/hooks/getData';
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

export const NovaPeneira = (props: value) => {
  const { register, handleSubmit } = useForm<IPeneira>();
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [horario, setHorario] = useState<string>('');
  const [minimo, setMinimo] = useState(0);
  const queryClient = useQueryClient();

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

  const onSubmit = async (data: IPeneira) => {
    const id = Math.floor(Math.random() * 10000);
    let coverURL = '';

    try {
      if (coverFile) {
        const resultCover = await uploadImageToFirebase(coverFile, 'peneiras');
        coverURL = resultCover.url;
      }
      handleNewPeneira({
        descricaoPeneira: data.descricaoPeneira,
        idadeMinima: data.idadeMinima,
        nomePeneira: data.nomePeneira,
        tipoDesejo: data.tipoDesejo,
        dataPeneira: data.dataPeneira,
        fotoOlheiro: props.userData.fotoPerfil,
        id_peneira: id,
        nomeLocal: data.nomeLocal,
        cidade: data.cidade,
        local: data.local,
        idadeMaxima: data.idadeMaxima,
        nomeOlheiro: props.userData.user,
        dataCriação: new Date(),
        obs: data.obs,
        banner: coverURL,
      });
      userNewPeneira(
        props.userData?.id_user || 0,
        id,
        data.nomePeneira,
        props.userData.username,
        props.userData.fotoPerfil,
        props.userData.email,
        Number(props.userData.cref)
      );
    } catch (error) {
      console.error('Erro ao inserir:', error);
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: onSubmit,

    onSuccess() {
      queryClient.invalidateQueries(['listPeneira']);
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
                Criar Peneira
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="p-4 bg-white dark:bg-dark-TT2 dark:border-dark-TT3">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold dark:text-zinc-300">
                Nova Peneira
              </DialogTitle>
              <DialogDescription className="dark:text-zinc-400">
                Olheiro, crie peneiras para prospectar atletas!
              </DialogDescription>
            </DialogHeader>{' '}
            <form onSubmit={handleSubmit(mutate)} className="pt-4 space-y-4">
              <Input
                {...register('nomePeneira', { required: true })}
                id="nomePeneira"
                type="text"
                placeholder="Titulo para peneira"
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
                  </div>
                  <Input
                    {...register('banner', { required: true })}
                    type="file"
                    onChange={handleFileChangeCapa}
                    accept="image/jpeg, image/png"
                    className="w-auto text-sm border border-gray-200 cursor-pointer rounded-xl bg-slate-50 placeholder:text-gray-500"
                    id="foto-perfil"
                  />
                </div>
                <Input
                  {...register('descricaoPeneira', { required: true })}
                  id="descricaoPeneira"
                  placeholder="Descrição da peneira"
                  className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                />
                <div className="flex items-center gap-2">
                  <Input
                    {...register('cidade', { required: true })}
                    id="cidade"
                    placeholder="Cidade da peneira"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                  <Input
                    {...register('nomeLocal', { required: true })}
                    id="nomeLocal"
                    placeholder="Local da peneira"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                </div>
                <Input
                  {...register('local', { required: true })}
                  id="local"
                  placeholder="URL maps do local"
                  className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                />
                <div className="flex items-center gap-2">
                  <Input
                    {...register('dataPeneira', { required: true })}
                    id="dataPeneira"
                    type="date"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                  <Input
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    id="dataPeneira.seconds"
                    type="time"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    {...register('idadeMinima', { required: true })}
                    value={minimo}
                    min={0}
                    onChange={(e) => setMinimo(Number(e.target.value))}
                    id="idadeMinima"
                    type="number"
                    placeholder="Idade mínima"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                  <Input
                    {...register('idadeMaxima', { required: true })}
                    min={minimo}
                    id="idadeMaxima"
                    type="number"
                    placeholder="Idade máxima"
                    className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                  />
                </div>
                <select
                  {...register('tipoDesejo', { required: true })}
                  name="tipoDesejo"
                  className="p-2 bg-transparent border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                >
                  <option
                    value="Atacante"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Atacante
                  </option>
                  <option
                    value="Meia"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Meia
                  </option>
                  <option
                    value="Ponta"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Ponta
                  </option>
                  <option
                    value="Volante"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Volante
                  </option>
                  <option
                    value="Zagueiro"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Zagueiro
                  </option>
                  <option
                    value="Goleiro"
                    className="dark:border-dark-TT3 dark:bg-dark-T"
                  >
                    Goleiro
                  </option>
                </select>
                <Input
                  {...register('obs', { required: true })}
                  id="obs"
                  placeholder="Observações da peneira"
                  className="p-2 border border-gray-300 rounded dark:text-zinc-300 dark:border-dark-TT3"
                />
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
