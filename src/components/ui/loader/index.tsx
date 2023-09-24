import  { useState, useEffect } from "react";

export const Loader = () => {
  const [loaders, setLoaders] = useState([false, false, false]);

  useEffect(() => {
    const interval1 = setInterval(() => {
      setLoaders((prevState) => {
        const newState = [...prevState];
        newState[0] = !newState[0];
        return newState;
      });
    }, 1000); // Intervalo de 1.5 segundos

    const interval2 = setInterval(() => {
      setLoaders((prevState) => {
        const newState = [...prevState];
        newState[1] = !newState[1];
        return newState;
      });
    }, 1500); // Intervalo de 2 segundos

    const interval3 = setInterval(() => {
      setLoaders((prevState) => {
        const newState = [...prevState];
        newState[2] = !newState[2];
        return newState;
      });
    }, 2000); // Intervalo de 2.5 segundos

    // Limpar os intervalos ao desmontar o componente
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  return (
    <div className="flex gap-2">
      <span
        className={`p-1 rounded-full bg-secondary-20 ${
          loaders[0] ? "opacity-60" : ""
        }`}
      ></span>
      <span
        className={`p-1 rounded-full bg-secondary-20 ${
          loaders[1] ? "opacity-60" : ""
        }`}
      ></span>
      <span
        className={`p-1 rounded-full bg-secondary-20 ${
          loaders[2] ? "opacity-60" : ""
        }`}
      ></span>
    </div>
  );
};
