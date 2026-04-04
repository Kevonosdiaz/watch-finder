import { useState, useEffect } from "react"
import { api } from "../api/client";
import { FaArrowLeft } from "react-icons/fa";

interface ManageMediaTitleProps {
  goToHome: () => void;
}

export default function ManageMediaTitles({goToHome}: ManageMediaTitleProps) {
    const [mediaTitles, setMediaTitles] = useState<any[]>([]);
    useEffect(() => {
        async function fetchMediaTitles() {
            try {
                // API call to fetch all media titles
                const data = await api<any[]>("/api/media");
                console.log("media:", data);
                setMediaTitles(data);
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
