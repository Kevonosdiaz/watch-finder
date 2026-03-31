import { useState } from "react";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Watchdata from "./pages/Watchdata";
import Profile from "./pages/Profile";
import Password from "./pages/Password";

type Page = "home" | "watchlist" | "watchdata" | "password" | "profile";

type SelectedWatchlistItem = {
  watchlistId: number;
  titleId: number;
} | null;

function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedTitle, setSeletectedTitle] = useState<SelectedWatchlistItem>(null);
  const goToWatchdata = (watchlistId: number, titleId: number) => {
    setSeletectedTitle({ watchlistId, titleId });
    setPage("watchdata");
  }
  return (
    <>
      {page === "home" && <Home goToWatchlist={() => setPage("watchlist")} goToProfile={() => setPage("profile")} goToPassword={() => setPage("password")} />}
      {page === "watchlist" && 
        <Watchlist 
          goToHome={() => setPage("home")}
          goToWatchdata={goToWatchdata}
        />
      }
      {page === "profile" && (
        <Profile goToHome={() => setPage("home")} />
      )}
      {page === "password" && (
        <Password goBack={() => setPage("home")} />
      )}
      {page === "watchdata" && selectedTitle && (
        <Watchdata
          watchlistId={selectedTitle.watchlistId}
          titleId={selectedTitle.titleId}
          goBack={() => setPage("watchlist")}
        />
      )}
    </>
  );
}

export default App;