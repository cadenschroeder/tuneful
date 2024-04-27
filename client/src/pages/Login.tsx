import {
  AuthProps,
  Page,
  PageProps,
  SpotifyProps,
} from "../interfaces/interfaces";
import { authLoginMock } from "../utils/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addLoginCookie } from "../utils/cookie";
import SpotifyLogin from "../components/SpotifyLogin";

interface LoginProps {
  authProps: AuthProps;
  pageProps: PageProps;
  spotifyProps: SpotifyProps;
}

const Login = ({ authProps, pageProps, spotifyProps }: LoginProps) => {
  const { setIsAuthenticated } = authProps;
  const { setPage } = pageProps;
  const { showSpotify, setShowSpotify, showPlaylists, playlists } =
    spotifyProps;

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
          {!showPlaylists ? (
            <>
              <p>
                <SpotifyLogin spotifyProps={spotifyProps} />
              </p>
              <p>
                <button onClick={handleSpotifySkip}>Skip</button>
              </p>
            </>
          ) : (
            <ul>
              {playlists.map((playlist) => (
                <button key={playlist}>{playlist}</button>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Login;
