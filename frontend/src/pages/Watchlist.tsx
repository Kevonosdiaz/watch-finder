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
            items: wl.media.map((m: any) => ({
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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  
  const startEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setNewWatchlistName(currentName);
  }

  const removeWatchlistItem = async (watchlistId: number, itemId: number) => {
    try {
      await api(
        `/api/watchlists/${watchlistId}/media/${itemId}`,
        { method: "DELETE"}
      );

      setWatchlists(watchlists.map(w => {
        if (w.id === watchlistId) {
          return {
            ...w,
            items: w.items.filter(item => item.id !== itemId)
          };
        }
        return w;
      }));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  }    
    
  const deleteWatchlist = (id: number) => {
    setWatchlists(watchlists.filter(w => w.id !== id));
  }

  const saveEdit = () => {
    setWatchlists(
      watchlists.map(w => 
        w.id === editingId ? { ...w, name: newWatchlistName } : w
      )
    );
    setEditingId(null);
    setNewWatchlistName("");
  }

  const cancelEdit = () => {
    setEditingId(null);
    setNewWatchlistName("");
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
      />
      <button className="create-btn">
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
                onClick={() => startEdit(watchlist.id, watchlist.name)}
              >
                <MdOutlineEdit size={18}/>
              </button>
            </>
          )}
        </div>
      <div className="watchlist-content scroll">
        {watchlist.items.map((item) => (
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