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

  const handleBackClick = () => {
    setPage(Page.INTERMEDIATE);
    document.getElementById("App")!.style.background =
      "radial-gradient(#ffffff, #c6bebe)";
  };

  const handleLogoutClick = () => {
    removeLoginCookie();
    setIsAuthenticated(false);
    setPage(Page.LOGIN);
    window.location.hash = "";
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
        </>
      )}
      <button
        className={page === Page.MUSIC ? "selected" : ""}
        onClick={handleMusicClick}
        aria-label="music-button"
      >
        Music
      </button>
      <button onClick={handleLogoutClick} aria-label="swiping-logout">
        {isIncognito ? "Leave Incognito" : "Logout"}
      </button>
      <button onClick={handleBackClick} aria-label="swiping-back">
        {"back"}
      </button>
      <button onClick={handleFinishClick} aria-label="finish-button">
        Finish
      </button>
    </div>
  );
};

export default Menu;
