"use client";

import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const staticUrl =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const streamingUrl =
  "https://8oyv91ejrmxawo-8000.proxy.runpod.net/api/v1/get-music-stream/ae260a54-696f-4b05-9959-b9b15d2c2a8f/ae8ffc10-be53-4683-bbad-2515af365ac3";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useStreaming, setUseStreaming] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const source = useStreaming ? streamingUrl : staticUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 500);
    };

    const handlePause = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [source]);

  const handlePlay = () => {
    audioRef.current?.play();
  };

  const handlePause = () => {
    audioRef.current?.pause();
  };

  const toggleSource = () => {
    const wasPlaying = !audioRef.current?.paused;
    handlePause();
    setCurrentTime(0);
    setDuration(0);
    setUseStreaming((prev) => !prev);

    // Wait for state update and reload audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        if (wasPlaying) {
          audioRef.current.play();
        }
      }
    }, 100);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md space-y-3 w-full max-w-md text-white">
      <p className="text-lg font-semibold">🎵 Audio Player</p>

      <div className="flex items-center justify-between text-sm text-gray-200">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="space-x-4">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Pause
        </button>
      </div>
      <button
        onClick={toggleSource}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch to {useStreaming ? "Static" : "Streaming"}
      </button>

      <audio ref={audioRef} src={source} preload="metadata" controls />
    </div>
  );
};

export default AudioPlayer;
