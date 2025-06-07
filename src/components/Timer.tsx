import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface TimerProps {
  maxMinutes?: number;
}

const Timer: React.FC<TimerProps> = ({ maxMinutes = 5 }) => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play sound or show notification when timer ends
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer kết thúc!', {
          body: 'Thời gian nghỉ đã hết, sẵn sàng cho set tiếp theo!',
          icon: '/vite.svg'
        });
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60 + seconds);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = timeLeft > 0 ? formatTime(timeLeft) : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-fitness-red" />
          <span className="text-sm font-medium text-gray-700">Timer nghỉ</span>
        </div>
      </div>

      {!isRunning && timeLeft === 0 && (
        <div className="flex space-x-2 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Phút</label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {Array.from({ length: maxMinutes }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Giây</label>
            <select
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {Array.from({ length: 60 }, (_, i) => i).map(num => (
                <option key={num} value={num}>{num.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="text-center mb-3">
        <div className={`text-2xl font-bold ${timeLeft > 0 && timeLeft <= 10 ? 'text-fitness-red animate-pulse' : 'text-fitness-black'}`}>
          {displayTime}
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            <Play className="h-3 w-3" />
            <span>Bắt đầu</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
          >
            <Pause className="h-3 w-3" />
            <span>Tạm dừng</span>
          </button>
        )}
        <button
          onClick={resetTimer}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Timer;