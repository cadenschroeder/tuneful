import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/storage";
import { Song } from "../utils/consts";
import { getLoginCookie } from "../utils/cookie";

const Finish = () => {
  const [likes, setLikes] = useState<Song[]>([]);
  const [dislikes, setDislikes] = useState<Song[]>([]);

  useEffect(() => {
    setLikes(getFromLocalStorage("likes"));
    setDislikes(getFromLocalStorage("dislikes"));
  }, []);

  const handleSave = () => {
    const sendSongs = async () => {
      const likes = getFromLocalStorage("likes");
      // const dislikes = getFromLocalStorage("dislikes");
      const uid = getLoginCookie();
      const endpoint = `http://localhost:3232/addLikes?uid=${uid}&likes=${JSON.stringify(
        likes
      )}`;

      const response = await fetch(endpoint);
      console.log(response);

      await alert("Songs saved!");
    };

    sendSongs();
  };
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
      <button onClick={handleSave}>save</button>
      <button>export: add to playlist</button>
      <button>export: as new playlist</button>
    </div>
  );
};

export default Finish;
