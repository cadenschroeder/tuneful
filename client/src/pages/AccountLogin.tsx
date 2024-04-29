import React, { useEffect } from "react";

interface AccountLoginProps {
  onLoginSuccess: () => void;
}

const CLIENT_ID = "12f6f43b0e464dd0b0a5e1f6c4a18386";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = ["playlist-read-private"];
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const getReturnedParamsFromSpotifyAuth = (hash: string) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce(
    (accumulater: { [key: string]: string }, currentValue) => {
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
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    const authUrl = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(
      SCOPES_URL_PARAM
    )}&response_type=token&show_dialog=true`;
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
