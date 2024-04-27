import React, { useState, useEffect } from "react";
import { PageProps } from "../interfaces/interfaces";
import { removeLoginCookie } from "../utils/cookie";
import AccountLogin from "./AccountLogin";
import axios from "axios";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

interface IntermediateProps {
  pageProps: PageProps;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Intermediate = ({ pageProps, setIsAuthenticated }: IntermediateProps) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState<JSON>();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const retrievedToken = localStorage.getItem("accessToken");
    if (retrievedToken != null) {
      setToken(retrievedToken);
    }
    getPlaylists();
  }, []);

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

  const { setPage } = pageProps;
  const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);

  useEffect(() => {
    console.log("Signed In With Spotify:", signedInWithSpotify);
  }, [signedInWithSpotify]);

  const handleLogout = () => {
    removeLoginCookie();
    setIsAuthenticated(false);
    setPage("login");
    setSignedInWithSpotify(false); // Make sure to reset Spotify login state on logout
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
        <h1>Select a Playlist</h1>

        {playlists.map((playlist: { name: string }) => (
          <p>{playlist.name}</p>
        ))}

        <button onClick={() => console.log("Playlist One selected")}>
          Playlist One
        </button>
        <button onClick={() => console.log("Playlist Two selected")}>
          Playlist Two
        </button>
        <button onClick={() => console.log("Playlist Three selected")}>
          Playlist Three
        </button>
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
      <button onClick={() => setPage("music")}>
        Continue without signing into Spotify
      </button>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default Intermediate;
