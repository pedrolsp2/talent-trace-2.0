import { useEffect, useState } from 'react';
import imgBack from '../../assets/img-back-not-singin.png';
import Logo from '../../assets/logo512.svg'
import { useNavigate } from 'react-router-dom';

export function MessageSingin() {
  const [count, setCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate("/login");
    }
  }, [count, navigate]);

  return (
    <div
      className="w-screen h-screen flex flex-col gap-4 justify-center items-center"
      style={{
        backgroundImage: `url(${imgBack}), linear-gradient(146deg, #14AF6C 0%, #1A0751 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h1 className='text-white font-bold text-5xl'>Ops...</h1>
      <h1 className='text-white font-bold text-4xl'>Parece que você não está logado</h1>
      <h1 className='text-gray-200 font-normal text-2xl'>Faça o login para começar</h1>
      <img src={Logo} alt="Logo" />
      <p className='text-white'>Redirecionando em {count}...</p>
      <p className='text-white'>Ou clique aqui <span className='text-secondary-50 font-bold cursor-pointer' onClick={()=>navigate("/login")}>Redirecionar</span></p>
    </div>
  )
}
