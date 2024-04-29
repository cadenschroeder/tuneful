import { AuthProps, Page, PageProps } from "../interfaces/interfaces";
import { getLoginCookie, removeLoginCookie } from "../utils/cookie";

interface MenuProps {
  authProps: AuthProps;
  pageProps: PageProps;
}

const Menu = ({ authProps, pageProps }: MenuProps) => {
  const { setIsAuthenticated } = authProps;
  const { page, setPage } = pageProps;

  const hanleProfileClick = () => {
    setPage(Page.PROFILE);
  };

  const handleMusicClick = () => {
    setPage(Page.MUSIC);
  };

  const handleLogoutClick = () => {
    removeLoginCookie();
    setIsAuthenticated(false);
    setPage(Page.LOGIN);
    document.getElementById("App")!.style.background =
      "radial-gradient(#ffffff, #c6bebe)";
  };

  const handleFinishClick = () => {
    setPage(Page.FINISH);
  };

  const isIncognito = getLoginCookie() === "incognito";

  return (
    <div id="menu">
      {!isIncognito && (
        <>
          <button
            className={page === Page.PROFILE ? "selected" : ""}
            onClick={hanleProfileClick}
          >
            Profile
          </button>
          <button
            className={page === Page.MUSIC ? "selected" : ""}
            onClick={handleMusicClick}
          >
            Music
          </button>
        </>
      )}
      <button onClick={handleLogoutClick}>
        {isIncognito ? "Leave Incognito" : "Logout"}
      </button>
      {page !== Page.FINISH && (
        <button onClick={handleFinishClick}>Finish</button>
      )}
    </div>
  );
};

export default Menu;
