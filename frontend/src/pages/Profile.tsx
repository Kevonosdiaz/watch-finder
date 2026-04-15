import { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

interface ProfileProps {
  goToHome: () => void;
  email: string; // original logged-in email (used to identify the user)
}

export default function Profile({ goToHome, email }: ProfileProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState(email);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingField === "first") {
      firstRef.current?.focus();
      const v = firstRef.current?.value ?? "";
      firstRef.current?.setSelectionRange(v.length, v.length);
    } else if (editingField === "last") {
      lastRef.current?.focus();
      const v = lastRef.current?.value ?? "";
      lastRef.current?.setSelectionRange(v.length, v.length);
    }
  }, [editingField]);

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const api = (await import("../api/Client")).api;
        const data = await api<any>(`/api/users/${email}`);
        if (!mounted) return;
        setFirstName(data.firstname || "");
        setLastName(data.lastname || "");
        setUserEmail(data.email || email);
      } catch (err) {
        setErrorMsg("Failed to load profile");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [email]);

  const saveChanges = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    firstRef.current?.blur();
    lastRef.current?.blur();
    setEditingField(null);
    setLoading(true);
    try {
      const payload: any = {
        firstname: firstName,
        lastname: lastName,
      };
      const api = (await import("../api/Client")).api;
      // Use the original email (prop) as the path so backend can find the user
      const updated = await api<any>(`/api/users/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setFirstName(updated.firstname || firstName);
      setLastName(updated.lastname || lastName);
  setUserEmail(updated.email || userEmail);
      setSuccessMsg("Profile updated");
    } catch (err) {
      setErrorMsg("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="back-btn">
          <button onClick={goToHome} aria-label="Back to home">
            <FaArrowLeft size={24} />
          </button>
        </div>
        <div className="profile-header-content">
          <div className="header">View profile</div>
          <div className="subheader">Manage your basic profile information and how it appears in the app</div>
        </div>
      </div>

      <div className="profile-card">
        <div className="form-row">
          <div className="form-label">First name</div>
          <div className="form-field-row">
            {editingField === "first" ? (
              <input
                ref={firstRef}
                className="form-field-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            ) : (
              <div className="form-field-display">{firstName}</div>
            )}
            <button
              type="button"
              className="edit-field-btn"
              onClick={() => setEditingField(editingField === "first" ? null : "first")}
              aria-label="Edit first name"
            >
              <MdOutlineEdit />
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">Last name</div>
          <div className="form-field-row">
            {editingField === "last" ? (
              <input
                ref={lastRef}
                className="form-field-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            ) : (
              <div className="form-field-display">{lastName}</div>
            )}
            <button
              type="button"
              className="edit-field-btn"
              onClick={() => setEditingField(editingField === "last" ? null : "last")}
              aria-label="Edit last name"
            >
              <MdOutlineEdit />
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">Email</div>
          <div className="form-field-row">
            <div className="form-field-display">{userEmail}</div>
          </div>
        </div>

        {errorMsg && <div className="form-error">{errorMsg}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}

        <div className="profile-actions">
          <button className="save-btn primary" onClick={saveChanges} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
