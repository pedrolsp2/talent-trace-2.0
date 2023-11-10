import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: firebase.firestore.Timestamp | undefined;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (targetDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const targetTime = targetDate.toDate();
        const timeDifference = targetTime.getTime() - now.getTime();

        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
          const seconds = Math.floor((timeDifference / 1000) % 60);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          clearInterval(interval);
          setTimeLeft('Tempo encerrado');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <span className="text-lg text-primary-50">{timeLeft}</span>
    </div>
  );
};

export default CountdownTimer;
