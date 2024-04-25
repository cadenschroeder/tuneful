import React, { useEffect } from "react";

interface AccountLoginProps {
  onLoginSuccess: () => void;
}

const CLIENT_ID = "your_spotify_client_id";
const REDIRECT_URI = "http://localhost:3000/intermediate";
const SCOPES = ["playlist-read-private"];
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const getReturnedParamsFromSpotifyAuth = (hash: string) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce(
    (accumulater: { [key: string]: string }, currentValue) => {
      console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    },
    {}
  );

  return paramsSplitUp;
};

const AccountLogin: React.FC<AccountLoginProps> = ({ onLoginSuccess }) => {
  useEffect(() => {
    if (window.location.hash) {
      const { access_token } = Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)));
      if (access_token) {
        localStorage.setItem("spotify_access_token", access_token);
        onLoginSuccess();
      }
      window.location.hash = ''; // Clear the hash to prevent re-triggering login success
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    const authUrl = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES_URL_PARAM)}&response_type=token&show_dialog=true`;
    console.log("Redirecting to Spotify login:", authUrl);
    window.location.href = authUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default AccountLogin;

