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
    criticsScore?: number;
    rating?: string;
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
                        criticsScore: m.critics_score,
                        rating: m.rating,
                        creator: m.creator,
                        synopsis: m.synopsis,
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
