import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
import { openAuthModal } from "../../redux/slices/uiSlice";
import { updateFavourites } from "../../redux/slices/authSlice.js";
import { formatTime } from "../utils/helper.js";
import axios from "axios";
const ControlArea = ({ playerState, playerControls }) => {
  // const isPlaying = playerState.isPlaying;
  // const currentTime = playerState.currentTime;
  // const duration = playerState.duration;

  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { isPlaying, currentTime, currentSong, duration, isLoading } =
    playerState;
  const { handleTogglePlay, handleNext, handlePrevious, handleSeek } =
    playerControls;

  const currentSongId = currentSong?.id;
  const isLiked = Boolean(
    currentSongId && user?.favourites?.some((fav) => fav.id === currentSongId),
  );

  const handleLike = async () => {
    if (!isAuthenticated || !currentSong) return;

    try {
      const songData = {
        id: currentSong.id,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        audio: currentSong.audio,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(updateFavourites(response.data));
    } catch (error) {
      console.error("Error liking song:", error);
    }
  };
  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={() => {
            handlePrevious();
          }}
          
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>
        <button
          type="button"
          aria-label="play"
          className="control-play-btn"
          onClick={handleTogglePlay}
        >
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="#a855f7" size={36} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>
        {isAuthenticated && (
          <button
            type="button"
            aria-label="like"
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right , #a855f7 ${duration ? (currentTime / duration) * 100 : 0}% , #333 ${duration ? (currentTime / duration) * 100 : 0})`,
          }}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
