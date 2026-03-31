import { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

interface ProfileProps {
  goToHome: () => void;
}

export default function Profile({ goToHome }: ProfileProps) {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@ucalgary.ca");

  const [editingField, setEditingField] = useState<string | null>(null);

  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingField === "first") {
      firstRef.current?.focus();
      const v = firstRef.current?.value ?? "";
      firstRef.current?.setSelectionRange(v.length, v.length);
    } else if (editingField === "last") {
      lastRef.current?.focus();
      const v = lastRef.current?.value ?? "";
      lastRef.current?.setSelectionRange(v.length, v.length);
    } else if (editingField === "email") {
      emailRef.current?.focus();
      const v = emailRef.current?.value ?? "";
      emailRef.current?.setSelectionRange(v.length, v.length);
    }
  }, [editingField]);

  const saveChanges = () => {
    firstRef.current?.blur();
    lastRef.current?.blur();
    emailRef.current?.blur();
    setEditingField(null);
    // Connect with backend API here
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
            {editingField === "email" ? (
              <input
                ref={emailRef}
                className="form-field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <div className="form-field-display">{email}</div>
            )}
            <button
              type="button"
              className="edit-field-btn"
              onClick={() => setEditingField(editingField === "email" ? null : "email")}
              aria-label="Edit email"
            >
              <MdOutlineEdit />
            </button>
          </div>
        </div>

        <div className="profile-actions">
          <button className="save-btn primary" onClick={saveChanges}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
