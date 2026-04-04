import { useState } from "react";
import { api } from "../api/client";
import logo from "../assets/watch-finder-logo.png";

type SignupProps = {
    onSignup: () => void;
    goToLogin: () => void;
};

export default function Signup({ onSignup, goToLogin }: SignupProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, ] = useState(false);

     return (
        <div className="login-container">
            <div className="login-logo">
                <img src={logo} alt="WatchFinder Logo" />
            </div>
            <div className="login-header-content">
                <div className="header">Create an Account</div>
                <div className="form-box">
                    <div className="form-field">
                        <label className="login-form-label">First name</label>
                        <input
                            type="text"
                            className="form-text-input"
                            placeholder="Enter your email address"
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
                            placeholder="Enter your email address"
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
                <button 
                    className="signup-btn"
                    onClick={onSignup}
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
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}