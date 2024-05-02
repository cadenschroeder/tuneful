import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/storage";
import { Song } from "../utils/consts";

const Finish = () => {
  const [likes, setLikes] = useState<Song[]>([]);
  const [dislikes, setDislikes] = useState<Song[]>([]);

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
    </div>
  );
};

export default Finish;
