import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/storage";
import { Song } from "../utils/consts";
import { useSpotifyAuth } from '../contexts/SpotifyAuthContext';
import axios from "axios";

const Finish = () => {
  const { token, playlistChoice } = useSpotifyAuth();
  const [likes, setLikes] = useState<Song[]>([]);
  const [dislikes, setDislikes] = useState<Song[]>([]);

  // Constructing the endpoint dynamically based on selected playlist
  const playlistEndpoint = playlistChoice ? `https://api.spotify.com/v1/playlists/${playlistChoice.tracks.href}/tracks` : "";

  // Generate track URIs from likes
  const trackUris = likes.map(song => `spotify:track:${song.songId}`);

  const handleExportAdd = () => {
    if (playlistEndpoint && trackUris.length > 0) {
      axios
        .post(playlistEndpoint, 
          {
            'uris': trackUris,
            'position': 0
          },
          {
            headers: {
              'Authorization': "Bearer " + token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response: any) => {
          console.log("Tracks added to playlist successfully.");
        })
        .catch((error: any) => {
          console.error("Error adding tracks to playlist:", error);
        });
    } else {
      console.error("Playlist endpoint or track URIs are undefined.");
    }
  };

  useEffect(() => {
    setLikes(getFromLocalStorage("likes"));
    setDislikes(getFromLocalStorage("dislikes"));
  }, []);

  return (
    <div id="finish">
      <h2>Session Finished! 🎉</h2>
      <ul>
        {likes.length > 0 || dislikes.length > 0 ? (
          <>
            {likes.map((song, index) => (
              <li key={index}>
                <a href={song.spotify}>{song.name}: 👍</a>
              </li>
            ))}
            {dislikes.map((song, index) => (
              <li key={index}>
                <a href={song.spotify}>{song.name}: 👎</a>
              </li>
            ))}
          </>
        ) : (
          <li>No songs liked or disliked :(</li>
        )}
      </ul>
      <button onClick={handleExportAdd}>export: add to playlist</button>
      <button>export: as new playlist</button>
    </div>
  );
};

export default Finish;