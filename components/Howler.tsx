"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const staticUrl =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const streamingUrl =
  "https://8oyv91ejrmxawo-8000.proxy.runpod.net/api/v1/get-music-stream/ae260a54-696f-4b05-9959-b9b15d2c2a8f/ae8ffc10-be53-4683-bbad-2515af365ac3";

const HowlerPlayer = () => {
  const soundRef = useRef<Howl | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useStreaming, setUseStreaming] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadSound = (url: string) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      format: ['mp3', 'wav'],
      onload: () => {
        setDuration(sound.duration());
        setCurrentTime(0);
      },
    });

    soundRef.current = sound;
  };

  useEffect(() => {
    loadSound(useStreaming ? streamingUrl : staticUrl);

    return () => {
      soundRef.current?.unload();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [useStreaming]);

  const handlePlay = () => {
    if (!soundRef.current) return;

    soundRef.current.play();
    intervalRef.current = setInterval(() => {
      const seek = soundRef.current?.seek() as number;
      setCurrentTime(seek);
    }, 500);
  };

  const handlePause = () => {
    soundRef.current?.pause();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const toggleSource = () => {
    const wasPlaying = soundRef.current?.playing() ?? false;
    handlePause();
    setUseStreaming((prev) => !prev);

    // Slight delay to allow the new Howl instance to load
    setTimeout(() => {
      if (wasPlaying) {
        handlePlay();
      }
    }, 300);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md space-y-2 w-full max-w-md text-white">
      <p className="text-lg font-semibold">🎵 Howler Player</p>
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
      </div>{" "}
      <button
        onClick={toggleSource}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch to {useStreaming ? "Static" : "Streaming"}
      </button>
    </div>
  );
};

export default HowlerPlayer;
