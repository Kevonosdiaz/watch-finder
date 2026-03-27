import { useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface WatchlistProps {
  goToHome: () => void;
}

interface Watchlist {
  id: number;
  name: string;
  items: WatchlistItem[];
}

interface WatchlistItem {
  id: number;
  name: string;
}

export default function Watchlist({ goToHome }: WatchlistProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    { id: 1, 
      name: "Journey through the Rings",
      items: [
        { id: 101, name: "The Fellowship of the Ring" },
        { id: 102, name: "The Two Towers" },
      ]
    
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  
  const startEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setNewWatchlistName(currentName);
  }

  const removeWatchlistItem = (watchlistId: number, itemId: number) => {
    setWatchlists(watchlists.map(w => {
      if (w.id === watchlistId) {
        return {
          ...w,
          items: w.items.filter(item => item.id !== itemId)
        };
      }
      return w;
    }));
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
      <div key={watchlist.id} className="watchlist-card">
        <div className="watchlist-card-header">
          {editingId === watchlist.id ? (
            <>
              <input
                type="text"
                value={newWatchlistName}
                onChange={e => setNewWatchlistName(e.target.value)}
                className="edit-watchlist-title-input"
              />
              <button onClick={saveEdit}>Save</button>
              <button className="watchlist-trash-btn" onClick={() => deleteWatchlist(watchlist.id)}>
                <FaTrashAlt size={22}/>
              </button>
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
      <div className="watchlist-content">
        {watchlist.items.map((item) => (
          <div key={item.id} className="poster-wrapper">
            {editingId === watchlist.id && (
              <button
                className="poster-trash-btn"
                onClick={() => removeWatchlistItem(watchlist.id, item.id)}
              >
                <FaTrashAlt size={22}/>
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