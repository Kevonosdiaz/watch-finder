import { useState } from "react";
import { FaArrowLeft, FaRegStar, FaStar } from "react-icons/fa";

interface WatchdataProps {
    watchlistId: number;
    titleId: number;
    goBack: () => void;
}

export default function Watchdata({ watchlistId, titleId, goBack } : WatchdataProps) {
    const [rating, setRating] = useState<number>(0);
    let ratingData = [1,2,3,4,5]
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
                <div className="poster-wrapper"></div>
                <div className="form-box">
                    <div className="form-label">Completion Status</div>
                    <select
                        className="form-field-select"
                    >
                        <option value="">Select completion status</option>
                        <option value="not-started">Not started</option>
                        <option value="in-progress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <div className="form-label">Start date</div>
                    <input
                        type="date"
                        className="form-field-input"
                    />
                    <div className="form-label">End date</div>
                    <input
                        type="date"
                        className="form-field-input"
                    />
                    <div className="form-label">Personal rating</div>    
                    <div className="star-rating">
                       {ratingData.map((_, index) => {
                        const starIndex = index + 1
                        return (
                            <button key={starIndex} onClick={() => setRating(starIndex)}>
                                {starIndex <= rating ? <FaStar /> : <FaRegStar />}
                            </button>
                        )
                       })}
                    </div>
                </div>
            </div>
        </div>
    );
}