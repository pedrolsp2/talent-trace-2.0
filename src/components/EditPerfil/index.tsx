import React, { useState, useEffect } from 'react';
import firebase from '@/services/firebase/config';
import { firebase as fb } from '@/services/firebase/firebasestorageconfig';
import { useQuery } from '@tanstack/react-query';
import { InfoUser as UserInfo } from '@/context/AuthProvider/type';
import { fetchDataUser } from '@/context/hooks/getData';
import { getUserLocalStorage } from '@/context/AuthProvider/uitl';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { FileEdit } from 'lucide-react';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

const EditPerfil = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id_user: 0,
    idade: '',
    email: '',
    fotoPerfil: '',
    fotoCapa: '',
    estado: '',
    user: '',
    perna: '',
    peso: '',
    cidade: '',
    posicao: '',
    password: '',
    altura: '',
    cpf: '',
    cref: '',
    dataNascimento: '',
    username: '',
  });
  const stroage = getUserLocalStorage();
  const email = stroage[0];

  const fetchData = async (): Promise<UserInfo> => {
    const userData = await fetchDataUser(email);
    if (userData) {
      return userData as UserInfo;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  const { data: userData } = useQuery<UserInfo>({
    queryKey: ['user'],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const storageRef = fb.storage().ref(`/capa/${file.name}`);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        'state_changed',
        (error) => {
          console.log(error);
        },
        () => {
          storageRef.getDownloadURL().then((url) => {
            setUserInfo({ ...userInfo, fotoPerfil: url });
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(userInfo.id_user.toString())
        .set(userInfo);
      console.log('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  function createInputField(
    label: string,
    name: string,
    value: string,
    type: string = 'text'
  ) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-100"
        >
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className="block w-full p-2 mt-1 bg-transparent border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-dark-TT3"
        />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex justify-center items-center gap-2.5 py-2 px-3 rounded bg-primary-50 hover:bg-primary-40">
          <FileEdit size={24} color="#fff" />
          {!isMobileDevice() && (
            <div className="text-white text-sm font-bold leading-[100%]">
              Editar Perfil
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-dark-TT2 max-w-[850px] dark:border-dark-TT3">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-2 space-y-4"
        >
          {createInputField('Email', 'email', userInfo.email)}
          {createInputField('Username', 'username', userInfo.username)}
          {createInputField(
            'Password',
            'password',
            userInfo.password,
            'password'
          )}
          {createInputField('User', 'user', userInfo.user || '')}
          {userInfo.cref && (
            <>
              {createInputField('Cpf', 'cpf', userInfo.cpf || '')}
              {createInputField('Cref', 'cref', userInfo.cref || '')}
              {createInputField(
                'DataNascimento',
                'dataNascimento',
                userInfo.dataNascimento || ''
              )}
            </>
          )}
          {!userInfo.cref && (
            <>
              {createInputField('Idade', 'idade', userInfo.idade || '')}
              {createInputField('Estado', 'estado', userInfo.estado || '')}
              {createInputField('Cidade', 'cidade', userInfo.cidade || '')}
              {createInputField('Perna', 'perna', userInfo.perna || '')}
              {createInputField('Peso', 'peso', userInfo.peso || '')}
              {createInputField('Altura', 'altura', userInfo.altura || '')}
              {createInputField('Posicao', 'posicao', userInfo.posicao || '')}
            </>
          )}
          <div className="flex items-center w-full gap-2">
            <img
              src={userInfo.fotoPerfil}
              alt={userInfo.username}
              className="w-12 h-12 rounded-full"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border dark:border-dark-TT3 dark:text-neutral-200"
            />
          </div>
          <button
            type="submit"
            className="p-2 text-white rounded bg-primary-50"
          >
            Salvar Alterações
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditPerfil;
