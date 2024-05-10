import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { authLoginMock } from "../utils/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addLoginCookie } from "../utils/cookie";
import { emojis, puns } from "../utils/consts";
import { useState } from "react";

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

  const [pun, setPun] = useState(puns[Math.floor(Math.random() * puns.length)]);

  const handleClickPun = () => {
    let newPun = pun;
    while (pun === newPun) {
      newPun = puns[Math.floor(Math.random() * puns.length)];
    }
    setPun(newPun);
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
      {emojis.map((emoji, i) => {
        return (
          <span
            key={i}
            role="img"
            aria-label="SFX"
            style={{
              position: "absolute",
              top: "-10vh",
              left: `${Math.random() * 100}vw`,
              zIndex: -1,
              animation: `fallingAnimation 10s ease ${
                (i / emojis.length) * 10
              }s infinite`,
            }}
          >
            {emoji}
          </span>
        );
      })}
      <h1>tuneful</h1>
      <h2 id="pun" onClick={handleClickPun}>
        {pun}
      </h2>
      <p>
        <button
          onClick={signInWithGoogle}
          style={{ zIndex: 5, background: "rgb(158 155 155)" }}
        >
          Continue with Google
        </button>
      </p>
      <p>
        <button
          onClick={handleLoginIncognito}
          style={{ zIndex: 5, background: "rgb(158 155 155)" }}
        >
          Incognito
        </button>
      </p>
    </div>
  );
};

export default Login;
