export interface AuthProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
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
