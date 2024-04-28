import React, { useState, useEffect } from "react";
import { PageProps } from "../interfaces/interfaces";
import { removeLoginCookie } from "../utils/cookie";
import AccountLogin from "./AccountLogin";
import signOutSpotify from './AccountLogin';
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
  const { setPage } = pageProps;
  const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);

  useEffect(() => {
    const retrievedToken = localStorage.getItem("accessToken");
    if (retrievedToken != null) {
      setToken(retrievedToken);
    }
    // console.log(retrievedToken);
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
        <div className="radio-group">
          <input type="radio" id="playlist1" name="playlist" value="playlist1"></input>
          <label htmlFor="playlist1">Playlist One</label>
          <input type="radio" id="playlist2" name="playlist" value="playlist2"></input>
          <label htmlFor="playlist2">Playlist Two</label>
          <input type="radio" id="playlist3" name="playlist" value="playlist3"></input>
          <label htmlFor="playlist3">Playlist Three</label>
        </div>
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
