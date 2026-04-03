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
    start_date?: string | null;
    end_date?: string | null;
    completion_status?: "P" | "W" | "C"
    personal_rating?: number;
}

export default function Watchdata({ watchlistId, titleId, goBack } : WatchdataProps) {
    const [watchdata, setWatchdata] = useState<Watchdata | null>(null);
    const [completionStatus, setCompletionStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rating, setRating] = useState<number>(0);
    let ratingData = [1,2,3,4,5]

    useEffect(() => {
        const fetchWatchdata = async () => {
            try {
                const result = await api<Watchdata[]>(
                    `/api/watchlist/${watchlistId}/media/${titleId}/watchdata`
                );

                // WDisplay watchdata
                const data = result?.[0] ?? null;

                if (!data) return;
                    
                setWatchdata(data);
                setCompletionStatus(data?.completion_status ?? "");
                setStartDate(data.start_date ?? "");
                setEndDate(data.end_date ?? "");
                setRating(data?.personal_rating ?? 0);
                console.log("WATCHDATA RAW:", data);
            } catch (err) {
                console.error("Failed to fetch watchdata", err);
            }
        };
        fetchWatchdata();
    }, [watchlistId, titleId]);

    const saveWatchdata = async () => {
        if (!watchlistId || !titleId) return;

        try {
            await api(`/api/watchlist/${watchlistId}/media/${titleId}/watchdata`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completion_status: completionStatus,
                    start_date: startDate || null,
                    end_date: endDate || null,
                    personal_rating: rating
                }),
            });
        } catch (err) {
        console.error("Failed to save watchdata", err);
        }
    };

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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-field-input"
                    />
                    <div className="form-label">End date</div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-field-input"
                    />
                    <div className="form-label">Personal rating</div>    
                    <div className="star-rating">
                       {ratingData.map((_, index) => {
                        const starIndex = index + 1
                        return (
                            <button key={starIndex} onClick={() => setRating(prev => (prev === starIndex ? 0 : starIndex))}>
                                {starIndex <= rating ? <FaStar /> : <FaRegStar />}
                            </button>
                        )
                       })}
                    </div>
                    <button
                        type="button"
                        onClick={saveWatchdata} 
                        className="save-watchdata-btn"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}