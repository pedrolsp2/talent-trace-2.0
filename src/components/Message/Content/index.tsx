import { IMessage } from "../../../context/AuthProvider/type";
interface IMessageContent {
  value: IMessage;
}

export default function Content(props: IMessageContent) {
  return (
    <div className={`p-3 rounded-[8px] flex flex-col my-2
    ${props?.value?.id_user_friend === 1 && 'ml-auto'}
    ${props?.value?.id_user_friend === 1? 'bg-primary-50 text-zinc-100 ' : 'bg-zinc-300 text-zinc-800 '}
    `}>
      <span>{props?.value?.content}</span>
      <small className={`ml-auto ${props?.value?.id_user_friend === 1? 'text-zinc-100' : 'text-zinc-400'}`}>Pedro, às 15:35</small>
    </div>
  )
}