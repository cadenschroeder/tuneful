import Menu from "../components/Menu";
import Music from "../components/Music";
import { AuthProps, PageProps } from "../interfaces/interfaces";

interface ApplicationProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Application = ({ authProps, pageProps }: ApplicationProps) => {
  return (
    <div id="application">
      <h1>Tuneful!</h1>
      <Music props={null} />
      <Menu authProps={authProps} pageProps={pageProps} />
    </div>
  );
};

export default Application;
