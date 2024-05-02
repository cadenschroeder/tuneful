import Finish from "../components/Finish";
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

export default Application;
