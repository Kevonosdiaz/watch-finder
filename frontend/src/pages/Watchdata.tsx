import { useState, useEffect} from "react";
import { api } from "../api/Client";
import { FaArrowLeft, FaRegStar, FaStar } from "react-icons/fa";

interface WatchdataProps {
    watchlistId: number;
    titleId: number;
    title: string;
    posterUrl?: string;
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

export default function Watchdata({ watchlistId, titleId, title, posterUrl, goBack } : WatchdataProps) {
    const [, setWatchdata] = useState<Watchdata | null>(null);
    const [completionStatus, setCompletionStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rating, setRating] = useState<number>(0);
    let ratingData = [1,2,3,4,5]
    
    useEffect(() => {
        const fetchWatchdata = async () => {
            try {
                const result = await api<Watchdata[]>(
                    `/api/watchlists/${watchlistId}/media/${titleId}/watchdata`
                );

                // Display watchdata
                const data = result?.[0] ?? null;

                if (!data) return;
                    
                setWatchdata(data);
                setCompletionStatus(data?.completion_status ?? "");
                setStartDate(data.start_date ?? "");
                setEndDate(data.end_date ?? "");
                setRating(data?.personal_rating ?? 0);
            } catch (err) {
                setErrorMessage("Failed to load watchdata");
            }
        };
        fetchWatchdata();
    }, [watchlistId, titleId]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const saveWatchdata = async () => {
        if (!watchlistId || !titleId) return;

        setErrorMessage(null);
        setSaveSuccess(false);

        try {
            await api(`/api/watchlists/${watchlistId}/media/${titleId}/watchdata`, {
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

            setSaveSuccess(true);

        } catch (err) {
            setErrorMessage("Unable to save changes");
        } finally {
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
                        <div className="subheader">
                            {title}
                        </div>
                    </div>
                </div>
                <div className="title-poster"> 
                    <img
                        src={posterUrl ?? "/placeholder.png"}
                        alt={title}
                    />
                </div>
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
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button
                        type="button"
                        onClick={saveWatchdata} 
                        className="save-watchdata-btn"
                    >
                        {saveSuccess ? "Saved" : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
