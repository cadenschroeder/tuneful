import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlaylistChoice {
  name: string;
  tracks: { href: string };
}

interface SpotifyAuthContextType {
  signedInWithSpotify: boolean;
  setSignedInWithSpotify: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  playlistChoice: PlaylistChoice | null;
  setPlaylistChoice: React.Dispatch<React.SetStateAction<PlaylistChoice | null>>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (context === undefined) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};

export const SpotifyAuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [signedInWithSpotify, setSignedInWithSpotify] = useState(false);
  const [token, setToken] = useState("");
  const [playlistChoice, setPlaylistChoice] = useState<PlaylistChoice | null>(null);

  return (
    <SpotifyAuthContext.Provider value={{ signedInWithSpotify, setSignedInWithSpotify, token, setToken, playlistChoice, setPlaylistChoice }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};