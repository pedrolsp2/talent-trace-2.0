import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { AvatarUser } from "../AvatarUser";
import { useToast } from "../ui/use-toast";
import { fetchNewPost, fetchNewAnswers } from "../../context/hooks/getData";
import { InfoUser } from "../../context/AuthProvider/type";
import { useParams } from "react-router-dom";

type IForm = {
  value: InfoUser | null;
  answer?: boolean;
  fetch?: ()=> void;
};

export function FormPost(props: IForm) {
  const { toast } = useToast();
  const [newContent, setNewContent] = useState("");
  const [caracter, setCaracter] = useState(255);
  const { id } = useParams<{ id: string }>();
  const [refreshKey, setRefreshKey] = useState(0); // State to force re-render

  useEffect(() => {
    setNewContent("");
  }, [setNewContent]);

  function handleNewContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const content = e.target.value;
    setNewContent(content);

    const lengthCount = content.length;
    setCaracter(255 - lengthCount);
  }

  function handleNewPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Campo vazio.",
      });
    } else {
      try {
        const idUser = Number(props?.value?.id_user);
        fetchNewPost(idUser, newContent);
        setNewContent("");
        props?.fetch;
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to force re-render
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Post cadastrado com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao inserir:", error);
      }
    }
  }

  function handleNewAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Campo vazio.",
      });
    } else {
      try {
        const idUser = Number(props?.value?.id_user);
        fetchNewAnswers(idUser, newContent, Number(id));
        setNewContent("");
        props?.fetch;
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to force re-render
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Post cadastrado com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao inserir:", error);
      }
    }
  }
  return (
    <form onSubmit={props?.answer? handleNewAnswer : handleNewPost} className="px-5 py-6 flex flex-col">
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <AvatarUser />
        <Textarea
          className="resize-none border-0 placeholder:text-slate-400 pt-3 text-lg"
          placeholder={props?.answer? "Digite sua resposta?" : "O que há de bom?"}
          value={newContent}
          onChange={handleNewContent}
        />
      </div>
      <div className="ml-auto">
        <small className="mr-4 dark:text-gray-700 text-gray-400" >{caracter} caracter restantes.</small>
        <Button
          type="submit"
          className="bg-secondary-40 text-zinc-50 px-6 py-5 rounded-xl hover:bg-secondary-50"
        >
          {props?.answer? "Responder" : "Postar"}
        </Button>
      </div>
    </form>
  );
}
