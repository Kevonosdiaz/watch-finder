import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaList, FaUserCircle } from "react-icons/fa";
import logo from "../assets/watch-finder-logo.png";

type ActiveMenu = "none" | "region" | "account";

export default function Home() {
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>("none");

    const toggleMenu = (menu: ActiveMenu) => {
        setActiveMenu((prev) => (prev === menu ? "none" : menu));
    };

    const [region, setRegion] = useState("Canada");
    const [search, setSearch] = useState("");

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
                            Profile
                            </button>
                            <button type="button" className="account-item">
                            Change password
                            </button>
                            <button type="button" className="account-item">
                            Log out
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
    </div>
  );
}