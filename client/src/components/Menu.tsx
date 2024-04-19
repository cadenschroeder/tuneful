import { AuthProps, PageProps } from "../interfaces/interfaces";

interface MenuProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Menu = ({ authProps, pageProps }: MenuProps) => {
  const { setIsAuthenticated } = authProps;
  const { setPage } = pageProps;

  const hanleProfileClick = () => {
    setPage("profile");
  };

  const handleMusicClick = () => {
    setPage("music");
  };

  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    setPage("login");
  };

  return (
    <div id="menu">
      <button onClick={hanleProfileClick}>Profile</button>
      <button onClick={handleMusicClick}>Music</button>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Menu;
