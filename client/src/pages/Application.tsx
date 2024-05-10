import Finish from "../components/Finish";
import Menu from "../components/Menu";
import Music from "../components/Music";
import Profile from "../components/Profile";
import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { useEffect } from "react";
import { fetchSongsQueue } from "../utils/storage";
import { SpotifyAuthProvider } from '../contexts/SpotifyAuthContext';

interface ApplicationProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Application = ({ authProps, pageProps }: ApplicationProps) => {
  const { page } = pageProps;

  useEffect(() => {
    fetchSongsQueue();
  }, []);

  const CurrentPage = (): JSX.Element => {
    switch (page) {
      case Page.PROFILE:
        return <SpotifyAuthProvider> <Profile props={null} /> </SpotifyAuthProvider>;
      case Page.FINISH:
        return <SpotifyAuthProvider> <Finish /> </SpotifyAuthProvider>;
      default:
        return <SpotifyAuthProvider> <Music /> </SpotifyAuthProvider>;
    }
  };

  return (
    <SpotifyAuthProvider>
      <div id="application">
        <div></div>
        <CurrentPage />
        <Menu authProps={authProps} pageProps={pageProps} />
      </div>
    </SpotifyAuthProvider>
  );
};

export default Application;
