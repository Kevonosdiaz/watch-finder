import { useState, useEffect } from "react";
import { api } from "../api/Client";
import logo from "../assets/watch-finder-logo.png";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

type SignupProps = {
    onSignup: (email: string) => void;
    goToLogin: () => void;
};

type Region = {
    country_name: string;
}

type ActiveMenu = "none" | "region";


export default function Signup({ onSignup, goToLogin }: SignupProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, ] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>("none");
    const toggleMenu = (menu: ActiveMenu) => {
        setActiveMenu((prev) => (prev === menu ? "none" : menu));
    };

    // Reusing code from Home.tsx -- could extract duplicated code out later
    // Save and restore the selected region across page changes
    const [region, setRegion] = useState(() =>
        localStorage.getItem("region") || "Canada");

    useEffect(() => {
        localStorage.setItem("region", region);
    }, [region]);

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


    // Normal users are created through this process,
    // but manual action is required to make it an admin account
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null)

        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const loginUser = await api<any>("/api/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    country_name: region,
                    email,
                    password,
                }),
            });
            console.log("User: ", loginUser)
            // Set the user/admin role
            localStorage.setItem("role", loginUser.role);

            // Login immediately with a created account
            onSignup(email);
        } catch (err) {
            // May be an existing email/account
            setError("User account already exists");
        }
    }

     return (
        <div className="signup-container">
            <div className="signup-logo">
                <img src={logo} alt="WatchFinder Logo" />
            </div>
            <div className="signup-header-content">
                <div className="header">Create an Account</div>
                <div className="form-box">
                    <div className="form-field">
                        <label className="signup-form-label">First name</label>
                        <input
                            type="text"
                            className="form-text-input"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="login-form-label">Last name</label>
                        <input
                            type="text"
                            className="form-text-input"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="login-form-label">Email address</label>
                        <input
                            type="text"
                            className="form-text-input"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="login-form-label login">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-text-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

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
                {error && <p className="login-form-error">{error}</p>}
                <button 
                    className="signup-btn"
                    onClick={handleSignup}
                >
                    Sign up
                </button>
                <div className="login-text">
                    Already have an account? 
                    <button
                        type="button"
                        className="link-btn"
                        onClick={goToLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
