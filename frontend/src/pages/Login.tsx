import { useState } from "react";
import logo from "../assets/watch-finder-logo.png";

type LoginProps = {
    onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="login-container">
            <div className="logo-container">
                <img src={logo} alt="WatchFinder Logo" />
            </div>
            <div className="login-header-content">
                <div className="header">Log in to your Account</div>
                <div className="form-box">
                    <div className="form-field">
                        <label className="form-label">Email address</label>
                        <input
                            type="text"
                            className="form-field"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Password</label>
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
                <button className="login-btn">Login</button>
            </div>
        </div>
    );
}