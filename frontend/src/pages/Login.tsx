import { useState } from "react";
import { api } from "../api/client";
import logo from "../assets/watch-finder-logo.png";

type LoginProps = {
    onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, ] = useState(false);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const loginUser = await api<any>(`/api/users/${email}`);
            console.log("User: ", loginUser)
            onLogin();
        } catch (err) {
        console.error("Login failed: ", err);
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
                <button 
                    className="login-btn"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <div className="create-account-text">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </div>
        </div>
    );
}