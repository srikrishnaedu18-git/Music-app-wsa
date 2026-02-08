import { useReducer, useState, useRef } from "react";
import React from "react";
const initalAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
  duration: 0,
};

function useAudioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "MUTE":
      return { ...state, isMuted: true };
    case "UNMUTE":
      return { ...state, isMuted: false };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "TOGGLE_LOOP":
      return {
        ...state,
        loopEnabled: !state.loopEnabled,
        shuffleEnabled: false,
      };
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffleEnabled: !state.shuffleEnabled,
        loopEnabled: false,
      };
    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };
    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        isLoading: true,
      };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    default:
      return state;
  }
}

const useAudioPlayer = (songs) => {
  const [audioState, dispatch] = React.useReducer(
    useAudioReducer,
    initalAudioState,
  );
  const previousVolumeRef = React.useRef(1);
  const audioRef = React.useRef(null);

  const playSongAtIndex = (index) => {
    if (!songs || songs.length === 0) {
      console.warn("No songs available to play.");
      return;
    }
    if (index < 0 || index >= songs.length) {
      return;
    }
    const song = songs[index];
    dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });
    dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element not found.");
      return;
    }
    dispatch({ type: "LOADING" });
    audio.load();
    audio.playbackRate = audioState.playbackSpeed;
    audio
      .play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch((error) => {
        console.error("Play error:", error);
      });
  };
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      audio
        .play()
        .then(() => dispatch({ type: "PLAY" }))
        .catch((error) => {
          console.error("Play error:", error);
        });
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const handleNext = () => {
    if (!songs.length) return;

    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    if (audioState.shuffleEnabled) {
      let randomIndex = audioState.currentIndex;
      while (randomIndex === audioState.currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      playSongAtIndex(randomIndex);
      return;
    }

    const nextIndex = (audioState.currentIndex + 1) % songs.length;
    playSongAtIndex(nextIndex);
    console.log("Before NEXT, currentIndex:", audioState.currentIndex);
  };

  const handlePrevious = () => {
    console.log(
      "handlePrevious called, currentIndex:",
      audioState.currentIndex,
    );

    if (!songs.length) return;
    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    if (audioState.shuffleEnabled) {
      let randomIndex = audioState.currentIndex;
      while (randomIndex === audioState.currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      playSongAtIndex(randomIndex);
      return;
    }

    const prevIndex =
      (audioState.currentIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prevIndex);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime || 0 });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = Math.floor(audio.duration) || 0;
    dispatch({ type: "SET_DURATION", payload: dur }); // ✅ update reducer
    audio.playbackRate = audioState.playbackSpeed;
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;
    // ❌ remove dispatch({ type: "PLAY" })
  };

  const handleEnded = (volume) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState.loopEnabled) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          dispatch({ type: "PLAY" });
          dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
        })
        .catch((error) => {
          console.error("Replay error:", error);
        });
    } else {
      handleNext();
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioState.isMuted) {
      const restoreVolume = previousVolumeRef.current || 1;
      audio.muted = false;
      audio.volume = restoreVolume;
      dispatch({ type: "UNMUTE" });
      dispatch({ type: "SET_VOLUME", payload: restoreVolume });
    } else {
      previousVolumeRef.current = audio.volume;
      audio.muted = true;
      audio.volume = 0;
      dispatch({ type: "MUTE" });
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  const handleToggleLoop = () => {
    dispatch({ type: "TOGGLE_LOOP" });
  };

  const handleToggleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  };

  const handleChangeSpeed = (newSpeed) => {
    const audio = audioRef.current;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
    if (audio) {
      audio.playbackRate = newSpeed;
    }
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  };

  const handleChangeVolume = (newVolume) => {
    const audio = audioRef.current;
    if (newVolume > 0) {
      previousVolumeRef.current = newVolume;
    }
    dispatch({ type: "SET_VOLUME", payload: newVolume });
    if (!audio) return;
    audio.volume = newVolume;
    if (audioState.isMuted && newVolume > 0) {
      audio.muted = false;
      dispatch({ type: "UNMUTE" });
    } else if (newVolume === 0) {
      audio.muted = true;
      dispatch({ type: "MUTE" });
    }
  };

  return {
    audioRef,
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    currentTime: audioState.currentTime,
    isLoading: audioState.isLoading,
    duration: audioState.duration,
    isMuted: audioState.isMuted,
    volume: audioState.volume,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,
    duration: audioState.duration,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrevious,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
    handleSeek,
  };
};

export default useAudioPlayer;
