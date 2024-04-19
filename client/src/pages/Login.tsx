import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { authLoginMock } from "../utils/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addLoginCookie, removeLoginCookie } from "../utils/cookie";

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

  const auth = getAuth();

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      const userEmail = response.user.email || "";

      // Check if the email ends with the allowed domain
      if (userEmail.endsWith("@brown.edu")) {
        console.log(response.user.uid);
        // add unique user id as a cookie to the browser.
        addLoginCookie(response.user.uid);
        setIsAuthenticated(true);
      } else {
        // User is not allowed, sign them out and show a message
        await auth.signOut();
        console.log("User not allowed. Signed out.");
      }
    } catch (error) {
      console.log(error);
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
