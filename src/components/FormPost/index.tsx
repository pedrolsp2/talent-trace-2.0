import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { AvatarUser } from '../AvatarUser';
import { useToast } from '../ui/use-toast';
import {
  fetchNewPost,
  fetchNewAnswers,
  fetchPost,
} from '../../context/hooks/getData';
import { InfoUser, PostProps } from '../../context/AuthProvider/type';
import { useParams } from 'react-router-dom';
import { Image } from 'lucide-react';
import { firebase as fb } from '../../services/firebase/firebasestorageconfig';
import { useQueryClient } from '@tanstack/react-query';

type IForm = {
  value: InfoUser | null;
  answer?: boolean;
  fetch?: () => void;
};

export function FormPost(props: IForm) {
  const { toast } = useToast();
  const [post, setPost] = useState<PostProps | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [caracter, setCaracter] = useState(255);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  function handleNewContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const content = e.target.value;
    setNewContent(content);

    const lengthCount = content.length;
    setCaracter(255 - lengthCount);
  }

  const fetchData = async () => {
    try {
      const postData = await fetchPost(Number(id));
      if (postData) {
        setPost(postData as PostProps);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

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
    const fileRef = fb.storage().ref().child(`${folder}/${randomFileName}`);
    await fileRef.put(file);
    const downloadURL = await fileRef.getDownloadURL();
    return { url: downloadURL, name: randomFileName };
  };

  async function handleNewPost(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    let uploadedImageUrl = null;
    if (selectedImage) {
      const result = await uploadImageToFirebase(selectedImage, 'post');
      uploadedImageUrl = result.url;
    }

    if (!newContent) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Campo vazio.',
      });
    } else {
      try {
        if (props?.value && uploadedImageUrl) {
          fetchNewPost(props?.value, newContent, uploadedImageUrl);
        } else if (props?.value) {
          fetchNewPost(props?.value, newContent, '');
        }
        setNewContent('');
        setImageUrl(null);
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ['post'] });
      } catch (error) {
        console.error('Erro ao inserir:', error);
        setIsLoading(false);
      }
    }
  }

  async function handleNewAnswer(e: React.FormEvent) {
    setIsLoading(true);
    e.preventDefault();

    let uploadedImageUrl = null;
    if (selectedImage) {
      const result = await uploadImageToFirebase(selectedImage, 'post');
      uploadedImageUrl = result.url;
    }
    if (!newContent) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Campo vazio.',
      });
    } else {
      try {
        if (props?.value && post && uploadedImageUrl) {
          fetchNewAnswers(props?.value, newContent, post, uploadedImageUrl);
        } else if (props?.value && post) {
          fetchNewAnswers(props?.value, newContent, post, '');
        }
        setNewContent('');
        setImageUrl(null);
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: [`answers${id}`] });
      } catch (error) {
        console.error('Erro ao inserir:', error);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
    setNewContent('');
  }, [setNewContent]);

  return (
    <form
      onSubmit={props?.answer ? handleNewAnswer : handleNewPost}
      className="flex flex-col px-5 py-6 dark:bg-dark-TT"
    >
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <AvatarUser />
        <div>
          <Textarea
            className="pt-3 text-lg border-0 resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder={
              props?.answer ? 'Digite sua resposta?' : 'O que há de bom?'
            }
            value={newContent}
            onChange={handleNewContent}
          />
          {imageUrl && (
            <div className="w-72">
              <img src={imageUrl} alt="Selected" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <small className="mr-4 text-gray-400 dark:text-zinc-600">
          {caracter} caracter restantes.
        </small>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Image size={24} className="cursor-pointer text-zinc-400" />
        </label>
        <Button
          type="submit"
          className="px-6 py-5 bg-secondary-40 text-zinc-50 rounded-xl hover:bg-secondary-50"
        >
          {isLoading ? 'Carregando...' : props?.answer ? 'Responder' : 'Postar'}
        </Button>
      </div>
    </form>
  );
}
