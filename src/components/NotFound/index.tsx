import { ArrowLeft } from '@phosphor-icons/react'
import imgBack from '../../assets/img-backs.jpg'

export default function NotFound() {
  return (
    <>
      <main className="grid h-screen place-items bg-white px-6 py-24 sm:py-32 lg:px-8" 
      style={{
        backgroundImage: `url(${imgBack}), linear-gradient(146deg, #14AF6C 0%, #1A0751 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      >
        <div className="text-center">
          <p className="text-base font-semibold" style={{color: '#306353'}}>404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">Página não encontrada</h1>
          <p className="mt-6 text-base leading-7 text-gray-200">Desculpe, não encontramos nada sobre sua busca.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md  px-5 py-4 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
              style={{backgroundColor: '#2D413B'}}>
              <ArrowLeft size={20} /> Início
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
