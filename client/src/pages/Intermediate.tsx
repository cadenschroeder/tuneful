import React, { useState, useEffect, useCallback } from "react";
import { PageProps } from "../interfaces/interfaces";
import { removeLoginCookie } from "../utils/cookie";
import AccountLogin from "./AccountLogin";
import axios from "axios";
import { setThemeToLocalStorage } from "../utils/storage";
import { clearUserSession, getRecommendations } from "../utils/api";
import { useSpotifyAuth } from '../contexts/SpotifyAuthContext';

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
  const { token, setToken, signedInWithSpotify, setSignedInWithSpotify } = useSpotifyAuth();
  // const [token, setToken] = useState("");
  const [, setData] = useState<JSON>();
  const [playlists, setPlaylists] = useState([]);
  const [genreSelection, setGenreSelection] = useState("");
  const { setPage } = pageProps;
  // const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);
  const [signedInWithoutSpotify, setSignedInWithoutSpotify] = useState(false);
  const [playlistChoice, setPlaylistChoice] = useState<{
    name: string;
    tracks: { href: string };
  }>();
  const [selectedItem, setSelectedItem] = useState({ type: "", name: "" });

  const getPlaylists = useCallback(() => {
    console.log("token: " + token);

    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response: any) => {
        setData(response.data.items);
        setPlaylists(response.data.items);
        console.log(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [token]);

  const getTrackList = async (trackListURL: string) => {
    console.log("api url: " + trackListURL);

    try {
      const response = await axios.get(trackListURL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return response.data.items; // returns data as a Promise
    } catch (e) {
      console.log(e);
    }
  };

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

  const handleSelection = (type: string, name: string) => {
    setSelectedItem({ type, name });
  };

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

  interface Playlist {
    track: {
      id: string;
    };
  }

  const handleContinue = () => {
    clearUserSession();
    let playlist: Playlist[] = [];
    // TODO: somehow send playlist / genre information to backend
    if (playlistChoice) {
      console.log("link: " + playlistChoice.tracks.href);
      getTrackList(playlistChoice.tracks.href).then((response) => {
        playlist = response;
        console.log("first track id");
        console.log(playlist[0].track.id);

        let trackIDs: string[] = [];
        playlist.forEach(function (track) {
          trackIDs.push(track.track.id);
        });

        const trackIDsString = JSON.stringify(trackIDs);
        clearUserSession().then(() => {
          getRecommendations(trackIDsString, "true", "true", "", "10"); 
          setThemeToLocalStorage(selectedItem.name);
          setPage("music");
        });
        // call handler with the track ids array

        console.log(trackIDsString);
      });
    } else if (genreSelection){
      clearUserSession().then(() => {
       const recommendation = getRecommendations("[]", "true", "true", genreSelection, "10");
       recommendation.then(() => {
        console.log("Genre given recommendations " +  recommendation)
        setThemeToLocalStorage(selectedItem.name);
        setPage("music");
       })
      });
    }

    // setThemeToLocalStorage(selectedItem.name);
    // setPage("music");
  };

  if (signedInWithSpotify) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <h1 className="intermediate">Select to Start</h1>
        <h2 id="select-header">
          {selectedItem.name ? `Chosen: ${selectedItem.name}` : "Select a Playlist or a Genre"}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <div className="radio-group" style={{ maxHeight: '30vh' }}>
            {/* Map over playlists to render actual radio buttons */}
            {playlists.map((playlist: { name: string; tracks: { href: string } }) => (
              <div className="radio-element" key={playlist.name}>
                <input type="radio" id={playlist.name} name="playlist" value={playlist.name}
                      onChange={() => { setPlaylistChoice(playlist); handleSelection("playlist", playlist.name); }} />
                <label htmlFor={playlist.name}>{playlist.name}</label>
              </div>
            )
          )}
        </div>

        <div className="radio-group" style={{ maxHeight: '20vh' }}>
          {GENRES.map((genre) => (
            <div key={genre}>
              <input
                type="radio"
                id={genre}
                name="selection"
                value={genre}
                onChange={() => 
                  {setGenreSelection(genre)
                  handleSelection("genre", genre)}}
              />
              <label htmlFor={genre}>{genre}</label>
            </div>
          ))}

        </div>
        <div className="flex">
          <button onClick={handleContinue}>Continue</button>
          <button onClick={handleBackClick} style={{ marginTop: "20px" }}>{"back"}</button>
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
        </div>
      </div>
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
          {selectedItem.name
            ? `Chosen: ${selectedItem.name}`
            : "Select a Playlist or a Genre"}
        </h2>

        <div className="radio-group">
          {GENRES.map((genre, key) => (
            <div key={key}>
              <input
                type="radio"
                id={genre}
                name="genre"
                value={genre}
                onChange={(e) => {setGenreSelection(genre)
                  handleSelection("genre", genre)}}
              ></input>
              <label htmlFor={genre}>{genre}</label>
            </div>
          ))}
        </div>

        <div className="flex">
          <button onClick={handleContinue}>Continue</button>
          <button onClick={handleBackClick} style={{ marginTop: "20px" }}>
            {"back"}
          </button>
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </div>
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
    </div>
  );
};

export default Intermediate;
