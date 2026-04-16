import { useState, useEffect, useRef } from "react";
import { api, IMAGE_BASE_URL } from "../api/Client";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit, MdOutlineFileUpload, MdOutlineCancel } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface ManageMediaTitleProps {
    goToHome: () => void;
    goToAddMediaTitles: () => void;
}

type Region = { country_name: string };

type StreamingPlatform = { name: string; website_url?: string; logoUrl?: string };

type Availability = { country_name: string; providers: StreamingPlatform[] };

type MediaTitle = {
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
};

export default function ManageMediaTitles({ goToHome, goToAddMediaTitles }: ManageMediaTitleProps) {
    const [mediaTitles, setMediaTitles] = useState<MediaTitle[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<MediaTitle | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const metadata = selectedMedia
        ? [String(selectedMedia.year), selectedMedia.criticsScore != null ? `${selectedMedia.criticsScore}/10★` : null, selectedMedia.rating ?? null]
                .filter(Boolean)
                .join(" • ")
        : "";

    const runtimeLine = selectedMedia
        ? [
                selectedMedia.kind,
                selectedMedia.kind === "TV" && selectedMedia.number_of_seasons != null ? `${selectedMedia.number_of_seasons} seasons` : null,
                selectedMedia.kind === "Movie" && selectedMedia.runtime != null ? `(${selectedMedia.runtime}m)` : null,
            ]
                .filter(Boolean)
                .join(" • ")
        : "";

    useEffect(() => {
        async function fetchMediaTitles() {
            try {
                const data = await api<any[]>("/api/media");
                setMediaTitles(
                    data.map((m) => ({
                        id: m.media_id,
                        title: m.title_name,
                        year: m.release_year,
                        kind: (m.kind ?? "Movie") as "Movie" | "TV",
                        criticsScore: m.rating,
                        rating: m.age_rating,
                        creator: m.creator,
                        synopsis: m.description,
                        posterUrl:
                        m.image_file && m.image_file !== "null"
                            ? `${IMAGE_BASE_URL}/${m.image_file}`
                            : "/placeholder-poster.png",
                        number_of_seasons: m.number_of_seasons ?? undefined,
                        runtime: m.duration ?? undefined,
                        providers: m.providers ?? [],
                        regions: m.regions ?? [],
                        availability: (m.availability ?? []).map((a: any) => ({
                            country_name: a.country_name,
                            providers: (a.providers ?? []).map((p: any) => ({
                                name: p.streaming_service_name,
                                website_url: p.website_url,
                                logoUrl: p.logoUrl ?? null,
                            })),
                        })),
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch media", err);
            }
        }
        fetchMediaTitles();
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const [editedMedia, setEditedMedia] = useState<MediaTitle | null>(null);
    const [, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>("");
    const [, setRemovePoster] = useState(false);
    const [editedAvailability, setEditedAvailability] = useState<Availability[]>([]);
    const [newRegion, setNewRegion] = useState("");
    const [services, setServices] = useState<StreamingPlatform[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        api<any[]>("/api/streaming_services")
            .then((data) =>
                setServices(
                    data.map((s) => ({ name: s.streaming_service_name, website_url: s.website_url, logoUrl: s.logo_url ?? null }))
                )
            )
            .catch(() => console.error("Failed to load services"));
    }, []);

    const handleDelete = async () => {
        if (!selectedMedia) return;
        try {
            await api(`/api/media/${selectedMedia.id}`, { method: "DELETE" });
            setMediaTitles((prev) => prev.filter((media) => media.id !== selectedMedia.id));
            setSelectedMedia(null);
            setShowDetails(false);
        } catch (err) {
            console.error("Failed to delete media title", err);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedMedia(null);
        setPosterFile(null);
        setPosterPreview("");
        setRemovePoster(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSaveEdit = async () => {
        if (!editedMedia) return;
        try {
            const serverResp: any = await api(`/api/media/${editedMedia.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title_name: editedMedia.title,
                    release_year: editedMedia.year,
                    creator: editedMedia.creator,
                    age_rating: editedMedia.rating,
                    rating: editedMedia.criticsScore,
                    description: editedMedia.synopsis,
                    kind: editedMedia.kind,
                    duration: editedMedia.kind === "Movie" ? (editedMedia.runtime ? Number(editedMedia.runtime) : null) : null,
                    number_of_seasons: editedMedia.kind === "TV" ? editedMedia.number_of_seasons : null,
                    availability: editedAvailability.map((region) => ({ country_name: region.country_name, streaming_services: region.providers.map((p) => p.name) })),
                }),
            });

            const serverAvailability = (serverResp?.availability ?? []).map((a: any) => ({
                country_name: a.country_name,
                providers: (a.providers ?? []).map((p: any) => ({ name: p.streaming_service_name, website_url: p.website_url, logoUrl: p.logo_url ?? null })),
            }));

            const finalAvailability = serverAvailability.length > 0 ? serverAvailability : (editedAvailability.length > 0 ? editedAvailability : (editedMedia.availability ?? []));

            const savedMedia: MediaTitle = { ...editedMedia, availability: finalAvailability };

            setSelectedMedia(savedMedia);
            setMediaTitles((prev) => prev.map((m) => (m.id === editedMedia.id ? savedMedia : m)));

            setIsEditing(false);
            setEditedMedia(null);
            setPosterFile(null);
            setPosterPreview("");
            setRemovePoster(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Failed to update media", err);
        }
    };

    return (
        <div className="admin-container">
            {!showDetails ? (
                <>
                    <div className="watchlist-header">
                        <div className="back-btn">
                            <button onClick={goToHome}>
                                <FaArrowLeft size={24} />
                            </button>
                        </div>
                        <div className="watchlist-header-content">
                            <div className="header">Media titles</div>
                            <div className="subheader">Add, update or remove media titles.</div>
                        </div>
                    </div>
                    <div className="add-media">
                        <button onClick={goToAddMediaTitles}>
                            <IoAddCircleOutline size={18} /> Add new media title
                        </button>
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
                                    <img src={media.posterUrl} alt={media.title} />
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
                        {!isEditing && (
                            <div className="back-btn">
                                <button
                                    onClick={() => {
                                        setSelectedMedia(null);
                                        setShowDetails(false);
                                    }}
                                >
                                    <FaArrowLeft size={24} />
                                </button>
                            </div>
                        )}
                        <div className="watchlist-header-content">
                            <div className="header">Media details</div>
                        </div>
                        <div className="details-actions">
                            {isEditing ? (
                                <>
                                    <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
                                        <MdOutlineCancel size={24} />
                                    </button>
                                    <button type="button" className="save-btn" onClick={handleSaveEdit}>
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="edit-btn"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditedMedia(selectedMedia);
                                            setEditedAvailability((selectedMedia?.availability ?? []).map((region) => ({ country_name: region.country_name, providers: [...(region.providers ?? [])] })));
                                            setPosterFile(null);
                                            setRemovePoster(false);
                                            setPosterPreview(selectedMedia?.posterUrl ?? "");
                                        }}
                                    >
                                        <MdOutlineEdit size={18} />
                                    </button>
                                    <button type="button" className="delete-btn" onClick={handleDelete}>
                                        <FaTrashAlt />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {selectedMedia && (
                        <div className="details-container">
                            <div className="poster-stack">
                                <div className="poster-wrapper">
                                    <img src={isEditing ? posterPreview || editedMedia?.posterUrl || "/placeholder-poster.png" : selectedMedia.posterUrl || "/placeholder-poster.png"} className="poster-img" />
                                </div>
                                {isEditing && (
                                    <div className="poster-actions">
                                        <button type="button" className="poster-upload-btn" onClick={() => fileInputRef.current?.click()}>
                                            <MdOutlineFileUpload size={18} />
                                        </button>
                                        <button type="button" className="poster-remove-btn">
                                            <FaTrashAlt />
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file || !selectedMedia) return;
                                                setRemovePoster(false);
                                                setPosterFile(file);
                                                setPosterPreview(URL.createObjectURL(file));
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                await api(`/api/media/${selectedMedia.id}/img`, { method: "PATCH", body: formData });
                                                const refreshedUrl = `${IMAGE_BASE_URL}/media_${selectedMedia.id}.jpg?v=${Date.now()}`;
                                                setSelectedMedia((prev) => (prev ? { ...prev, posterUrl: refreshedUrl } : prev));
                                                setEditedMedia((prev) => (prev ? { ...prev, posterUrl: refreshedUrl } : prev));
                                                setMediaTitles((prev) =>
                                                    prev.map((m) => (m.id === selectedMedia.id ? { ...m, posterUrl: refreshedUrl } : m))
                                                );
                                                setPosterPreview(refreshedUrl);
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
                                                <input className="edit-form-field-input" value={editedMedia.title || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, title: e.target.value } : prev))} placeholder="Enter the title of movie/show" />
                                            </div>

                                            <div className="edit-form-field">
                                                <div className="form-label">Year</div>
                                                <input className="edit-form-field-input" type="number" value={editedMedia.year || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, year: Number(e.target.value) } : prev))} placeholder="Enter the release year" />
                                            </div>

                                            <div className="edit-form-field">
                                                <div className="form-label">Critics score</div>
                                                <input className="edit-form-field-input" value={editedMedia.criticsScore || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, criticsScore: Number(e.target.value) } : prev))} placeholder="Enter the critics score" />
                                            </div>

                                            <div className="edit-form-field">
                                                <div className="form-label">Age rating</div>
                                                <input className="edit-form-field-input" value={editedMedia.rating || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, rating: e.target.value } : prev))} placeholder="Enter the age rating" />
                                            </div>

                                            <div className="edit-form-field">
                                                <div className="form-label">Movie or show?</div>
                                                <select value={editedMedia.kind} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, kind: e.target.value as "Movie" | "TV" } : prev))} className="edit-form-field-select">
                                                    <option value="Movie">Movie</option>
                                                    <option value="TV">TV Show</option>
                                                </select>
                                            </div>

                                            {editedMedia.kind === "Movie" ? (
                                                <div className="edit-form-field">
                                                    <div className="form-label">Movie runtime</div>
                                                    <input className="edit-form-field-input" type="number" value={editedMedia.runtime || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, runtime: e.target.value } : prev))} placeholder="Enter the movie's runtime (minutes)" />
                                                </div>
                                            ) : (
                                                <div className="edit-form-field">
                                                    <div className="form-label">Number of seasons</div>
                                                    <input className="edit-form-field-input" type="number" value={editedMedia.number_of_seasons || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, number_of_seasons: Number(e.target.value) } : prev))} placeholder="Enter the show's number of seasons" />
                                                </div>
                                            )}

                                            <div className="edit-form-field">
                                                <div className="form-label">Creator</div>
                                                <input className="edit-form-field-input" value={editedMedia.creator || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, creator: e.target.value } : prev))} placeholder="Creator" />
                                            </div>

                                            <div className="edit-form-field">
                                                <div className="form-label">Synopsis</div>
                                                <textarea className="edit-form-field-textfield" value={editedMedia.synopsis || ""} onChange={(e) => setEditedMedia((prev) => (prev ? { ...prev, synopsis: e.target.value } : prev))} placeholder="Synopsis" />
                                            </div>

                                            <h3 className="availability-header">Where to Watch</h3>

                                            <div className="availability-add">
                                                <input className="edit-form-field-input" placeholder="Enter region (e.g. Canada)" value={newRegion} onChange={(e) => setNewRegion(e.target.value)} />
                                                <button type="button" className="add-region-btn" onClick={() => {
                                                    const name = newRegion.trim();
                                                    if (!name) return;
                                                    setEditedAvailability((prev) => {
                                                        const next = [...prev, { country_name: name, providers: [] }];
                                                        setEditedMedia((em) => (em ? { ...em, availability: next } : em));
                                                        return next;
                                                    });
                                                    setNewRegion("");
                                                }}>
                                                    <IoAddCircleOutline size={24} />
                                                </button>
                                            </div>

                                            {editedAvailability.map((region, regionIndex) => (
                                                <div key={`${region.country_name}-${regionIndex}`} className="edit-availability-region">
                                                    <div className="availability-region-header">
                                                        <span>{region.country_name}</span>
                                                        <button type="button" className="remove-region-btn" onClick={() => setEditedAvailability((prev) => {
                                                            const next = prev.filter((_, i) => i !== regionIndex);
                                                            setEditedMedia((em) => (em ? { ...em, availability: next } : em));
                                                            return next;
                                                        })}>
                                                            <MdOutlineCancel />
                                                        </button>
                                                    </div>

                                                    <div className="availability-services">
                                                        {services.map((s) => {
                                                            const checked = region.providers.some((p) => p.name === s.name);
                                                            return (
                                                                <label key={s.name} className="service-checkbox">
                                                                    <input type="checkbox" checked={checked} onChange={(e) => setEditedAvailability((prev) => {
                                                                        const next = prev.map((r, i) => i !== regionIndex ? r : { ...r, providers: e.target.checked ? [...r.providers, s] : r.providers.filter((p) => p.name !== s.name) });
                                                                        setEditedMedia((em) => (em ? { ...em, availability: next } : em));
                                                                        return next;
                                                                    })} />
                                                                    {s.name}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="details-title">{selectedMedia?.title}</div>
                                        <div className="details-metadata">{metadata}</div>
                                        <div className="details-runtime">{runtimeLine}</div>
                                        <div className="details-details">
                                            <div className="details-synopsis-line">
                                                <span className="details-synopsis-label">Synopsis:</span>
                                                <span className="details-synopsis-text">{selectedMedia?.synopsis ?? "No synopsis available yet."}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!isEditing && (
                                    <>
                                        <h3 className="availability-header">Where to Watch</h3>
                                        <div className="availability-list">
                                            {(selectedMedia?.availability ?? []).map((region) => (
                                                <div key={region.country_name} className="availability-row">
                                                    <div className="availability-region">{region.country_name}</div>
                                                    <div className="media-details-streaming-platforms">
                                                        {region.providers.length > 0 ? region.providers.map((p) => (
                                                            <span key={p.name} className="streaming-platform-icon" title={p.name}>{p.logoUrl ? <img src={p.logoUrl} alt={p.name} /> : p.name}</span>
                                                        )) : <span className="no-providers">No streaming providers listed.</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
    