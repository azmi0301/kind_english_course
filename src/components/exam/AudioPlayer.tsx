"use client";
import { useState, useRef, useCallback } from "react";
import { Play, Lock, Volume2, VolumeX, MicOff } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  onPlayStarted?: () => void;
}

export default function AudioPlayer({ audioUrl, onPlayStarted }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // ── Guard: tampilkan pesan jika audio belum diupload ────────────────────────
  if (!audioUrl) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-5 w-full max-w-md mx-auto flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
          <MicOff className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-sm text-neutral-300 font-semibold">Audio belum tersedia</p>
        <p className="text-xs text-neutral-500">
          Admin belum mengupload file audio untuk soal ini.
        </p>
      </div>
    );
  }

  const handlePlay = () => {
    if (hasPlayed && !isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasPlayed) { setHasPlayed(true); onPlayStarted?.(); }
    if (isPlaying) return;
    audio.play();
    setIsPlaying(true);
  };

  const handleEnded = () => setIsPlaying(false);
  const handleTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime ?? 0);
  const handleLoadedMetadata = () => setDuration(audioRef.current?.duration ?? 0);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLocked = hasPlayed && !isPlaying;

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-5 w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center gap-4">
        {/* Play / Lock button */}
        <button
          onClick={handlePlay}
          disabled={isLocked}
          aria-label={isLocked ? "Audio already played" : "Play audio"}
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isLocked
              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              : isPlaying
              ? "bg-[#007D07]/30 text-[#007D07] cursor-default"
              : "bg-[#007D07] text-white hover:bg-[#006A06] cursor-pointer hover:scale-105"
          }`}
        >
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Waveform animation while playing */}
          {isPlaying && (
            <div className="audio-wave mb-2">
              <span style={{ height: "8px" }} />
              <span style={{ height: "16px" }} />
              <span style={{ height: "24px" }} />
              <span style={{ height: "12px" }} />
              <span style={{ height: "20px" }} />
              <span style={{ height: "8px" }} />
              <span style={{ height: "18px" }} />
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full bg-[#007D07] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time */}
          <div className="flex justify-between text-xs text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume toggle */}
        <button
          onClick={toggleMute}
          className="text-neutral-400 hover:text-white transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Lock notice */}
      {isLocked && (
        <div className="mt-3 text-center text-xs text-amber-400 bg-amber-900/30 rounded-lg px-3 py-2">
          🔒 Audio has been played. No replays allowed in TOEFL exam conditions.
        </div>
      )}

      {!hasPlayed && (
        <div className="mt-3 text-center text-xs text-neutral-400">
          ⚠️ This audio can only be played <strong className="text-white">once</strong>. Listen carefully.
        </div>
      )}
    </div>
  );
}

