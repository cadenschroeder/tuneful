export interface AuthProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SpotifyProps {
  showSpotify: boolean;
  setShowSpotify: React.Dispatch<React.SetStateAction<boolean>>;
  showPlaylists: boolean;
  setShowPlaylists: React.Dispatch<React.SetStateAction<boolean>>;
  playlists: string[];
  setPlaylists: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface PageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

export interface PlayProps {
  playing: boolean | undefined;
  setPlaying: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export enum Page {
  LOGIN = "login",
  APPLICATION = "application",
  MUSIC = "music",
  SETTINGS = "settings",
  PROFILE = "profile",
}
