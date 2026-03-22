import { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../assets/watch-finder-logo.png";

export default function Home() {
    const [region, setRegion] = useState("");
    const [open, setOpen] = useState(false);
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
                <FaMapMarkerAlt color="#E0160C"/>
                <span>Region: {region}</span>
                <button
                    type="button"
                    className={`chevron ${open ? "rotate" : ""}`}
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Open region menu"
                >
                    <FaChevronDown />
                </button>
            </div>
            {open && (
                <div className="dropdown">
                {regions.map((r) => (
                    <div
                    key={r}
                    className="dropdown-item"
                    onClick={() => {
                        setRegion(r);
                        setOpen(false);
                    }}
                    >
                    {r}
                    </div>
                ))}
                </div>
            )}
            </div>

            <div className="top-icons">
            <FaBars />
            <FaUserCircle />
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