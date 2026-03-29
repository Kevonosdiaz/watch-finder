import { useState, useMemo } from "react";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaList, FaUserCircle } from "react-icons/fa";
import { MdOutlineManageAccounts, MdOutlinePassword, MdLogout, MdChevronRight, MdFormatListBulletedAdd } from "react-icons/md";
import logo from "../assets/watch-finder-logo.png";

type ActiveMenu = "none" | "region" | "account";

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
  synopsis?: string;
  posterUrl: string;
  providers: StreamingPlatform[];
};

interface HomeProps {
    goToWatchlist: () => void;
}

export default function Home({ goToWatchlist }: HomeProps) {
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>("none");
    const toggleMenu = (menu: ActiveMenu) => {
        setActiveMenu((prev) => (prev === menu ? "none" : menu));
    };

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const toggleExpand = (id: number) =>
        setExpandedId((prev) => (prev === id ? null : id));

    const [region, setRegion] = useState("Canada");
    const regions = [
        "Canada",
        "United States",
        "United Kingdom",
        "Australia",
        "France",
        "Germany",
        "Spain",
        "Italy",
        "Japan",
        "South Korea",
        "India",
        "Brazil",
        "Mexico",
        "South Africa",
    ];

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const [search, setSearch] = useState("");

    const mockResults: SearchResult[] = useMemo(
        () => [
        {
            id: 1,
            title: "The Lord of the Rings: The Fellowship of the Ring",
            year: 2001,
            criticsScore: 91,
            rating: "PG-13",
            kind: "Movie",
            runtime: "2h 58m",
            synopsis:
            "A young hobbit named Frodo inherits a powerful ring and must leave the Shire to destroy it before evil forces reclaim it.",
            posterUrl: "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
            providers: [{ name: "Crave" }, { name: "Starz" }, { name: "Prime Video" }],
        },
        {
            id: 2,
            title: "The Lord of the Rings: The Two Towers",
            year: 2002,
            criticsScore: 95,
            rating: "PG-13",
            kind: "Movie",
            runtime: "2h 59m",
            synopsis:
            "The Fellowship is split, and the quest continues as war grows across Middle-earth.",
            posterUrl: "https://m.media-amazon.com/images/I/51gVJZQpY2L._AC_.jpg",
            providers: [{ name: "Crave" }, { name: "Starz" }, { name: "Prime Video" }],
        },
        {
            id: 3,
            title: "The Lord of the Rings: The Return of the King",
            year: 2003,
            criticsScore: 94,
            rating: "PG-13",
            kind: "Movie",
            runtime: "3h 21m",
            synopsis:
            "The final battle begins as Frodo and Sam reach Mount Doom and the fate of Middle-earth is decided.",
            posterUrl: "https://m.media-amazon.com/images/I/51QYJbS4LhL._AC_.jpg",
            providers: [{ name: "Crave" }, { name: "Starz" }, { name: "Prime Video" }],
        },
        ],
        []
    );

    const results = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return [];
        return mockResults.filter((r) => r.title.toLowerCase().includes(q));
    }, [search, mockResults]);

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
                {regions.map((r) => (
                    <button
                        key={r}
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                            setRegion(r);
                            setActiveMenu("none");
                        }}
                    >
                        {r}
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
                        <button type="button" className="account-item">
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
                        <button type="button" className="account-item">
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
                        <button type="button" className="account-item" onClick={() => setShowLogoutPopup(true)}>
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
        {results.length > 0 && (
            <div className="results-card">
            <div className="results-list">
            {results.map((item) => {
                const isOpen = expandedId === item.id;

                const metadata = joinDot([
                    String(item.year),
                    item.criticsScore != null ? `${item.criticsScore}% critics` : null,
                    item.rating ?? null,
                ]);

                const runtimeLine = joinDot([
                    item.kind,
                    item.runtime ? `(${item.runtime})` : null,
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
    )}
    {showLogoutPopup && (
        <div className="logout-popup" onClick={() => setShowLogoutPopup(false)}>
            <div className="logout-popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="logout-popup-title">Are you sure you want to log out?</div>
                <div className="logout-actions">
                    <button className="secondary-logout-btn" onClick={() => setShowLogoutPopup(false)}>
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