"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [audioTime, setAudioTime] = useState({ current: 0, duration: 0 });
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Initial update
    updateCurrentTime();

    // Update time every minute
    const intervalId = setInterval(updateCurrentTime, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setAudioTime({
        current: audioRef.current.currentTime,
        duration: audioRef.current.duration,
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (e.target.valueAsNumber / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.valueAsNumber);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping(audioRef.current.loop);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    // Add shuffle logic here if you have a playlist
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-gray-700 via-gray-600 to-gray-800">
      <div className="w-[430px] h-[932px] bg-cover bg-center shadow-lg text-white" style={{ backgroundImage: 'url(/your-background-image-path.jpg)' }}>
        <div className="p-5 flex justify-between text-xs mt-2">
          <span className="font-bold">{currentTime}</span>
        </div>
        <div className="flex flex-col items-center p-5 mt-5">
          <Image src="/album_art.jpg" alt="Album Art" width={330} height={440} className="rounded shadow-lg mb-4" />
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl font-bold text-left">Flos</h1>
              <p className="text-sm text-left">Anon Chihaya</p>
            </div>
            <button
              aria-label="Favorite"
              className={`ml-2 ${isFavorite ? 'text-pink-500' : 'text-gray-400'}`}
              onClick={toggleFavorite}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-3 my-2 w-full">
          <input
            type="range"
            name="song-progress"
            value={progress}
            onChange={handleProgressChange}
            max="100"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(audioTime.current)}</span>
            <span>{formatTime(audioTime.duration)}</span>
          </div>
        </div>
        <div className="flex justify-center space-x-4 py-3">
          <button aria-label="Previous" className="control-btn">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
              <path d="M6 18V6h2v12H6zm3.5-6l8.5 6V6z" />
            </svg>
          </button>
          <button aria-label="Play/Pause" className="control-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M6 19h4V5H6zm8 0h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button aria-label="Next" className="control-btn">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
              <path d="M16 18V6h2v12h-2zm-3.5-6l-8.5 6V6z" />
            </svg>
          </button>
        </div>
        <div className="flex justify-center space-x-4 py-3">
          <button aria-label="Shuffle" className={`control-btn ${isShuffling ? 'text-green-500' : ''}`} onClick={toggleShuffle}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M2 16.25C1.58579 16.25 1.25 16.5858 1.25 17C1.25 17.4142 1.58579 17.75 2 17.75V16.25ZM10.7478 14.087L10.1047 13.7011L10.7478 14.087ZM13.2522 9.91303L13.8953 10.2989L13.2522 9.91303ZM22 7L22.5303 7.53033C22.8232 7.23744 22.8232 6.76256 22.5303 6.46967L22 7ZM19.4697 8.46967C19.1768 8.76256 19.1768 9.23744 19.4697 9.53033C19.7626 9.82322 20.2374 9.82322 20.5303 9.53033L19.4697 8.46967ZM20.5303 4.46967C20.2374 4.17678 19.7626 4.17678 19.4697 4.46967C19.1768 4.76256 19.1768 5.23744 19.4697 5.53033L20.5303 4.46967ZM15.2205 7.3894L14.851 6.73675V6.73675L15.2205 7.3894ZM2 17.75H5.60286V16.25H2V17.75ZM11.3909 14.4728L13.8953 10.2989L12.6091 9.52716L10.1047 13.7011L11.3909 14.4728ZM18.3971 7.75H22V6.25H18.3971V7.75ZM21.4697 6.46967L19.4697 8.46967L20.5303 9.53033L22.5303 7.53033L21.4697 6.46967ZM22.5303 6.46967L20.5303 4.46967L19.4697 5.53033L21.4697 7.53033L22.5303 6.46967ZM13.8953 10.2989C14.3295 9.57518 14.6286 9.07834 14.9013 8.70996C15.1644 8.35464 15.3692 8.16707 15.59 8.04205L14.851 6.73675C14.384 7.00113 14.0315 7.36397 13.6958 7.8174C13.3697 8.25778 13.0285 8.82806 12.6091 9.52716L13.8953 10.2989ZM18.3971 6.25C17.5819 6.25 16.9173 6.24918 16.3719 6.30219C15.8104 6.35677 15.3179 6.47237 14.851 6.73675L15.59 8.04205C15.8108 7.91703 16.077 7.83793 16.517 7.79516C16.9733 7.75082 17.5531 7.75 18.3971 7.75V6.25ZM5.60286 17.75C6.41814 17.75 7.0827 17.7508 7.62807 17.6978C8.18961 17.6432 8.6821 17.5276 9.14905 17.2632L8.41 15.9579C8.18919 16.083 7.92299 16.1621 7.48296 16.2048C7.02675 16.2492 6.44685 16.25 5.60286 16.25V17.75ZM10.1047 13.7011C9.67046 14.4248 9.37141 14.9217 9.09867 15.29C8.8356 15.6454 8.63081 15.8329 8.41 15.9579L9.14905 17.2632C9.616 16.9989 9.96851 16.636 10.3042 16.1826C10.6303 15.7422 10.9715 15.1719 11.3909 14.4728L10.1047 13.7011Z"></path> <path d="M2 6.25C1.58579 6.25 1.25 6.58579 1.25 7C1.25 7.41421 1.58579 7.75 2 7.75V6.25ZM22 17L22.5303 17.5303C22.8232 17.2374 22.8232 16.7626 22.5303 16.4697L22 17ZM20.5303 14.4697C20.2374 14.1768 19.7626 14.1768 19.4697 14.4697C19.1768 14.7626 19.1768 15.2374 19.4697 15.5303L20.5303 14.4697ZM19.4697 18.4697C19.1768 18.7626 19.1768 19.2374 19.4697 19.5303C19.7626 19.8232 20.2374 19.8232 20.5303 19.5303L19.4697 18.4697ZM16.1254 16.9447L16.2687 16.2086H16.2687L16.1254 16.9447ZM14.4431 14.6141C14.23 14.2589 13.7693 14.1438 13.4141 14.3569C13.0589 14.57 12.9438 15.0307 13.1569 15.3859L14.4431 14.6141ZM14.4684 16.0065L15.0259 15.5049V15.5049L14.4684 16.0065ZM7.8746 7.05526L8.01789 6.31908L7.8746 7.05526ZM9.55688 9.38587C9.76999 9.74106 10.2307 9.85623 10.5859 9.64312C10.9411 9.43001 11.0562 8.96931 10.8431 8.61413L9.55688 9.38587ZM9.53163 7.99346L8.97408 8.49509L8.97408 8.49509L9.53163 7.99346ZM2 7.75H6.66762V6.25H2V7.75ZM17.3324 17.75H22V16.25H17.3324V17.75ZM22.5303 16.4697L20.5303 14.4697L19.4697 15.5303L21.4697 17.5303L22.5303 16.4697ZM21.4697 16.4697L19.4697 18.4697L20.5303 19.5303L22.5303 17.5303L21.4697 16.4697ZM17.3324 16.25C16.6867 16.25 16.4648 16.2467 16.2687 16.2086L15.9821 17.6809C16.3538 17.7533 16.7473 17.75 17.3324 17.75V16.25ZM13.1569 15.3859C13.4579 15.8875 13.6575 16.2267 13.9108 16.5082L15.0259 15.5049C14.8923 15.3564 14.7753 15.1678 14.4431 14.6141L13.1569 15.3859ZM16.2687 16.2086C15.789 16.1152 15.3528 15.8682 15.0259 15.5049L13.9108 16.5082C14.4556 17.1137 15.1826 17.5253 15.9821 17.6809L16.2687 16.2086ZM6.66762 7.75C7.31332 7.75 7.53519 7.75328 7.73131 7.79145L8.01789 6.31908C7.64616 6.24672 7.25267 6.25 6.66762 6.25V7.75ZM10.8431 8.61413C10.5421 8.11245 10.3425 7.77335 10.0892 7.49182L8.97408 8.49509C9.10771 8.64362 9.22467 8.83219 9.55688 9.38587L10.8431 8.61413ZM7.73131 7.79145C8.21098 7.88481 8.64722 8.13181 8.97408 8.49509L10.0892 7.49182C9.54442 6.88635 8.81735 6.47469 8.01789 6.31908L7.73131 7.79145Z"></path>
            </svg>
          </button>
          <button aria-label="Loop" className={`control-btn ${isLooping ? 'text-blue-500' : ''}`} onClick={toggleLoop}>
            <svg fill="#000000" className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M18,7a7.669,7.669,0,0,0-6,3.19A7.669,7.669,0,0,0,6,7C2.313,7,1,9.583,1,12c0,3.687,2.583,5,5,5a7.669,7.669,0,0,0,6-3.19A7.669,7.669,0,0,0,18,17c2.417,0,5-1.313,5-5C23,9.583,21.687,7,18,7ZM6,15a2.689,2.689,0,0,1-3-3A2.689,2.689,0,0,1,6,9c2.579,0,4.225,2.065,4.837,3C10.225,12.935,8.579,15,6,15Zm12,0c-2.579,0-4.225-2.065-4.837-3,.612-.935,2.258-3,4.837-3a2.689,2.689,0,0,1,3,3A2.689,2.689,0,0,1,18,15Z"></path></g></svg>
          </button>
        </div>
        <div className="px-3 py-2 flex items-center space-x-2">
          <svg className="volume-icon" width="24" height="24" fill="#FFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z"/>
          </svg>
          <input
            type="range"
            name="volume-control"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
          <svg className="volume-icon" width="24" height="24" fill="#FFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z"/>
          </svg>
        </div>
        <audio ref={audioRef} src="/song.mp3" onTimeUpdate={handleTimeUpdate} />
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1.5 bg-white rounded-full"></div>
      </div>
  );
};

export default Home;
