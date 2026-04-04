import { useState, useEffect } from "react"
import { api } from "../api/client";
import { FaArrowLeft } from "react-icons/fa";

interface ManageMediaTitleProps {
    goToHome: () => void;
}
  
interface MediaTitle {
    id: number;
    title: string;
    year: number;
    kind: "Movie" | "TV";
    criticsScore?: number;
    rating?: string;
    runtime?: string;
    number_of_seasons?: number;
    creator?: string;
    synopsis?: string;
    posterUrl?: string;
    providers: StreamingPlatform[];
    regions: Region[];
}

type Region = {
    country_name: string;
}

type StreamingPlatform = {
    name: string;
    logoUrl?: string;
};

export default function ManageMediaTitles({goToHome}: ManageMediaTitleProps) {
    const [mediaTitles, setMediaTitles] = useState<MediaTitle[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<MediaTitle | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const metadata = selectedMedia ? [
        String(selectedMedia.year),
        selectedMedia.criticsScore != null ? `${selectedMedia.criticsScore}% critics` : null,
        selectedMedia.rating ?? null,
        ]
        .filter(Boolean)
        .join(" • ")
    : "";
    const runtimeLine = selectedMedia ? [
        selectedMedia.kind,
        selectedMedia.runtime ? `(${selectedMedia.runtime})` : null,
        selectedMedia.creator ? `Creator: ${selectedMedia.creator}` : null,
        ]
        .filter(Boolean)
        .join(" • ")
    : "";

    useEffect(() => {
        async function fetchMediaTitles() {
            try {
                // API call to fetch all media titles
                const data = await api<any[]>("/api/media");
                console.log("media:", data);
                
                setMediaTitles(
                    data.map(m => ({
                        id: m.media_id,
                        title: m.title_name,
                        year: m.release_year,
                        kind: (m.kind ?? "Movie") as "Movie" | "TV",
                        criticsScore: m.rating,
                        rating: m.age_rating,
                        creator: m.creator,
                        synopsis: m.description,
                        posterUrl: m.poster_url,
                        providers: m.providers ?? [],
                        regions: m.regions ?? [],
                    }))
                );

            } catch {
                console.error("Failed to fetch media");
            }
        }

        fetchMediaTitles();
    }, []);

    return (
        <div className="admin-container">
            {!showDetails ? (
                <>
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
                    <div className="poster-grid">
                        {mediaTitles.map((media) => (
                            <div key={media.id} className="poster-wrapper">
                            <button
                                type="button"
                                className="poster-btn"
                                onClick={() => {
                                    setSelectedMedia(media);
                                    setShowDetails(true);
                                }}
                            >
                                <div className="poster-overlay">
                                <div className="poster-overlay-title">{media.title}</div>
                                <div className="poster-overlay-sub">({media.year})</div>
                                </div> 
                            </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="watchlist-header">
                        <div className="back-btn">
                            <button onClick={goToHome}>
                                <FaArrowLeft size={24}/>
                            </button>
                        </div>
                        <div className="watchlist-header-content">
                            <div className="header">Details</div>
                        </div>
                    </div>
                    {selectedMedia && (
                        <div className="details-container">
                            <div className="poster">
                                <img src={selectedMedia.posterUrl || "/placeholder-poster.png"} />
                            </div>
                            <div className="result-main">
                                <div className="result-title">{selectedMedia.title}</div>
                                <div className="result-metadata">{metadata}</div>
                                <div className="result-runtime">{runtimeLine}</div>
                                <div className="result-details">
                                    <div className="synopsis-line">
                                        <span className="synopsis-label">Synopsis: </span>
                                        <span className="synopsis-text">
                                            {selectedMedia.synopsis ?? "No synopsis available yet."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    )}
                </>
            )}
        </div>
    );
}
