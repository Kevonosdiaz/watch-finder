import { useState, useEffect } from "react"
import { api } from "../api/client";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit, MdOutlineFileUpload } from "react-icons/md";
import { useRef } from "react";

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
    availability?: Availability[];
}

type Region = {
    country_name: string;
}

type StreamingPlatform = {
    name: string;
    website_url?: string;
    logoUrl?: string;
};


type Availability = {
  country_name: string;
  providers: StreamingPlatform[];
};

export default function ManageMediaTitles({goToHome}: ManageMediaTitleProps) {
   /* useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            goToHome();
        }
    }, []);*/
    const [mediaTitles, setMediaTitles] = useState<MediaTitle[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<MediaTitle | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const metadata = selectedMedia ? [
        String(selectedMedia.year),
        selectedMedia.criticsScore != null ? `${selectedMedia.criticsScore}/10★` : null,
        selectedMedia.rating ?? null,
        ]
        .filter(Boolean)
        .join(" • ")
    : "";
    const runtimeLine = selectedMedia ? [
        selectedMedia.kind,
        selectedMedia.kind === "TV" && selectedMedia.number_of_seasons != null ? `${selectedMedia.number_of_seasons} seasons` : null,
        selectedMedia.kind === "Movie" && selectedMedia.runtime != null ? `(${selectedMedia.runtime}m)` : null,
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
                        number_of_seasons: m.number_of_seasons ?? undefined,
                        runtime: m.duration ?? undefined,
                        providers: m.providers ?? [],
                        regions: m.regions ?? [],
                        availability: m.availability ?? [],
                    }))
                );

            } catch {
                console.error("Failed to fetch media");
            }
        }

        fetchMediaTitles();
    }, []);

    // Editing constants
    const [isEditing, setIsEditing] = useState(false);
    const [editedMedia, setEditedMedia] = useState<MediaTitle | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>("");
    const [removePoster, setRemovePoster] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleDelete = async () => { 
        if (!selectedMedia) return;

        try {
            await api(`/api/media/${selectedMedia.id}`,
                { method: "DELETE" }
            );

            setMediaTitles(prev => prev.filter(media => media.id !== selectedMedia.id));
            setSelectedMedia(null);
            setShowDetails(false);
        } catch (err) {
            console.error("Failed to delete media title", err);
        }
    }

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
                        <div className="details-actions">
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={() => {
                                    setIsEditing(true);
                                    setEditedMedia(selectedMedia);
                                    setPosterFile(null);
                                    setRemovePoster(false);
                                    setPosterPreview(selectedMedia?.posterUrl ?? "");
                                }}
                            >
                                <MdOutlineEdit size={18}/>
                            </button>
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    </div>
                    {selectedMedia && (
                        <div className="details-container">
                            <div className="poster-stack">
                                <div className="poster-wrapper">
                                <img
                                    src={
                                    isEditing
                                        ? posterPreview ||
                                        editedMedia?.posterUrl ||
                                        "/placeholder-poster.png"
                                        : selectedMedia.posterUrl || "/placeholder-poster.png"
                                    }
                                    className="poster-img"
                                />
                                </div>
                                {isEditing && (
                                    <div className="poster-actions">
                                        <button
                                            type="button"
                                            className="poster-upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <MdOutlineFileUpload size={18}/>
                                        </button>
                                        <button
                                            type="button"
                                            className="poster-remove-btn"
                                           // onClick={() => fileInputRef.current?.click()}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                        
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setRemovePoster(false);
                                            setPosterFile(file);
                                            setPosterPreview(URL.createObjectURL(file));
                                        }}
                                    />
                                    </div>
                                )}
                            </div>  
                            <div className="details-main">
                            {isEditing && editedMedia ? (
                                <>
                                <div className="edit-form-box">
                                    <div className="edit-form-field">
                                        <div className="form-label">Title</div>
                                        <input
                                            className="edit-form-field-input"
                                            value={editedMedia.title || ""}
                                            onChange={(e) =>
                                            setEditedMedia(prev => prev && { ...prev, title: e.target.value })
                                            }
                                            placeholder="Enter the title of movie/show"
                                        />
                                    </div>
                                    <div className="edit-form-field">
                                        <div className="form-label">Year</div>
                                        <input
                                            className="edit-form-field-input"
                                            type="number"
                                            value={editedMedia.year || ""}
                                            onChange={(e) =>
                                            setEditedMedia(prev => prev && { ...prev, year: Number(e.target.value) })
                                            }
                                            placeholder="Enter the release year"
                                        />
                                    </div>
                                    <div className="edit-form-field">
                                        <div className="form-label">Critics score</div>
                                        <input
                                            className="edit-form-field-input"
                                            value={editedMedia.criticsScore || ""}
                                            onChange={(e) =>
                                            setEditedMedia(prev => prev && { ...prev, criticsScore: Number(e.target.value) })
                                            }
                                            placeholder="Enter the critics score"
                                        />
                                    </div>
                                    <div className="edit-form-field">
                                        <div className="form-label">Age rating</div>
                                        <input
                                            className="edit-form-field-input"
                                            value={editedMedia.rating || ""}
                                            onChange={(e) =>
                                            setEditedMedia(prev => prev && { ...prev, rating: e.target.value })
                                            }
                                            placeholder="Enter the age rating"
                                        />
                                    </div>
                                    <div className="edit-form-field">
                                        <div className="form-label">Movie or show?</div>
                                        <select
                                            value={editedMedia.kind || "Movie"}
                                            onChange={(e) =>
                                                setEditedMedia(prev => prev && { ...prev, kind: e.target.value as "Movie" | "TV" })
                                            }
                                            className="edit-form-field-select"
                                        >
                                            <option value="Movie">Movie</option>
                                            <option value="TV">TV Show</option>
                                        </select>
                                    </div>
                                    {editedMedia.kind === "Movie" ? (
                                        <div className="edit-form-field">
                                            <div className="form-label">Movie runtime</div>
                                            <input
                                                className="edit-form-field-input"
                                                type="number"
                                                value={editedMedia.runtime || ""}
                                                onChange={(e) =>
                                                    setEditedMedia(prev => prev && { ...prev, runtime: e.target.value })
                                                }
                                                placeholder="Enter the movie's runtime (minutes)"
                                            />
                                        </div>
                                    ) : (
                                        <div className="edit-form-field">
                                            <div className="form-label">Number of seasons</div>
                                            <input
                                                className="edit-form-field-input"
                                                type="number"
                                                value={editedMedia.number_of_seasons || ""}
                                                onChange={(e) =>
                                                    setEditedMedia(prev => prev && { ...prev, number_of_seasons: Number(e.target.value) })
                                                }
                                                placeholder="Enter the show's number of seasons"
                                            />
                                        </div>
                                    )}
                                <div className="edit-form-field">
                                    <div className="form-label">Creator</div>      
                                    <input
                                        className="edit-form-field-input"
                                        value={editedMedia.creator || ""}
                                        onChange={(e) =>
                                            setEditedMedia(prev => prev && { ...prev, creator: e.target.value })
                                        }
                                        placeholder="Creator"
                                    />
                                </div>
                                <div className="edit-form-field">
                                    <div className="form-label">Synopsis</div>
                                    <textarea
                                        className="edit-form-field-textfield"
                                        value={editedMedia.synopsis || ""}
                                        onChange={(e) =>
                                        setEditedMedia(prev => prev && { ...prev, synopsis: e.target.value })
                                        }
                                        placeholder="Synopsis"
                                    />
                                </div>
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="details-title">{selectedMedia.title}</div>
                                <div className="details-metadata">{metadata}</div>
                                <div className="details-runtime">{runtimeLine}</div>
                                <div className="details-details">
                                    <div className="details-synopsis-line">
                                    <span className="details-synopsis-label">Synopsis:</span>
                                    <span className="details-synopsis-text">
                                        {selectedMedia.synopsis ?? "No synopsis available yet."}
                                    </span>
                                    </div>
                                </div>
                                </>
                            )}
                            <h3 className="availability-header">Where to Watch</h3>
                            <div className="availability-list">
                                {(selectedMedia.availability ?? []).map(region => (
                                <div key={region.country_name} className="availability-row">
                                    <div className="availability-region">{region.country_name}</div>
                                    <div className="media-details-streaming-platforms">
                                    {region.providers.length > 0 ? (
                                        region.providers.map(p => (
                                        <span key={p.name} className="streaming-platform-icon" title={p.name}>
                                            {p.logoUrl ? <img src={p.logoUrl} alt={p.name} /> : p.name[0]}
                                        </span>
                                        ))
                                    ) : (
                                        <span className="no-providers">No streaming providers listed.</span>
                                    )}
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                </>
            )}
        </div>
    );
}
