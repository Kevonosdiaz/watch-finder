import { useState, useEffect } from "react";
import { api } from "../api/Client";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit, MdOutlineCancel } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface WatchlistProps {
  goToHome: () => void;
  goToWatchdata: (watchlistId: number, titleId: number) => void;
}

type Media = {
  id: number;
  title: string;
  year: number;
  criticsScore?: number;
  rating?: string;
  creator?: string;
  synopsis?: string;
  posterUrl?: string;
};

interface Watchlist {
  id: number;
  name: string;
  email: string;
  date_created: string;
  items: Media[];
}

export default function Watchlist({ goToHome, goToWatchdata }: WatchlistProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  // Hardcoded for testing
  const email = "jane.doe@ucalgary.ca";
  useEffect(() => {
    async function fetchWatchlists() {
        try {
        // API call
        const data = await api<Watchlist[]>(
            `/api/users/${email}/watchlists`
        );
        
        // Backend mapping to frontend state
        setWatchlists(
          data.map((wl: any) => ({
            id: wl.watchlist_id,
            name: wl.watchlist_name,
            email: wl.email,
            date_created: wl.date_added,
            items: (wl.media ?? []).map((m: any) => ({
              id: m.media_id,
              title: m.title_name,
              year: m.release_year,
              creator: m.creator,
              rating: m.age_rating,
              criticsScore: m.rating,
              synopsis: m.description,
              posterUrl: m.posterUrl ?? "",
            })),
          }))
        );

        } catch (err) {
        console.error("Failed to fetch watchlists", err);
        }
    }

    fetchWatchlists();
  }, [email]);

  const [editWatchlistName, setEditWatchlistName] = useState("");

  const createWatchlist = async (watchlistName: string) => {
    if (!watchlistName.trim()) return; 

    try {
      const newWatchlist = await api<any>(
        `/api/users/${email}/watchlists`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            watchlist_name: watchlistName
          }),
        }
      );

      // Newly created watchlists will show up at the top
      setWatchlists(prev => [ {
        id: newWatchlist.watchlist_id,
        name: newWatchlist.watchlist_name,
        email: email,
        date_created: newWatchlist.date_added,
        items: []
      },
      ...prev,
    ]);
    } catch (err) {
      console.error("Failed to create watchlist", err);
    }  
  }

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [editingItems, setEditingItems] = useState<Map<number, Media[]>>(new Map());
  
  const startEdit = (id: number, currentName: string, items: Media[]) => {
    setEditingId(id);
    setEditWatchlistName(currentName);
    // Keep track of edits
    setEditingItems(prev => new Map(prev).set(id, [...items]));
  }
  
  const removeWatchlistItem = (watchlistId: number, itemId: number) => {
    setEditingItems(prev => {
      const copy = new Map(prev);
      const currentItems = copy.get(watchlistId) ?? [];
      copy.set(
        watchlistId,
        currentItems.filter(item => item.id !== itemId)
      );
      return copy;
    });
  };
    
  const deleteWatchlist = async (watchlistId: number) => {
    try {
      await api(`/api/users/${email}/watchlists/${watchlistId}`, { method: "DELETE" });
      setWatchlists(prev => prev.filter(w => w.id !== watchlistId));
    } catch (err) {
      console.error("Failed to delete watchlist", err)
    }
  }

  const saveEdit = async () => {
    if (editingId == null) return;

    const updatedItems = editingItems.get(editingId) ?? [];

    try {
      // Find the original watchlist with media titles
      const original = watchlists.find(w => w.id === editingId);
      const removed = original!.items.filter(
        item => !updatedItems.some(u => u.id === item.id)
      );

      // Delete removed items from backend
      for (const item of removed) {
        await api(`/api/watchlists/${editingId}/media/${item.id}`, { method: "DELETE" });
      }

      // Update frontend
      setWatchlists(prev =>
        prev.map(w =>
          w.id === editingId
            ? { ...w, name: newWatchlistName, items: updatedItems }
            : w
        )
      );

      setEditingId(null);
      setNewWatchlistName("");
      setEditingItems(prev => {
        const updatedWatchlist = new Map(prev);
        updatedWatchlist.delete(editingId);
        return updatedWatchlist;
    });
    } catch (err) {
      console.error("Failed to save watchlist edits", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewWatchlistName("");
    // Reset editing state
    setEditingItems(prev => {
      const newMap = new Map(prev);
      if (editingId) newMap.delete(editingId);
      return newMap;
    });
  };
  
  return (
    <div className="watchlist-container">
    <div className="watchlist-header">
      <div className="back-btn">
        <button onClick={goToHome}>
          <FaArrowLeft size={24}/>
        </button>
      </div>
      <div className="watchlist-header-content">
        <div className="header">Watchlists</div>
        <div className="subheader">Create and manage your watchlists.</div>
      </div>
    </div>
    <div className="watchlist-card-title-section">
      <h2>Create a Watchlist</h2>
    </div>
    <div className="create-watchlist">
      <input
        type="text"
        placeholder="Enter the name of your watchlist"
        value={newWatchlistName}
        onChange={(e) => setNewWatchlistName(e.target.value)}
      />
      <button 
        className="create-btn"
        type="button"
        onClick={() => {
          if (!newWatchlistName.trim()) return;
          createWatchlist(newWatchlistName);
          setNewWatchlistName("");
        }}
      >
        <IoAddCircleOutline />
      </button>
    </div>
    <div className="watchlist-card-title-section">
      <h2>Your Watchlists</h2>
    </div>
    {watchlists.map(watchlist => (
      <div key={watchlist.id} className={`watchlist-card ${editingId === watchlist.id ? "edit-mode" : ""}`}>
        <div className="watchlist-card-header">
          {editingId === watchlist.id ? (
            <>
            <div className="edit-title-row">
              <input
                type="text"
                value={newWatchlistName}
                onChange={e => setNewWatchlistName(e.target.value)}
                className="edit-watchlist-title-input"
              />
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={cancelEdit}
              >
                <MdOutlineCancel size={20} />
              </button>
              </div>
              <div className="bottom-right-actions">
                <button className="save-btn" onClick={saveEdit}>Save</button>
                <button className="watchlist-trash-btn" onClick={() => deleteWatchlist(watchlist.id)}>
                  <FaTrashAlt size={18}/>
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>{watchlist.name}</h3>
              <button 
                className="edit-btn"
                onClick={() => startEdit(watchlist.id, watchlist.name, watchlist.items)}
              >
                <MdOutlineEdit size={18}/>
              </button>
            </>
          )}
        </div>
      <div className="watchlist-content scroll">
        {(editingId === watchlist.id ? (editingItems.get(watchlist.id) ?? []) : watchlist.items).map((item) => (
          <div key={item.id} className="poster-wrapper">
            <button
              type="button"
              className="poster-btn"
              onClick={() => goToWatchdata(watchlist.id, item.id)}
              disabled={editingId === watchlist.id}
            >
            </button>
            {editingId === watchlist.id && (
              <button
                className="poster-trash-btn"
                onClick={() => removeWatchlistItem(watchlist.id, item.id)}
              >
                <FaTrashAlt size={18}/>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    ))}
    </div>    
  );
}