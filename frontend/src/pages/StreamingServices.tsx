import { useState, useEffect } from "react";
import { api } from "../api/Client";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface StreamingService {
  streaming_service_name: string;
  website_url?: string;
  logoUrl?: string | null;
}

interface Props {
  goHome: () => void;
}

export default function StreamingServices({ goHome }: Props) {
  const [services, setServices] = useState<StreamingService[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  function startEdit(s: StreamingService) {
    setEditedName(s.streaming_service_name);
    setEditedUrl(s.website_url ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditedName("");
    setEditedUrl("");
  }

// function saveEdit() {
 //   if (editingId == null) return;
 //   setServices((prev) => prev.map(s => s.id === editingId ? { ...s, name: editedName, website_url: editedUrl } : s));
 //   cancelEdit();
 // }

  //function removeService(id: number) {
  //  setServices((prev) => prev.filter(s => s.id !== id));
 // }

  async function addService() {
    if (!newName.trim()) return;
    
    try {
      const newService = await api<StreamingService>("/api/streaming_services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streaming_service_name: newName.trim(),
          website_url: newUrl.trim(),
        }),
      });

      setServices((prev) => [...prev, newService]);
    
      // Clear form
      setNewName("");
      setNewUrl("");
    } catch (err) {
      console.error("Failed to add streaming service", err);
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="back-btn">
          <button onClick={goHome} aria-label="Back to home">
            <FaArrowLeft size={24} />
          </button>
        </div>
        <div className="watchlist-header-content">
          <div className="header">Streaming services</div>
          <div className="subheader">Add, update or remove streaming services.</div>
        </div>
      </div>

      <div className="streaming-card">
        <div className="form-row" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-field-input"
              placeholder="Service name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="form-field-input"
              placeholder="Website URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button className="save-btn" onClick={addService}>
              <IoAddCircleOutline style={{ marginRight: 6 }} />
              Add
            </button>
          </div>
        </div>

        <div className="services-list">
          {services.map((s) => (
            <div key={s.streaming_service_name} className="form-field-row" style={{ alignItems: 'center' }}>
           {/*   {editingId === s.id ? (
                <div className="edit-row">
                  <input className="form-field-input" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                  <input className="form-field-input" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
                  <button className="save-btn" onClick={saveEdit}>Save</button>
                  <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>*/}
                  <div style={{ flex: 1 }}>
                    <div className="form-label" style={{ fontWeight: 600 }}>{s.streaming_service_name}</div>
                    <div className="form-sub" style={{ color: '#4b5563' }}>{s.website_url}</div>
                  </div>
                  <div>
                   {/* <button className="edit-btn" onClick={() => startEdit(s)}>
                      <MdOutlineEdit size={18} />
                    </button>
                   <button className="delete-btn" onClick={() => removeService(s.id)}>
                      <FaTrashAlt />
                   </button>*/}
                  </div>
               {/* </>
              )}*/}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


