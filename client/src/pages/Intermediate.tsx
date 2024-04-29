import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState<JSON>();
  const [playlists, setPlaylists] = useState([]);
  const { setPage } = pageProps;
  const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);
  const [signedInWithoutSpotify, setSignedInWithoutSpotify] = useState(false);
  const [genreChoice, setGenreChoice] = useState("");
  const [playlistChoice, setPlaylistChoice] = useState("");

  useEffect(() => {
    const retrievedToken = localStorage.getItem("accessToken");
    if (retrievedToken != null) {
      setToken(retrievedToken);
    }
    console.log(retrievedToken);
    if (signedInWithSpotify) {
      getPlaylists();
    }
  }, [signedInWithSpotify]);

  const getPlaylists = () => {
    console.log("token: " + token);

    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setData(response.data);
        setPlaylists(response.data.items);
        console.log(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <h1>Select to Start</h1>

        <h2 id="select-header">Select a Playlist</h2>
        <div className="radio-group">
          {playlists.map((playlist: { name: string }) => (
            <div className="radio-element">
              <input
                type="radio"
                id={playlist.name}
                name="playlist"
                value={playlist.name}
                onChange={(e) => setPlaylistChoice(e.target.value)}
              ></input>
              <label htmlFor={playlist.name}>{playlist.name}</label>
            </div>
          ))}
        </div>

        <h2 id="select-header">or Select a Genre</h2>

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

        <p>{playlistChoice}</p>
        <p>{genreChoice}</p>

        <button onClick={handleContinue}>Continue</button>
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
        <h1>Select to Start</h1>

        <h2 id="select-header">Select a Genre</h2>

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

        <p>{playlistChoice}</p>
        <p>{genreChoice}</p>

        <button onClick={handleContinue}>Continue</button>
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
      }}
    >
      <AccountLogin onLoginSuccess={handleSpotifyLoginSuccess} />
      <button onClick={() => setSignedInWithoutSpotify(true)}>
        Continue without signing into Spotify
      </button>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default Intermediate;
