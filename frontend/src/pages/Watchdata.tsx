import { FaArrowLeft } from "react-icons/fa";

interface WatchdataProps {
    watchlistId: number;
    titleId: number;
    goBack: () => void;
}

export default function Watchdata({ watchlistId, titleId, goBack } : WatchdataProps) {
    return (
        <div className="watchdata-container">
            <div className="watchdata-header">
                <div className="back-btn">
                    <button onClick={goBack}>
                        <FaArrowLeft size={24}/>
                    </button>
                </div>
                <div className="watchdata-header-content">
                    <div className="header">Add your Watchdata</div>
                    <div className="subheader">Lord of the Rings: The Fellowship of the Ring</div>
                </div>
            </div>
        </div>
    );
}