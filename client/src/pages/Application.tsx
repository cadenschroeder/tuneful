import Menu from "../components/Menu";
import Music from "../components/Music";
import Profile from "../components/Profile";
import {
  AuthProps,
  Page,
  PageProps,
  SpotifyProps,
} from "../interfaces/interfaces";

interface ApplicationProps {
  authProps: AuthProps;
  pageProps: PageProps;
  spotifyProps: SpotifyProps;
}

const Application = ({
  authProps,
  pageProps,
  spotifyProps,
}: ApplicationProps) => {
  const { page } = pageProps;

  const CurrentPage = (): JSX.Element => {
    switch (page) {
      case Page.PROFILE:
        return <Profile props={null} />;
      default:
        return <Music />;
    }
  };

  return (
    <div id="application">
      <div></div>
      <CurrentPage />
      <Menu
        spotifyProps={spotifyProps}
        authProps={authProps}
        pageProps={pageProps}
      />
    </div>
  );
};

export default Application;
