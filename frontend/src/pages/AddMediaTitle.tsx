import { FaArrowLeft } from "react-icons/fa";

interface AddMediaTitleProps {
  goBack: () => void;
}

export default function AddMediaTitle({ goBack }: AddMediaTitleProps){
  return (
    <div className="admin-container">
      <div className="watchlist-header">
        <div className="back-btn">
          <button onClick={goBack}>
            <FaArrowLeft size={24} />
          </button>
        </div>
        <div className="watchlist-header-content">
          <div className="header">Add media title</div>
          <div className="subheader">Create a new movie or TV show.</div>
        </div>
      </div>
      <div className="edit-form-box">
        
      </div>
    </div>
  );
}