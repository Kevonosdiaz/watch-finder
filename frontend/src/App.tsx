import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Watchdata from "./pages/Watchdata";
import Profile from "./pages/Profile";
import Password from "./pages/Password";
import ManageMediaTitles from "./pages/ManageMediaTitles";
import StreamingServices from "./pages/StreamingServices";
import AddMediaTitle from "./pages/AddMediaTitle";

// All possible pages within the app
type Page = "login" | "signup" | "home" | "watchlist" | "watchdata" | "password" | "profile" | "media-titles" | "add-media-title" | "streaming-services";

type SelectedWatchlistItem = {
  watchlistId: number;
  titleId: number;
  title: string;
  posterUrl?: string;
} | null;

function App() {
  // Stores logged in user email
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));
  // Tracks current page
  const [page, setPage] = useState<Page>(userEmail ? "home" : "login");
  // Stores selected watchlist item for the watchdata page
  const [selectedTitle, setSeletectedTitle] = useState<SelectedWatchlistItem>(null);
  // Keep user logged in after a page refresh
  useEffect(() => {
    if (userEmail) localStorage.setItem("userEmail", userEmail);
    else localStorage.removeItem("userEmail");
  }, [userEmail]);
  // Logs user out, resets state and goes back to login page
  const logout = () => {
    setUserEmail(null);
    setSeletectedTitle(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    setPage("login");
  }
  // Navigates to watchdata page with selected watchlist item
  const goToWatchdata = (watchlistId: number, titleId: number, title: string, posterUrl?: string) => {
    setSeletectedTitle({ watchlistId, titleId, title, posterUrl });
    setPage("watchdata");
  }
  return (
    <>
      {/* Login page */}
      {page === "login" && <Login
        onLogin={(email: string) => {
          setUserEmail(email);
          setPage("home");
        }}
        goToSignup={() => setPage("signup")}
      />}
      {/* Signup page */}
      {page === "signup" && <Signup 
        onSignup={(email:string) => {
          setUserEmail(email);
          setPage("home");
        }}
        goToLogin={() => setPage("login")}
      />}
      {/* Home page */}
      {page === "home" && userEmail && (
        <Home 
          email={userEmail}
          goToWatchlist={() => setPage("watchlist")} 
          goToProfile={() => setPage("profile")} 
          goToPassword={() => setPage("password")} 
          onLogout={logout}
          goToMediaTitles={() => setPage("media-titles")}
          goToStreamingServices={() => setPage("streaming-services")}
        />
      )}
      {/* Watchlist page */}
      {page === "watchlist" && userEmail && (
        <Watchlist
          email={userEmail}
          goToHome={() => setPage("home")}
          goToWatchdata={goToWatchdata}
        />
      )}
      {/* Profile page */}
      {page === "profile" && userEmail && (
        <Profile email={userEmail} goToHome={() => setPage("home")} />
      )}
      {/* Change password page */}
      {page === "password" && userEmail && (
        <Password email={userEmail} goBack={() => setPage("home")} />
      )}
      {/* Admin: All media page */}
      {page === "media-titles" && (<ManageMediaTitles 
        goToHome={() => setPage("home")}
        goToAddMediaTitles={() => setPage("add-media-title")} 
      />)}
      {/* Admin: Add media page */}
      {page === "add-media-title" && (<AddMediaTitle goBack={() => setPage("media-titles")}/>)}
      {page === "watchdata" && selectedTitle && (
        <Watchdata
          watchlistId={selectedTitle.watchlistId}
          titleId={selectedTitle.titleId}
          title={selectedTitle.title}
          posterUrl={selectedTitle.posterUrl}
          goBack={() => setPage("watchlist")}
        />
      )}
      {/* Admin: All streaming services page */}
      {page === "streaming-services" && (
        <StreamingServices goHome={() => setPage("home")} />
      )}
    </>
  );
}

export default App;
