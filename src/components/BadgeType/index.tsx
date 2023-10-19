import { useEffect, useState } from 'react';

interface BadgeTypeProps {
  variant: 'default' | 'text' | 'menu';
  type: 'Peneiras' | 'Curiosidades' | 'Treinos';
}

export function BadgeType({ variant, type }: BadgeTypeProps) {
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    switch (type) {
      case 'Treinos':
        setBgColor('bg-primary-20');
        setTextColor('text-white');
        break;
      case 'Peneiras':
        setBgColor('bg-secondary-40');
        setTextColor('text-white');
        break;
      case 'Curiosidades':
        setBgColor('bg-[#FFE576]');
        setTextColor('text-[#D7B21A]');
        break;
    }
  }, [type]);

  if (variant === 'default') {
    return (
      <div
        className={`p-1 px-2 rounded-full ${bgColor} ${textColor} w-fit text-xs`}
      >
        {type}
      </div>
    );
  }
  if (variant === 'menu') {
    return (
      <div
        className={`flex justify-center items-center gap-1 p-1 w-3 h-3 ${bgColor} ${textColor}`}
      ></div>
    );
  }
  return (
    <div className="flex gap-1">
      <div
        className={`flex justify-center items-center gap-1 p-1 w-3 h-3 ${bgColor}`}
      />
      <span className="text-[#999797] text-xs font-semibold leading-[100%]">
        {type}
      </span>
    </div>
  );
}
