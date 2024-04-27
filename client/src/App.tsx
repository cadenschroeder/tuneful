import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import Application from "./pages/Application";
import { AuthProps, Page, PageProps } from "./interfaces/interfaces";
import { initializeApp } from "firebase/app";
import { getLoginCookie } from "./utils/cookie";
import Footer from "./components/Footer";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("login");
  const [showSpotify, setShowSpotify] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState<string[]>([]);

  const authProps: AuthProps = {
    isAuthenticated,
    setIsAuthenticated,
  };

  const pageProps: PageProps = {
    page,
    setPage,
  };

  const spotifyProps = {
    showSpotify,
    setShowSpotify,
    showPlaylists,
    setShowPlaylists,
    playlists,
    setPlaylists,
  };

  const showLogin = !isAuthenticated || page === Page.LOGIN;

  useEffect(() => {
    const cookie: string | undefined = getLoginCookie();
    if (!!cookie && cookie !== "incognito") {
      setIsAuthenticated(true);
      setShowSpotify(true);
    }
  }, []);

  return (
    <div className="App" id="App">
      {showLogin ? (
        <Login
          authProps={authProps}
          pageProps={pageProps}
          spotifyProps={spotifyProps}
        />
      ) : (
        <Application
          spotifyProps={spotifyProps}
          authProps={authProps}
          pageProps={pageProps}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
