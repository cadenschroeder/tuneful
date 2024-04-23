import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { authLoginMock } from "../utils/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addLoginCookie } from "../utils/cookie";

interface LoginProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Login = ({ authProps, pageProps }: LoginProps) => {
  const { setIsAuthenticated } = authProps;
  const { setPage } = pageProps;

  const handleLoginIncognito = () => {
    if (authLoginMock()) {
      setIsAuthenticated(true);
      setPage(Page.INTERMEDIATE); 
      addLoginCookie("incognito");
    }
  };

  const auth = getAuth();

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      const userEmail = response.user.email || "";
      if (!!userEmail) {
        addLoginCookie(response.user.uid);
        setIsAuthenticated(true);
        setPage(Page.INTERMEDIATE);
      } else {
        await auth.signOut();
      }
    } catch (error) {
      alert("Error signing in with Google");
    }
  };

  return (
    <div id="login">
      <h1>tuneful</h1>
      <p>
        <button onClick={signInWithGoogle}>Continue with Google</button>
      </p>
      <p>
        <button onClick={handleLoginIncognito}>Incognito</button>
      </p>
    </div>
  );
};

export default Login;
