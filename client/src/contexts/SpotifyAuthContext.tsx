import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpotifyAuthContextType {
  signedInWithSpotify: boolean;
  setSignedInWithSpotify: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
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

  return (
    <SpotifyAuthContext.Provider value={{ signedInWithSpotify, setSignedInWithSpotify, token, setToken }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};