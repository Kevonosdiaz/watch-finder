import { FaArrowLeft } from "react-icons/fa";

interface WatchlistProps {
  goToHome: () => void;
}

export default function Watchlist({ goToHome }: WatchlistProps) {
  return (
    <div className="watchlist-container">
    <div className="top-bar">
      <div className="back-btn">
        <button onClick={goToHome}>
          <FaArrowLeft />
        </button>
      </div>
      <div className="header">Watchlists</div>
      <div className="subheader">Create and manage your watchlists.</div>
    </div>
    </div>    
  );
}