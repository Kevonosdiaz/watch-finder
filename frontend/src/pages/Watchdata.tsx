import { useState, useEffect} from "react";
import { api } from "../api/Client";
import { FaArrowLeft, FaRegStar, FaStar } from "react-icons/fa";

interface WatchdataProps {
    watchlistId: number;
    titleId: number;
    goBack: () => void;
}

interface Watchdata {
    email: string;
    media_id: number,
    start_date?: Date;
    end_date?: Date;
    completion_status?: "P" | "W" | "C"
    personal_rating?: number;
}

export default function Watchdata({ watchlistId, titleId, goBack } : WatchdataProps) {
    const [watchdata, setWatchdata] = useState<Watchdata | null>(null);
    const [completionStatus, setCompletionStatus] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [rating, setRating] = useState<number>(0);
    let ratingData = [1,2,3,4,5]

    useEffect(() => {
        const fetchWatchdata = async () => {
            try {
                const data = await api<Watchdata>(
                    `/api/watchlist/${watchlistId}/media/${titleId}/watchdata`
                );
                    
                setWatchdata(data);
                setCompletionStatus(data?.completion_status ?? "");
                setStartDate(data?.start_date ? new Date(data.start_date) : null);
                setEndDate(data?.end_date ? new Date(data.end_date) : null);
                setRating(data?.personal_rating ?? 0);

            } catch (err) {
                console.error("Failed to fetch watchdata", err);
            }
        };
        fetchWatchdata();
    }, [watchlistId, titleId]);

    return (
        <div className="watchdata-container">
            <div className="watchdata-header">
                <div className="watchdata-top">
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
                <div className="title-poster"></div>
                <div className="form-box">
                    <div className="form-label">Completion Status</div>
                    <select
                        className="form-field-select"
                        value={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.value as "P" | "W" | "C")}
                    >
                        <option value="">Select completion status</option>
                        <option value="P">Not started</option>
                        <option value="W">In progress</option>
                        <option value="C">Completed</option>
                    </select>
                    <div className="form-label">Start date</div>
                    <input
                        type="date"
                        value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                        className="form-field-input"
                    />
                    <div className="form-label">End date</div>
                    <input
                        type="date"
                        value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
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