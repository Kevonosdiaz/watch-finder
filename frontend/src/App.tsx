import { useState } from "react";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";

type Page = "home" | "watchlist" | "title";

type SelectedWatchlistItem = {
  watchlistId: number;
  titleId: number;
} | null;

function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedTitle, setSeletectedTitle] = useState<SelectedWatchlistItem>(null);
  const goToWatchdata = (watchlistId: number, titleId: number) => {
    setSeletectedTitle({ watchlistId, titleId });
    setPage("title");
  }
  return (
    <>
      {page === "home" && <Home goToWatchlist={() => setPage("watchlist")} />}
      {page === "watchlist" && 
        <Watchlist 
          goToHome={() => setPage("home")}
          goToWatchdata={goToWatchdata}
        />
      }
    </>
  );
}

export default App;