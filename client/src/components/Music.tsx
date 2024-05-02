import React, { useState, useEffect, useRef, useCallback } from "react";
import { songs } from "../utils/consts";
import { AudioVisualizer } from "react-audio-visualize";
import dragElement from "./drag";

interface ActionsProps {
  nextSong: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  isDesktop: boolean;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  setDislikeCount: React.Dispatch<React.SetStateAction<number>>;
  setDataCount: React.Dispatch<React.SetStateAction<number>>;
}

const Actions = ({
  nextSong,
  togglePlay,
  isPlaying,
  isDesktop,
  setLikeCount,
  setDislikeCount,
  setDataCount,
}: ActionsProps) => {
  const handleLike = useCallback(() => {
    setLikeCount(prev => prev + 1);
    setDataCount(prev => prev + 1);
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
    setDislikeCount(prev => prev + 1);
    setDataCount(prev => prev + 1);
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

  useEffect(() => {
    dragElement(document.getElementById("card")!, nextSong, handleToggle);
  }, [nextSong, handleToggle]);

  return (
    <div>
      <div className="buttons">
        {isDesktop && (
          <>
            <button onClick={handleDislike}>👎</button>
            <button onClick={handleToggle}>{isPlaying ? "⏸️" : "▶️"}</button>
            <button onClick={handleLike}>👍</button>
          </>
        )}
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
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  setDislikeCount: React.Dispatch<React.SetStateAction<number>>;
  setDataCount: React.Dispatch<React.SetStateAction<number>>;
}

const Card = ({ songs, appRef, setLikeCount, setDislikeCount, setDataCount }: CardProps) => {
  const [song, setSong] = useState(songs[0]);
  const [blob, setBlob] = useState<Blob>();
  const [playTime, setPlayTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

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

    if (isDesktop) {
      document.getElementById(
        "App"
      )!.style.backgroundImage = `url(${song.cover})`;
      document.getElementById("App")!.style.backdropFilter = "blur(10px)";
    }
  }, [song, appRef, isDesktop]);

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
      <div style={{ position: "relative" }}>
        {!isPlaying && (
          <img
            src="img/pause.png"
            alt="play"
            className="play"
            style={{
              width: "150px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              filter: "invert(1)",
              opacity: 0.8,
              border: "none",
            }}
          />
        )}
        <img
          src={song.cover}
          alt="album cover"
          draggable="false"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            filter: `${isPlaying ? "none" : "brightness(0.9)"}`,
            borderBottom: isDesktop ? "" : "2px solid #bdb6b6",
            marginBottom: isDesktop ? "" : "1em",
          }}
        />
      </div>
      <Actions
        nextSong={nextSong}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        isDesktop={isDesktop}
        setLikeCount={setLikeCount}
        setDislikeCount={setDislikeCount}
        setDataCount={setDataCount}
      />
    </div>
  );
};

interface MusicProps {
  appRef: React.RefObject<HTMLDivElement>;
}

const Music = ({ appRef }: MusicProps) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  return (
    <div id="music">
      <div className="counter-display" style={{ textAlign: "center", fontSize: "20px", marginBottom: "20px" }}>
        Likes: {likeCount} | Dislikes: {dislikeCount} | Session Data Count: {dataCount}
      </div>
      <Card
        songs={songs}
        appRef={appRef}
        setLikeCount={setLikeCount}
        setDislikeCount={setDislikeCount}
        setDataCount={setDataCount}
      />
      <button
        onClick={() => { setDataCount(0) }}
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          background: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Clear session data
      </button>
    </div>
  );
};

export default Music;
