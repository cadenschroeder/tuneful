import {
  AuthProps,
  Page,
  PageProps,
  SpotifyProps,
} from "../interfaces/interfaces";
import { authLoginMock } from "../utils/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addLoginCookie } from "../utils/cookie";

interface LoginProps {
  authProps: AuthProps;
  pageProps: PageProps;
  spotifyProps: SpotifyProps;
}

const Login = ({ authProps, pageProps, spotifyProps }: LoginProps) => {
  const { setIsAuthenticated } = authProps;
  const { setPage } = pageProps;
  const { showSpotify, setShowSpotify } = spotifyProps;

  const handleLoginIncognito = () => {
    if (authLoginMock()) {
      setIsAuthenticated(true);
      addLoginCookie("incognito");
      setShowSpotify(true);
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
        setShowSpotify(true);
      } else {
        await auth.signOut();
      }
    } catch (error) {
      alert("Error signing in with Google");
    }
  };

  const handleSpotifyLogin = () => {
    setPage(Page.MUSIC);
  };

  const handleSpotifySkip = () => {
    setPage(Page.MUSIC);
  };

  return (
    <div id="login">
      <h1>tuneful</h1>
      {!showSpotify ? (
        <>
          <p>
            <button onClick={signInWithGoogle}>Continue with Google</button>
          </p>
          <p>
            <button onClick={handleLoginIncognito}>Incognito</button>
          </p>
        </>
      ) : (
        <>
          <p>
            <button onClick={handleSpotifyLogin}>Connect Spotify</button>
          </p>
          <p>
            <button onClick={handleSpotifySkip}>Skip</button>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;
