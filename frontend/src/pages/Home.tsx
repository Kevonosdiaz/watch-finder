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

export default function Home() {
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>("none");
    const toggleMenu = (menu: ActiveMenu) => {
        setActiveMenu((prev) => (prev === menu ? "none" : menu));
    };

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

    const [search, setSearch] = useState("");
    const mockResults: SearchResult[] = useMemo(() => [
        {
        id: 1,
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
        criticsScore: 91,
        rating: "PG-13",
        kind: "Movie",
        runtime: "2h 58m",
        posterUrl:
            "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
        providers: [
            { name: "Crave" },
            { name: "Starz" },
            { name: "Prime Video" },
        ],
        },
        {
        id: 2,
        title: "The Lord of the Rings: The Two Towers",
        year: 2002,
        criticsScore: 95,
        rating: "PG-13",
        kind: "Movie",
        runtime: "2h 59m",
        posterUrl:
            "https://m.media-amazon.com/images/I/51gVJZQpY2L._AC_.jpg",
        providers: [
            { name: "Crave" },
            { name: "Starz" },
            { name: "Prime Video" },
        ],
        },
        {
        id: 3,
        title: "The Lord of the Rings: The Return of the King",
        year: 2003,
        criticsScore: 94,
        rating: "PG-13",
        kind: "Movie",
        runtime: "3h 21m",
        posterUrl:
            "https://m.media-amazon.com/images/I/51QYJbS4LhL._AC_.jpg",
        providers: [
            { name: "Crave" },
            { name: "Starz" },
            { name: "Prime Video" },
        ],
        },
    ],
    []
    );

    const results = useMemo(() => {
        if (!search.trim()) return [];
        return mockResults.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, mockResults]);

    const joinDot = (parts: Array<string | null | undefined>) =>
        parts.filter(Boolean).join(" • ");

    return (
        <div className="home-container">
            <div className="top-bar">
                <div className="region-wrapper">
                    <div className="region-selector">
                        <FaMapMarkerAlt color="#E0160C" />
                        <span>Region: {region}</span>
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
                    <button type="button" className="list-btn" aria-label="Open list menu">
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
                            <button type="button" className="account-item">
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
                const metadata = joinDot([
                    String(item.year),
                    item.criticsScore != null ? `${item.criticsScore}% critics` : null,
                    item.rating ?? null,
                ]);

                const runtime = joinDot([
                    item.kind,
                    item.runtime && `(${item.runtime})`,
                ]);

                return (
                    <button key={item.id} className="result-row">
                    <img
                        className="result-poster"
                        src={item.posterUrl}
                        alt={item.title}
                    />
                    <div className="result-main">
                        <div className="result-title">{item.title}</div>
                        <div className="result-metadata">{metadata}</div>
                        <div className="result-runtime">{runtime}</div>
                        <div className="result-synopsis">{item.synopsis}</div>
                    </div>
                    <div className="result-right">
                        <div className="streaming-platforms">
                        {item.providers.map((p) => (
                            <span key={p.name} className="streaming-platform-icon">
                            {p.name[0]}
                            </span>
                        ))}
                        </div>
                        <button className="add-to-watchlist-btn">
                            <MdFormatListBulletedAdd />
                        </button>
                        <button className="expand-btn">
                            <FaChevronDown />
                        </button>
                    </div>
                    </button>
                );
                })}
            </div>
            </div>
        )}
    </div>
  );
}