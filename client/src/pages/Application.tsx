import Menu from "../components/Menu";
import Music from "../components/Music";
import Profile from "../components/Profile";
import { AuthProps, Page, PageProps } from "../interfaces/interfaces";

interface ApplicationProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Application = ({ authProps, pageProps }: ApplicationProps) => {
  const { page } = pageProps;

  const handleTunefulClick = () => {
    window.location.reload();
  };

  const CurrentPage = (): JSX.Element => {
    switch (page) {
      case Page.PROFILE:
        return <Profile props={null} />;
      default:
        return <Music props={null} />;
    }
  };

  return (
    <div id="application">
      <button onClick={handleTunefulClick}>tuneful</button>
      <CurrentPage />
      <Menu authProps={authProps} pageProps={pageProps} />
    </div>
  );
};

export default Application;
