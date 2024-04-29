import { songs } from "../utils/consts";

interface FinishProps {
  props: any; // Placeholder, replace or remove as needed
}

const Finish = ({ props }: FinishProps) => {
  return (
    <div id="finish">
      <h2>Session Finished! 🎉</h2>
      <ul>
        {songs.map((song: any, index: any) => (
          <li key={index}>
            <a href={song.spotify}>{song.name}: 👍</a>
          </li>
        ))}
      </ul>
      <button>export</button>
    </div>
  );
};

export default Finish;
