import { useState } from "react";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";

function App() {
  const [page, setPage] = useState<"home" | "watchlist">("home");

  return (
    <>
      {page === "home" && <Home goToWatchlist={() => setPage("watchlist")} />}
      {page === "watchlist" && <Watchlist goToHome={() => setPage("home")} />}
    </>
  );
}

export default App;