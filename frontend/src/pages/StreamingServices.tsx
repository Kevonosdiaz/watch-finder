import { useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface StreamingService {
  id: number;
  name: string;
  website_url?: string;
}

interface Props {
  goHome: () => void;
}

export default function StreamingServices({ goHome }: Props) {
  const [services, setServices] = useState<StreamingService[]>([
    { id: 1, name: "Netflix", website_url: "https://www.netflix.com" },
    { id: 2, name: "Hulu", website_url: "https://www.hulu.com" },
    { id: 3, name: "Disney+", website_url: "https://www.disneyplus.com" },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  function startEdit(s: StreamingService) {
    setEditingId(s.id);
    setEditedName(s.name);
    setEditedUrl(s.website_url ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditedName("");
    setEditedUrl("");
  }

  function saveEdit() {
    if (editingId == null) return;
    setServices((prev) => prev.map(s => s.id === editingId ? { ...s, name: editedName, website_url: editedUrl } : s));
    cancelEdit();
  }

  function removeService(id: number) {
    setServices((prev) => prev.filter(s => s.id !== id));
  }

  function addService() {
    if (!newName.trim()) return;
    const id = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices(prev => [...prev, { id, name: newName.trim(), website_url: newUrl.trim() }]);
    setNewName("");
    setNewUrl("");
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
            <div key={s.id} className="form-field-row" style={{ alignItems: 'center' }}>
              {editingId === s.id ? (
                <div className="edit-row">
                  <input className="form-field-input" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                  <input className="form-field-input" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
                  <button className="save-btn" onClick={saveEdit}>Save</button>
                  <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div className="form-label" style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="form-sub" style={{ color: '#4b5563' }}>{s.website_url}</div>
                  </div>
                  <div>
                    <button className="edit-btn" onClick={() => startEdit(s)}>
                      <MdOutlineEdit size={18} />
                    </button>
                    <button className="delete-btn" onClick={() => removeService(s.id)}>
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


