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

  const [editingName, setEditingName] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");


  useEffect(() => {
    async function loadStreamingServices() {
      try {
        const data = await api<StreamingService[]>("/api/streaming_services");
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch streaming services", err);
      }
    }

    loadStreamingServices();
  }, []);

  function startEdit(s: StreamingService) {
    setEditingName(s.streaming_service_name);
    setEditedName(s.streaming_service_name);
    setEditedUrl(s.website_url ?? "");
  }

  function cancelEdit() {
    setEditingName(null);
    setEditedName("");
    setEditedUrl("");
  }

  async function saveEdit() {
    if (!editingName) return;

    try {
      const encodedName = encodeURIComponent(editingName);

      const updatedService = await api<StreamingService>(`/api/streaming_services/${encodedName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({website_url: editedUrl}),
      });
      setServices((prev) => prev.map(s => s.streaming_service_name === editingName ? updatedService : s ));
      cancelEdit();
    } catch (err) {
      console.error("Failed to update streaming service", err);
    }
  }

  async function removeService(name: string) {
    try {
      const encodedName = encodeURIComponent(name);

      await api(`/api/streaming_services/${encodedName}`, {
        method: "DELETE",
      });

      setServices((prev) => prev.filter(s => s.streaming_service_name !== name));
    } catch (err) {
      console.error("Failed to delete streaming service", err);
    }
  }

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
              {editingName === s.streaming_service_name ? (
                <div className="edit-row">
                  <input className="form-field-input" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                  <input className="form-field-input" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
                  <button className="save-btn" onClick={saveEdit}>Save</button>
                  <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div className="form-label" style={{ fontWeight: 600 }}>{s.streaming_service_name}</div>
                    <div className="form-sub" style={{ color: '#4b5563' }}>{s.website_url}</div>
                  </div>
                  <div>
                    <button className="edit-btn" onClick={() => startEdit(s)}>
                      <MdOutlineEdit size={18} />
                    </button>
                   <button className="delete-btn" onClick={() => removeService(s.streaming_service_name)}>
                      <FaTrashAlt />
                   </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}