import React, { useState, useEffect, useRef, useCallback } from "react";

import { AudioVisualizer } from "react-audio-visualize";
import dragElement from "./drag";
import {
  addToLocalStorage,
  getFromLocalStorage,
  getThemeFromLocalStorage,
  fetchSongsQueue,
} from "../utils/storage";
import { getRecommendations, clearUserSession } from "../utils/api";

interface ActionsProps {
  nextSong: (liked: boolean) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  isDesktop: boolean;
}

const Actions = ({
  nextSong,
  togglePlay,
  isPlaying,
  isDesktop,
}: ActionsProps) => {
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
          nextSong(true);
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
          nextSong(false);
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

export interface Song {
  name: string;
  cover: string;
  artist: string;
  blob: string;
  spotify: string;
  songId: string;
}

const Card = () => {
  const [song, setSong] = useState(
    getFromLocalStorage("songs")[0] || {
      name: "Loading...",
      cover: "img/loading.gif",
      artist: "Loading...",
      blob: "wait.mp3",
      spotify: "",
      songId: "",
    }
  );
  const [blob, setBlob] = useState<Blob>();
  const [playTime, setPlayTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  const [likes, setLikes] = useState<Song[]>([]);
  const [dislikes, setDislikes] = useState<Song[]>([]);

  useEffect(() => {
    setLikes(getFromLocalStorage("likes"));
    setDislikes(getFromLocalStorage("dislikes"));

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

    if (isDesktop && song.name !== "Loading...") {
      document.getElementById(
        "App"
      )!.style.backgroundImage = `url(${song.cover})`;
      document.getElementById("App")!.style.backdropFilter = "blur(10px)";
    }
  }, [song, isDesktop]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const queueSong = getFromLocalStorage("songs")[0];
    if (queueSong && queueSong.name !== song.name) {
      setSong(queueSong);
    }
    if (audioElement) {
      setIsPlaying(!audioElement.paused);
      const updatePlayTime = () => setPlayTime(audioElement.currentTime);
      audioElement.addEventListener("timeupdate", updatePlayTime);

      return () =>
        audioElement.removeEventListener("timeupdate", updatePlayTime);
    }
  }, [blob, playTime, song.name]);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const newPlayingState = audioElement.paused;
      setIsPlaying(!newPlayingState);
      newPlayingState ? audioElement.play() : audioElement.pause();
    }
  };

  const nextSong = useCallback(
    (liked: boolean) => {
      if (liked) {
        addToLocalStorage("likes", song);
      } else {
        addToLocalStorage("dislikes", song);
      }

      const songString = '["' + song.songId + '"]';

      // Defines how many songs to recommend. Based on how many already in que
      const numWanted = Math.max(0, 7 - getFromLocalStorage("songs").length);
      getRecommendations(
        songString,
        liked.toString(),
        "false",
        "",
        numWanted.toString()
      );
      setSong(
        fetchSongsQueue()[0] || {
          name: "Loading...",
          cover: "img/loading.gif",
          artist: "Loading...",
          blob: "wait.mp3",
          spotify: "",
        }
      );
    },
    [song]
  );

  const theme = getThemeFromLocalStorage();

  return (
    <>
      <div
        className="counter-display"
        style={{
          textAlign: "center",
          fontSize: "20px",
          marginBottom: "20px",
          position: "absolute",
        }}
      >
        <button>{theme || "random"}</button>
        <button>
          👍: {likes.length} 👎: {dislikes.length}
        </button>
        <button onClick={handleClearClick}>clear session</button>
      </div>
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
          nextSong={(liked: boolean) => nextSong(liked)}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          isDesktop={isDesktop}
        />
      </div>
    </>
  );
};

export function Music() {
  return (
    <div id="music">
      <Card />
    </div>
  );
}

const handleClearClick = () => {
  console.log("clearing session data");
  clearUserSession();
};

export default Music;
