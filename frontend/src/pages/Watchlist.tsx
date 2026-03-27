import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface WatchlistProps {
  goToHome: () => void;
}

export default function Watchlist({ goToHome }: WatchlistProps) {
  return (
    <div className="watchlist-container">
    <div className="watchlist-header">
      <div className="back-btn">
        <button onClick={goToHome}>
          <FaArrowLeft size={24}/>
        </button>
      </div>
      <div className="watchlist-header-content">
        <div className="header">Watchlists</div>
        <div className="subheader">Create and manage your watchlists.</div>
      </div>
    </div>
    <div className="watchlist-card-title-section">
      <h2>Create a Watchlist</h2>
    </div>
    <div className="create-watchlist">
      <input
        type="text"
        placeholder="Enter the name of your watchlist"
      />
      <button className="create-btn">
        <IoAddCircleOutline />
      </button>
    </div>
    <div className="watchlist-card-title-section">
      <h2>Your Watchlists</h2>
    </div>
    <div className="watchlist-card">
      <div className="watchlist-card-header">
        <h3>Journey through the Rings</h3>
        <button className="edit-btn">
          <MdOutlineEdit size={18}/>
        </button>
      </div>
      <div className="watchlist-content">
        <div className="poster-wrapper">
        </div>
      </div>
    </div>
    </div>    
  );
}