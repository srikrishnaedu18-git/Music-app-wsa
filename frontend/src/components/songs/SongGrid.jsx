import React from "react";
import "../../css/songs/SongGrid.css";
import { useSelector } from "react-redux";
import SongCard from "./SongCard";

const SongGrid = ({ songs, onSelectFavourite }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="song-grid-empty">
        <p className="empty-text">No Favourite songs available</p>
        <p className="empty-subtext">
          Start exploring and add songs to your favourites!
        </p>
      </div>
    );
  }
  return (
    <div className="songs-grid-wrapper">
      <h2 className="song-grid-heading">Your favourites</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onSelectFavourite={() => onSelectFavourite(song)} // ✅ pass a function
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;
