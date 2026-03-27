import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

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
    <div className="watchlist-card">
      <div className="watchlist-card-header">
        <h3>Journey through the Rings</h3>
        <button className="edit-btn">
          <MdOutlineEdit />
        </button>
      </div>
      <div className="watchlist-content">
        <div className="poster-wrapper">
          <button className="add-btn">
            <IoAddCircleOutline />
          </button>
        </div>
      </div>
    </div>
    <div className="create-wacthlist">
      <input
        type="text"
        placeholder="Enter the name of your watchlist"
      />
      <button className="create-btn">
        <IoAddCircleOutline />
      </button>
    </div>
    </div>    
  );
}