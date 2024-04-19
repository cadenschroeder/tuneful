import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Application from "./pages/Application";
import { AuthProps, Page, PageProps } from "./interfaces/interfaces";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};


initializeApp(firebaseConfig);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState("login");

  const authProps: AuthProps = {
    isAuthenticated,
    setIsAuthenticated,
  };

  const pageProps: PageProps = {
    page,
    setPage,
  };

  const showLogin = !isAuthenticated || page === Page.LOGIN;

  return (
    <div className="App">
      {showLogin ? (
        <Login authProps={authProps} pageProps={pageProps} />
      ) : (
        <Application authProps={authProps} pageProps={pageProps} />
      )}
    </div>
  );
}

export default App;
