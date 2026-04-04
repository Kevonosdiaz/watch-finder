import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Watchdata from "./pages/Watchdata";
import Profile from "./pages/Profile";
import Password from "./pages/Password";
import AdminDashboard from "./pages/AdminDashboard";

type Page = "login" | "signup" | "home" | "watchlist" | "watchdata" | "password" | "profile" | "admin";

type SelectedWatchlistItem = {
  watchlistId: number;
  titleId: number;
} | null;

function App() {
  const [page, setPage] = useState<Page>("login");
  const [selectedTitle, setSeletectedTitle] = useState<SelectedWatchlistItem>(null);
  const goToWatchdata = (watchlistId: number, titleId: number) => {
    setSeletectedTitle({ watchlistId, titleId });
    setPage("watchdata");
  }
  return (
    <>
      {page === "login" && <Login 
        onLogin={() => setPage("home")}
        goToSignup={() => setPage("signup")}
      />}
      {page === "signup" && <Signup 
        onSignup={() => setPage("home")} 
        goToLogin={() => setPage("login")}
      />}
      {page === "home" && <Home 
        goToWatchlist={() => setPage("watchlist")} 
        goToProfile={() => setPage("profile")} 
        goToPassword={() => setPage("password")} 
        goToAdmin={() => setPage("admin")}
        onLogout={() => setPage("login")}
      />}
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
      {page === "admin" && (<AdminDashboard goToHome={() => setPage("home")} />)}
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