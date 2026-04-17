import { useState } from "react";
import { api } from "../api/Client";
import logo from "../assets/watch-finder-logo.png";

type LoginProps = {
    onLogin: (email: string) => void;
    goToSignup: () => void;
};

export default function Login({ onLogin, goToSignup }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, ] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Allows the user to login with their credentials
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null)
        try {
            const loginUser = await api<any>("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            console.log("User: ", loginUser)
            // Set the user/admin role
            localStorage.setItem("role", loginUser.role);
            // Set the region of the user
            localStorage.setItem("region", loginUser.country_name)
            onLogin(email);
        } catch (err) {
            setError("Invalid email or password");
        }  
    }
    
    return (
        <div className="login-container">
            <div className="login-logo">
                <img src={logo} alt="WatchFinder Logo" />
            </div>
            <div className="login-header-content">
                <div className="header">Log in to your Account</div>
                <div className="form-box">
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
                {error && <p className="login-form-error">{error}</p>}
                <button 
                    className="login-btn"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <div className="create-account-text">
                    Don't have an account? 
                    <button
                        type="button"
                        className="link-btn"
                        onClick={goToSignup}
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
