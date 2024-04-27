import React, { useState, useEffect, useCallback } from "react";
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
            duration: 300,
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
              duration: 200,
              easing: "ease-in-out",
              fill: "forwards",
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
            duration: 300,
            easing: "ease-in-out",
            fill: "forwards",
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
              duration: 200,
              easing: "ease-in-out",
              fill: "forwards",
            }
          );
        });
    }
  }, [nextSong]);

  const handleToggle = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  // keyboard shortcuts
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
}

const Card = ({ songs }: CardProps) => {
  const [song, setSong] = useState(songs[0]);
  const [blob, setBlob] = useState<Blob>();
  const [playTime, setPlayTime] = useState(0);

  const nextSong = () => {
    let randomIndex = -1;
    while (randomIndex < 0 || songs[randomIndex] === song) {
      randomIndex = Math.floor(Math.random() * songs.length);
    }
    setSong(songs[randomIndex]);
  };

  useEffect(() => {
    async function getBlob(filePath: string): Promise<Blob> {
      return new Promise((resolve, reject) => {
        fetch(filePath)
          .then((response) => {
            if (response.ok) {
              return response.blob();
            } else {
              throw new Error("Failed to load file");
            }
          })
          .then((blob) => {
            resolve(blob);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    getBlob(song.blob).then((resBlob) => {
      setBlob(resBlob);
      setPlayTime(0);
    });

    document.getElementById(
      "App"
    )!.style.backgroundImage = `url(${song.cover})`;
    document.getElementById("App")!.style.backdropFilter = "blur(10px)";
  }, [song]);

  const ref = React.createRef<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = ref.current;
    setIsPlaying(!audioElement?.paused);

    const updatePlayTime = () => {
      if (audioElement) setPlayTime(audioElement.currentTime);
    };

    if (audioElement)
      audioElement.addEventListener("timeupdate", updatePlayTime);

    return () => {
      if (audioElement)
        audioElement.removeEventListener("timeupdate", updatePlayTime);
    };
  }, [ref]);

  const togglePlay = () => {
    const audioElement = ref.current;
    if (audioElement) {
      setIsPlaying(audioElement.paused);
      if (audioElement.paused) audioElement.play();
      else audioElement.pause();
    }
  };

  useEffect(() => {
    dragElement(document.getElementById("card"), nextSong);
  });

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
          <audio src={song.blob} autoPlay ref={ref} />
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

const Music = () => {
  return (
    <div id="music">
      <Card songs={songs} />
    </div>
  );
};

export default Music;
