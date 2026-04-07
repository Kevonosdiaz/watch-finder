import { useState, useEffect } from "react";
import { api } from "../api/Client";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaList, FaUserCircle, FaTv } from "react-icons/fa";
import { MdOutlineManageAccounts, MdOutlinePassword, MdLogout, MdChevronRight, MdFormatListBulletedAdd, MdAdminPanelSettings } from "react-icons/md";
import { SiOpenmediavault } from "react-icons/si";
import logo from "../assets/watch-finder-logo.png";

type ActiveMenu = "none" | "region" | "account" | "admin";

type StreamingPlatform = {
    name: string;
    logoUrl?: string;
};

type SearchResult = {
    id: number;
    title: string;
    year: number;
    criticsScore?: number;
    rating?: string;
    kind: "Movie" | "TV";
    runtime?: string;
    creator?: string;
    synopsis?: string;
    posterUrl: string;
    providers: StreamingPlatform[];
};

type Region = {
    country_name: string;
}

interface HomeProps {
    goToWatchlist: () => void;
    goToProfile: () => void;
    goToPassword: () => void;
    onLogout: () => void;
    goToMediaTitles: () => void;
}

export default function Home({ goToWatchlist, goToProfile, goToPassword, onLogout, goToMediaTitles }: HomeProps) {
    const role = localStorage.getItem("role");
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>("none");
    const toggleMenu = (menu: ActiveMenu) => {
        setActiveMenu((prev) => (prev === menu ? "none" : menu));
    };

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const toggleExpand = (id: number) =>
        setExpandedId((prev) => (prev === id ? null : id));

    const [region, setRegion] = useState("Canada");
    const [regions, setRegions] = useState<Region[]>([]);
    
    useEffect(() => {
        async function fetchRegions() {
            try {
                const data = await api<Region[]>("/api/regions");
                console.log("regions:", data);
                setRegions(data)
            } catch {
                console.error("Failed to fetch regions");
            }
        }

        fetchRegions();
    }, []);

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [, setSearchError] = useState<string | null>(null);

    useEffect(() => {
        if (!search.trim()) {
            setResults([]);
            return;
        }

        async function fetchResults() {
            try {
            setIsSearching(true);
            // API call with search query
            const queryParam = search.trim() ? `?search=${encodeURIComponent(search)}` : "";
            const data = await api<SearchResult[]>(
                `/api/regions/${region}/media${queryParam}`
            );
            
            // Backend mapping to frontend state
            setResults(
                data.map((m: any) => ({
                    id: m.media_id ?? 0,
                    title: m.title_name ?? "Unknown",
                    year: m.release_year ?? 0,
                    kind: (m.kind ?? "Movie") as "Movie" | "TV",
                    posterUrl: m.posterUrl ?? "",
                    providers: m.providers ?? [],
                    criticsScore: m.rating ?? 0,
                    rating: m.age_rating ?? 0,
                    runtime: m.runtime,
                    creator: m.creator,
                    synopsis: m.description,
                }))
            );

            } catch {
            setSearchError("Search failed");
            } finally {
            setIsSearching(false);
            }  
        }

        fetchResults();
    }, [search, region]);

    const joinDot = (parts: Array<string | null | undefined>) =>
        parts.filter(Boolean).join(" • ");

    return (
        <div className="home-container">
        <div className="top-bar">
            <div className="region-wrapper">
                <div className="region-selector">
                    <FaMapMarkerAlt color="#E0160C" />
                     <span className="region-label">Region: {region}</span>
                    <button
                        type="button"
                            className={`chevron ${activeMenu === "region" ? "rotate" : ""}`}
                            onClick={() => toggleMenu("region")}
                            aria-label="Open region menu"
                            aria-expanded={activeMenu === "region"}
                        >
                            <FaChevronDown />
                    </button>
                </div>
            {activeMenu === "region" && (
                <div className="dropdown">
                {Array.isArray(regions) && regions.map((r) => (
                    <button
                        key={r.country_name}
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                            setRegion(r.country_name);
                            setActiveMenu("none");
                        }}
                    >
                        {r.country_name}
                    </button>
                ))}
                </div>
            )}
        </div>
        <div className="top-icons">
            <button type="button" className="list-btn" aria-label="Open list menu" onClick={goToWatchlist}>
                <FaList />
            </button>
            <div className="account-wrapper">
                <button
                    type="button"
                    className="account-btn"
                    onClick={() => toggleMenu("account")}
                    aria-label="Open account menu"
                    aria-expanded={activeMenu === "account"}
                >
                    <FaUserCircle />
                </button>
                {activeMenu === "account" && (
                    <div className="account-dropdown">
                        <button type="button" className="account-item" onClick={() => { setActiveMenu("none"); goToProfile(); }}>
                            <span className="account-left">
                                <span className="account-item-icon">
                                    <MdOutlineManageAccounts />
                                </span>
                                <span className="account-label">Profile</span>
                            </span>
                            <span className="account-item-chevron">
                                <MdChevronRight />
                            </span>
                        </button>
                        <button type="button" className="account-item" onClick={() => { setActiveMenu("none"); goToPassword(); }}>
                            <span className="account-left">
                                <span className="account-item-icon">
                                    <MdOutlinePassword />
                                </span>
                                <span className="account-label">Change password</span>
                            </span>
                            <span className="account-item-chevron">
                                <MdChevronRight />
                            </span>
                        </button>
                        <button 
                            type="button" 
                            className="account-item" 
                            onClick={() => {
                                setActiveMenu("none");
                                setShowLogoutPopup(true);
                            }}
                        >
                            <span className="account-left">
                                <span className="account-item-icon">
                                    <MdLogout />
                                </span>
                                <span className="account-label">Log out</span>
                            </span>
                            <span className="account-item-chevron">
                                <MdChevronRight />
                            </span>
                        </button>
                    </div>
                )}
            </div>
            {/*localStorage.getItem("role") === "admin" && (*/}
            <div className="admin-wrapper">
                <button
                    type="button"
                    className="admin-btn"
                    onClick={() => toggleMenu("admin")}
                    aria-label="Open admin menu"
                    aria-expanded={activeMenu === "admin"}
                >
                    <MdAdminPanelSettings size={25}/>
                </button>
                {activeMenu === "admin" && (
                    <div className="admin-dropdown">
                        <button type="button" className="admin-item" onClick={() => { setActiveMenu("none"); goToMediaTitles(); }}>
                            <span className="admin-left">
                                <span className="admin-item-icon">
                                    <SiOpenmediavault />
                                </span>
                                <span className="admin-label">Media titles</span>
                            </span>
                            <span className="admin-item-chevron">
                                <MdChevronRight />
                            </span>
                        </button>
                        <button type="button" className="admin-item" onClick={() => { setActiveMenu("none"); }}>
                            <span className="admin-left">
                                <span className="admin-item-icon">
                                    <FaTv />
                                </span>
                                <span className="admin-label">Streaming services</span>
                            </span>
                            <span className="admin-item-chevron">
                                <MdChevronRight />
                            </span>
                        </button> 
                    </div>
                )}
            </div>
            
        </div>
        </div>
        <div className="logo-container">
            <img src={logo} alt="WatchFinder Logo" />
        </div>
        <div className="search-container">
            <input
                type="text"
                placeholder="Search for a TV show, movie, anime, etc."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="search-icon">
                <FaSearch />
            </div>
        </div>
        {results.length > 0 ? (
            <div className="results-card">
            <div className="results-list scrollable">
            {results.map((item) => {
                const isOpen = expandedId === item.id;

                const metadata = joinDot([
                    String(item.year),
                    item.criticsScore != null ? `${item.criticsScore}/10★` : null,
                    item.rating ?? null,
                ]);

                const runtimeLine = joinDot([
                    item.kind,
                    item.runtime ? `(${item.runtime})` : null,
                    item.creator ? `Creator: ${item.creator}` : null,
                ]);

            return (
                <div key={item.id} className={`result-row ${isOpen ? "open" : ""}`}>
                    <div className="result-row-top">
                    <img className="result-poster" src={item.posterUrl} alt={item.title} />

                    <div className="result-main">
                        <div className="result-title">{item.title}</div>
                        <div className="result-metadata">{metadata}</div>
                        <div className="result-runtime">{runtimeLine}</div>
                        {isOpen && (
                            <div className="result-details">
                                <div className="synopsis-line">
                                    <span className="synopsis-label">Synopsis: </span>
                                    <span className="synopsis-text">
                                        {item.synopsis ?? "No synopsis available yet."}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="result-right">
                        <div className="streaming-platforms">
                        {item.providers.map((p) => (
                            <span key={p.name} className="streaming-platform-icon" title={p.name}>
                            {p.name[0]}
                            </span>
                        ))}
                        </div>
                        <button
                            type="button"
                            className="add-to-watchlist-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("Add:", item.id);
                            }}
                            aria-label="Add to watchlist"
                        >
                            <MdFormatListBulletedAdd />
                        </button>
                        <button
                            type="button"
                            className={`expand-btn ${isOpen ? "rotate" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(item.id);
                            }}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? "Collapse details" : "Expand details"}
                        >
                            <FaChevronDown />
                        </button>
                    </div>
                    </div>
                    
                </div>
                );
            })}
          </div>
        </div>
        ) : (
            search.trim() && !isSearching && (
                <div className="no-results">
                    <h2>No results found for "{search}" in {region}</h2>
                    <p>Try switching regions or searching for another title.</p>
                </div>
            )
        )
    }
    {showLogoutPopup && (
        <div className="logout-popup" onClick={() => setShowLogoutPopup(false)}>
            <div className="logout-popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="logout-popup-title">Are you sure you want to log out?</div>
                <div className="logout-actions">
                    <button 
                        className="secondary-logout-btn" 
                        onClick={() => {
                            setShowLogoutPopup(false);
                            onLogout = () => {
                                localStorage.removeItem("role");
                            }
                        }}
                    >
                        Log out
                    </button>
                    <button className="primary-logout-btn" onClick={() => setShowLogoutPopup(false)}>
                        Cancel
                    </button>
                </div>  
            </div>
        </div>
    )}
    </div>
  );
}
