import React, { useState, useEffect } from 'react';
import { PageProps } from '../interfaces/interfaces';
import { removeLoginCookie } from '../utils/cookie';
import AccountLogin from './AccountLogin';

interface IntermediateProps {
  pageProps: PageProps;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Intermediate = ({ pageProps, setIsAuthenticated }: IntermediateProps) => {
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
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Select a Playlist</h1>
        <button onClick={() => console.log("Playlist One selected")}>Playlist One</button>
        <button onClick={() => console.log("Playlist Two selected")}>Playlist Two</button>
        <button onClick={() => console.log("Playlist Three selected")}>Playlist Three</button>
        <button onClick={handleContinue}>Continue</button>
        <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AccountLogin onLoginSuccess={handleSpotifyLoginSuccess} />
      <button onClick={() => setPage("music")}>Continue without signing into Spotify</button>
      <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
    </div>
  );
};

export default Intermediate;