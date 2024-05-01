import React, { useState, useEffect, useCallback } from "react";
import { PageProps } from "../interfaces/interfaces";
import { removeLoginCookie } from "../utils/cookie";
import AccountLogin from "./AccountLogin";
import axios from "axios";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const GENRES = [
  "Pop",
  "Hip Hop",
  "Rock",
  "Classical",
  "Country",
  "R&B",
  "Electronic",
  "Alternative",
];

interface IntermediateProps {
  pageProps: PageProps;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Intermediate = ({ pageProps, setIsAuthenticated }: IntermediateProps) => {
  const [token, setToken] = useState("");
  const [, setData] = useState<JSON>();
  const [playlists, setPlaylists] = useState([]);
  const { setPage } = pageProps;
  const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);
  const [signedInWithoutSpotify, setSignedInWithoutSpotify] = useState(false);
  const [genreChoice, setGenreChoice] = useState("");
  const [playlistChoice, setPlaylistChoice] = useState<{ name: string }>();
  const getPlaylists = useCallback(() => {
    console.log("token: " + token);

    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response: any) => {
        setData(response.data);
        setPlaylists(response.data.items);
        console.log(response.data.items);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    const retrievedToken = localStorage.getItem("accessToken");
    if (retrievedToken != null) {
      setToken(retrievedToken);
    }
    console.log(retrievedToken);
    if (signedInWithSpotify) {
      getPlaylists();
    }
  }, [signedInWithSpotify, getPlaylists]);

  useEffect(() => {
    console.log("Signed In With Spotify:", signedInWithSpotify);
  }, [signedInWithSpotify]);

  const handleLogout = () => {
    removeLoginCookie();
    window.location.hash = "";
    setIsAuthenticated(false);
    setPage("login");
    setSignedInWithSpotify(false);
    setSignedInWithoutSpotify(false);
  };

  const handleBackClick = () => {
    setSignedInWithSpotify(false);
    window.location.hash = "";
    setSignedInWithoutSpotify(false);
  };

  const handleSpotifyLoginSuccess = () => {
    console.log("Spotify login successful");
    setSignedInWithSpotify(true);
  };

  const handleContinue = () => {
    setPage("music");
  };

  if (signedInWithSpotify) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="intermediate">Select to Start</h1>

        <h2 id="select-header">
          {playlistChoice
            ? `Chosen: ${playlistChoice.name}`
            : "Select a Playlist"}
        </h2>
        <div className="radio-group">
          {playlists.map((playlist: { name: string }) => (
            <div className="radio-element">
              <input
                type="radio"
                id={playlist.name}
                name="playlist"
                value={playlist.name}
                onChange={(e) => setPlaylistChoice(playlist)}
              ></input>
              <label htmlFor={playlist.name}>{playlist.name}</label>
            </div>
          ))}
        </div>

        <h2 id="select-header">
          {genreChoice ? `Chosen: ${genreChoice}` : "or select a Genre"}
        </h2>

        <div className="radio-group">
          {GENRES.map((genre) => (
            <div>
              <input
                type="radio"
                id={genre}
                name="genre"
                value={genre}
                onChange={(e) => setGenreChoice(e.target.value)}
              ></input>
              <label htmlFor={genre}>{genre}</label>
            </div>
          ))}
        </div>
        <p>{playlistChoice?.name}</p>
        <p>{genreChoice}</p>

        <button onClick={handleContinue}>Continue</button>
        <button onClick={handleBackClick} style={{ marginTop: "20px" }}>
          {"back"}
        </button>
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    );
  }

  if (signedInWithoutSpotify) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="intermediate">Select to Start</h1>

        <h2 id="select-header">
          {genreChoice ? `Chosen: ${genreChoice}` : "Select a Genre"}
        </h2>

        <div className="radio-group">
          {GENRES.map((genre) => (
            <div>
              <input
                type="radio"
                id={genre}
                name="genre"
                value={genre}
                onChange={(e) => setGenreChoice(e.target.value)}
              ></input>
              <label htmlFor={genre}>{genre}</label>
            </div>
          ))}
        </div>

        <p>{playlistChoice?.name}</p>
        <p>{genreChoice}</p>

        <button onClick={handleContinue}>Continue</button>
        <button onClick={handleBackClick} style={{ marginTop: "20px" }}>
          {"back"}
        </button>
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <AccountLogin onLoginSuccess={handleSpotifyLoginSuccess} />
      <button onClick={() => setSignedInWithoutSpotify(true)}>
        Continue without signing into Spotify
      </button>
      <button onClick={handleLogout}>Logout</button>
      <button
        onClick={handleLogout}
        style={{ marginLeft: "10px", marginRight: "10px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Intermediate;
