import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/storage";
import { Song } from "../utils/consts";
import { useSpotifyAuth } from '../contexts/SpotifyAuthContext';
import axios from "axios";


const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const Finish = () => {
  const { token, setToken, signedInWithSpotify, setSignedInWithSpotify } = useSpotifyAuth();
  const [likes, setLikes] = useState<Song[]>([]);
  const [dislikes, setDislikes] = useState<Song[]>([]);


  const handleExportNew = () => {
    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response: any) => {
        
      })
      .catch((error: any) => {
        console.log(error);
      });
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
            {likes.map((song: any, index: any) => (
              <li key={index}>
                <a href={song.spotify}>{song.name}: 👍</a>
              </li>
            ))}
            {dislikes.map((song: any, index: any) => (
              <li key={index}>
                <a href={song.spotify}>{song.name}: 👎</a>
              </li>
            ))}
          </>
        ) : (
          <li>No songs liked or disliked :(</li>
        )}
      </ul>
      <button>save</button>
      <button>export: add to playlist</button>
      <button>export: as new playlist</button>
    </div>
  );
};

export default Finish;
