import { FaArrowLeft } from "react-icons/fa";

interface ManageMediaTitleProps {
  goToHome: () => void;
}

export default function ManageMediaTitles({goToHome}: ManageMediaTitleProps) {

    return (
        <div className="admin-container">
            <div className="watchlist-header">
                <div className="back-btn">
                    <button onClick={goToHome}>
                        <FaArrowLeft size={24}/>
                    </button>
                </div>
                <div className="watchlist-header-content">
                    <div className="header">Media titles</div>
                    <div className="subheader">Add, update or remove media titles.</div>
                </div>
            </div>
        </div>
    );
}
