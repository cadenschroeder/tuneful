import React from 'react';
import { PageProps } from '../interfaces/interfaces';
import { removeLoginCookie } from '../utils/cookie';
import AccountLogin from './AccountLogin';

interface IntermediateProps {
  pageProps: PageProps;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Intermediate = ({ pageProps, setIsAuthenticated }: IntermediateProps) => {
  const { setPage } = pageProps;

  const handleLogout = () => {
    removeLoginCookie(); // Clear the cookie or any other session storage
    setIsAuthenticated(false); // Update authentication state
    setPage("login"); // Redirect to Login page
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AccountLogin />
      <button onClick={() => setPage("music")}>Continue without connecting playlists</button>
      <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
    </div>
  );
};

export default Intermediate;