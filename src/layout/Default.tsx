import { Outlet } from 'react-router-dom';
import { SideBar } from '../components/SideBar';
import { Header } from '../components/Header';
import { Navbar } from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InfoBar } from '../components/InfoBar';

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function Default() {
  const location = useLocation();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (
      location.pathname === '/comunidades' ||
      location.pathname === '/peneiras' ||
      location.pathname === '/comunidade/' ||
      location.pathname === '/peneira/'
    ) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [location.pathname]);

  if (isMobileDevice()) {
    return (
      <div className="dark:bg-dark-TT bg-slate-50 dark:text-zinc-50 text-zinc-900">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="w-full px-1 mx-auto">
          <Header />
          <div className="bg-white border border-slate-200 dark:border-zinc-900 dark:bg-dark-TT dark:min-h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        status ? 'grid-cols-[auto,1fr,250px]' : 'grid-cols-[auto,1fr]'
      } dark:bg-dark-T bg-slate-50 dark:text-zinc-50 text-zinc-900`}
    >
      <SideBar />
      <div className="max-w-[1250px] w-full mx-auto px-5">
        <Header />
        <div className="bg-white border border-slate-200 dark:border-zinc-900 dark:bg-dark-TT">
          <Outlet />
        </div>
      </div>
      {status && (
        <>
          <InfoBar />
        </>
      )}
    </div>
  );
}
