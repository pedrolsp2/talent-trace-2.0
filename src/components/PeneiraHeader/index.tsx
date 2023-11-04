import { InfoUser } from '../../context/AuthProvider/type';
import { NovaPeneira } from '../NovaPeneira';

interface value {
  userData: InfoUser;
}

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}

export function PeneiraHeader(props: value) {
  return (
    <div
      className={`flex flex-col items-start gap-2.5 self-stretch py-2 px-3 dark:bg-dark-TT2 border border-[#ececec] bg-neutral-50 dark:border-zinc-900 ${
        !isMobileDevice() && 'sticky z-[40] top-0'
      }`}
    >
      <div className="flex flex-wrap items-center self-stretch justify-between px-1 py-0">
        <div className="flex flex-col flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_792_821"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={24}
                height={24}
              >
                <rect width={24} height={24} fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_792_821)">
                <path
                  d="M1 20V16C1 15.4333 1.19583 14.9583 1.5875 14.575C1.97917 14.1917 2.45 14 3 14H6.275C6.60833 14 6.925 14.0833 7.225 14.25C7.525 14.4167 7.76667 14.6417 7.95 14.925C8.43333 15.575 9.02917 16.0833 9.7375 16.45C10.4458 16.8167 11.2 17 12 17C12.8167 17 13.5792 16.8167 14.2875 16.45C14.9958 16.0833 15.5833 15.575 16.05 14.925C16.2667 14.6417 16.5208 14.4167 16.8125 14.25C17.1042 14.0833 17.4083 14 17.725 14H21C21.5667 14 22.0417 14.1917 22.425 14.575C22.8083 14.9583 23 15.4333 23 16V20H16V17.725C15.4167 18.1417 14.7875 18.4583 14.1125 18.675C13.4375 18.8917 12.7333 19 12 19C11.2833 19 10.5833 18.8875 9.9 18.6625C9.21667 18.4375 8.58333 18.1167 8 17.7V20H1ZM12 16C11.3667 16 10.7667 15.8542 10.2 15.5625C9.63333 15.2708 9.15833 14.8667 8.775 14.35C8.49167 13.9333 8.1375 13.6042 7.7125 13.3625C7.2875 13.1208 6.825 13 6.325 13C6.69167 12.3833 7.46667 11.8958 8.65 11.5375C9.83333 11.1792 10.95 11 12 11C13.05 11 14.1667 11.1792 15.35 11.5375C16.5333 11.8958 17.3083 12.3833 17.675 13C17.1917 13 16.7333 13.1208 16.3 13.3625C15.8667 13.6042 15.5083 13.9333 15.225 14.35C14.8583 14.8833 14.3917 15.2917 13.825 15.575C13.2583 15.8583 12.65 16 12 16ZM4 13C3.16667 13 2.45833 12.7083 1.875 12.125C1.29167 11.5417 1 10.8333 1 10C1 9.15 1.29167 8.4375 1.875 7.8625C2.45833 7.2875 3.16667 7 4 7C4.85 7 5.5625 7.2875 6.1375 7.8625C6.7125 8.4375 7 9.15 7 10C7 10.8333 6.7125 11.5417 6.1375 12.125C5.5625 12.7083 4.85 13 4 13ZM20 13C19.1667 13 18.4583 12.7083 17.875 12.125C17.2917 11.5417 17 10.8333 17 10C17 9.15 17.2917 8.4375 17.875 7.8625C18.4583 7.2875 19.1667 7 20 7C20.85 7 21.5625 7.2875 22.1375 7.8625C22.7125 8.4375 23 9.15 23 10C23 10.8333 22.7125 11.5417 22.1375 12.125C21.5625 12.7083 20.85 13 20 13ZM12 10C11.1667 10 10.4583 9.70833 9.875 9.125C9.29167 8.54167 9 7.83333 9 7C9 6.15 9.29167 5.4375 9.875 4.8625C10.4583 4.2875 11.1667 4 12 4C12.85 4 13.5625 4.2875 14.1375 4.8625C14.7125 5.4375 15 6.15 15 7C15 7.83333 14.7125 8.54167 14.1375 9.125C13.5625 9.70833 12.85 10 12 10Z"
                  fill="#666666"
                />
              </g>
            </svg>
            <div className="text-[#b0b0b0] font-medium leading-[normal]">
              Peneiras
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {props.userData?.cref && (
            <div className="flex gap-4">
              <NovaPeneira userData={props.userData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
