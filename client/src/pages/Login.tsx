import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { authLoginMock } from "../util/auth";

interface LoginProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Login = ({ authProps, pageProps }: LoginProps) => {
  const { setIsAuthenticated } = authProps;
  const { setPage } = pageProps;

  const handleLogin = () => {
    if (authLoginMock()) {
      setIsAuthenticated(true);
      setPage(Page.MUSIC);
    }
  };

  return (
    <div>
      <h1>Tuneful!</h1>
      <button onClick={handleLogin}>Continue with Google</button>
    </div>
  );
};

export default Login;
