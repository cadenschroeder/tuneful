import React, { useState, useEffect, useRef, useCallback } from "react";
import { songs } from "../utils/consts";
import { AudioVisualizer } from "react-audio-visualize";
import dragElement from "./drag";

interface ActionsProps {
  nextSong: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

const Actions = ({ nextSong, togglePlay, isPlaying }: ActionsProps) => {
  const handleLike = useCallback(() => {
    const cardElement = document.getElementById("card");
    if (cardElement) {
      cardElement
        .animate(
          [
            {
              transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
            },
            {
              transform: "translate(100vw, -50%) rotate(120deg) scale(0)",
            },
          ],
          {
            duration: 200,
          }
        )
        .finished.then(() => {
          nextSong();
          cardElement.animate(
            [
              {
                transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
              },
              {
                transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
              },
            ],
            {
              duration: 300,
              easing: "ease-in-out",
            }
          );
        });
    }
  }, [nextSong]);

  const handleDislike = useCallback(() => {
    const cardElement = document.getElementById("card");
    if (cardElement) {
      cardElement
        .animate(
          [
            {
              transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
            },
            {
              transform: "translate(-100vw, -50%) rotate(-120deg) scale(0)",
            },
          ],
          {
            duration: 200,
            easing: "ease-in-out",
          }
        )
        .finished.then(() => {
          nextSong();
          cardElement.animate(
            [
              {
                transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
              },
              {
                transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
              },
            ],
            {
              duration: 300,
              easing: "ease-in-out",
            }
          );
        });
    }
  }, [nextSong]);

  const handleToggle = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handleDislike();
      if (event.key === "ArrowRight") handleLike();
      if (event.key === " ") handleToggle();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDislike, handleLike, handleToggle]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handleDislike();
      if (event.key === "ArrowRight") handleLike();
      if (event.key === " ") handleToggle();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDislike, handleLike, handleToggle]);

  return (
    <div>
      <div className="buttons">
        <button onClick={handleDislike}>👎</button>
        <button onClick={handleToggle}>{isPlaying ? "⏸️" : "▶️"}</button>
        <button onClick={handleLike}>👍</button>
      </div>
    </div>
  );
};

interface Song {
  name: string;
  cover: string;
  artist: string;
  blob: string;
  spotify: string;
}

interface CardProps {
  songs: Song[];
  appRef: React.RefObject<HTMLDivElement>;
}

const Card = ({ songs, appRef }: CardProps) => {
  const [song, setSong] = useState(songs[0]);
  const [blob, setBlob] = useState<Blob>();
  const [playTime, setPlayTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function getBlob(filePath: string): Promise<Blob> {
      return new Promise((resolve, reject) => {
        fetch(filePath)
          .then((response) =>
            response.ok
              ? response.blob()
              : Promise.reject("Failed to load file")
          )
          .then((blob) => resolve(blob))
          .catch((error) => reject(error));
      });
    }

    getBlob(song.blob).then((resBlob) => {
      setBlob(resBlob);
      setPlayTime(0);
    });

    const appElement = appRef.current;
    if (appElement) {
      appElement.style.backgroundImage = `url(${song.cover})`;
      appElement.style.backdropFilter = "blur(10px)";
    }
  }, [song, appRef]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      setIsPlaying(!audioElement.paused);
      const updatePlayTime = () => setPlayTime(audioElement.currentTime);
      audioElement.addEventListener("timeupdate", updatePlayTime);

      return () =>
        audioElement.removeEventListener("timeupdate", updatePlayTime);
    }
  }, [blob, playTime]);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const newPlayingState = audioElement.paused;
      setIsPlaying(!newPlayingState);
      newPlayingState ? audioElement.play() : audioElement.pause();
    }
  };

  const nextSong = useCallback(() => {
    let randomIndex = -1;
    while (randomIndex < 0 || songs[randomIndex] === song) {
      randomIndex = Math.floor(Math.random() * songs.length);
    }
    setSong(songs[randomIndex]);
  }, [song, songs]);

  useEffect(() => {
    dragElement(document.getElementById("card")!, nextSong);
  }, [nextSong]);

  return (
    <div
      id="card"
      className="card"
      draggable={true}
      onDrop={(e) => e.preventDefault()}
    >
      <a href={song.spotify}>
        <img src="img/spotify.png" alt="spotify" />
      </a>
      <h2>"{song.name}"</h2>
      <p>{song.artist}</p>
      {blob ? (
        <div>
          <AudioVisualizer
            currentTime={playTime}
            width={300}
            height={30}
            blob={blob}
          />
          <audio src={song.blob} autoPlay ref={audioRef} />
        </div>
      ) : (
        <div id="empty-vis"></div>
      )}
      <img src={song.cover} alt="album cover" draggable="false" />
      <Actions
        nextSong={nextSong}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
    </div>
  );
};

interface MusicProps {
  appRef: React.RefObject<HTMLDivElement>;
}

const Music = ({ appRef }: MusicProps) => {
  return (
    <div id="music">
      <Card songs={songs} appRef={appRef} />
    </div>
  );
};

export default Music;
