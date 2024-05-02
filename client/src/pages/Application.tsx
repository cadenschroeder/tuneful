import Finish from "../components/Finish";
import Menu from "../components/Menu";
import Music from "../components/Music";
import Profile from "../components/Profile";
import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { viewSongs, getRecommendations } from "../utils/api";
import { Song } from "../components/Music";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface ApplicationProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Application = ({ authProps, pageProps }: ApplicationProps) => {
  const { page } = pageProps;
  const [songs, setList] = useState<Song[]>([]);

  useEffect(() => {
    async function callFormat(){
      let songList = await formatSongs(songs, setList)
      console.log(songList)
      setList(songList)
    }
    callFormat()
  }, []);

  const CurrentPage = (): JSX.Element => {
    switch (page) {
      case Page.PROFILE:
        return <Profile props={null} />;
      case Page.FINISH:
        return <Finish />;
      default:
        return <Music />;
    }
  };

  return (
    <div id="application">
      <div></div>
      <CurrentPage />
      <Menu authProps={authProps} pageProps={pageProps} />
    </div>
  );
};

async function formatSongs(songs: Song[], setList: (list: Song[]) => void) {
  const result = await viewSongs();
  return result.responseMap.songs.map((mapSong: { [key: string]: any }) => {
    const name: string = mapSong.name?.toString() || "";
    const cover: string = mapSong.images?.toString() || "";
    const artist: string = mapSong.artists?.toString() || "";
    const blob: string = mapSong.snippetURL?.toString() || "";
    const spotify: string =
      "https://open.spotify.com/track/3Z2y6rX1dZCfLJ9yZGzQw5"; // TODO: ask and fix what this does

    return {
      name: name,
      cover: cover,
      artist: artist,
      blob: blob,
      spotify: spotify,
    };
  });
}

export default Application;
