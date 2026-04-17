import { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface PasswordProps {
  goBack: () => void;
  email: string;
}

export default function Password({ goBack, email }: PasswordProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentRef = useRef<HTMLInputElement | null>(null);
  const newRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  // Handles password change request for the logged in user
  const changePassword = () => {
    (async () => {
      // Reset error and success messages
      setError(null);
      setSuccess(null);
      // Validate required fields
      if (!current || !next || !confirm) {
        setError("Please enter all fields");
        return;
      }
      // Check that the new passwords match
      if (next !== confirm) {
        setError("New passwords do not match");
        confirmRef.current?.focus();
        return;
      }
      setLoading(true);
      try {
        // Send password update to the backend
        const api = (await import("../api/Client")).api;
        await api(`/api/users/${email}/password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_password: current, new_password: next }),
        });
        currentRef.current?.blur();
        newRef.current?.blur();
        confirmRef.current?.blur();
        // Show success message and clear inputs
        setSuccess("Password changed successfully.");
        setCurrent("");
        setNext("");
        setConfirm("");
      } catch (err) {
        // Show error message if request fails
        setError("Failed to change password")
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="back-btn">
          <button onClick={goBack} aria-label="Back">
            <FaArrowLeft size={24} />
          </button>
        </div>
        <div className="profile-header-content">
          <div className="header">Change password</div>
          <div className="subheader">
            Your password must be at least 12 characters and should include a combination of numbers, letters, and special characters.
          </div>
        </div>
      </div>

      <div className="profile-card password-card">
        <div className="form-row">
          <div className="form-label">Current password</div>
          <div className="form-field-row">
            <input
              ref={currentRef}
              className="form-field-input"
              type="password"
              placeholder="Enter your current password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">New password</div>
          <div className="form-field-row">
            <input
              ref={newRef}
              className="form-field-input"
              type="password"
              placeholder="Enter your new password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">Confirm new password</div>
          <div className="form-field-row">
            <input
              ref={confirmRef}
              className="form-field-input"
              type="password"
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

  {error && <div className="form-error">{error}</div>}
  {success && <div className="form-success">{success}</div>}
        <div className="profile-actions">
          <button className="save-btn primary" onClick={changePassword} disabled={loading}>
            {loading ? "Changing..." : "Change password"}
          </button>
        </div>
      </div>
    </div>
  );
}
