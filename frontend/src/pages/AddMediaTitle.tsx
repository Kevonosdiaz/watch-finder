import { useState, useRef, useEffect } from "react";
import { api } from "../api/Client";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineFileUpload, MdOutlineCancel } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

interface AddMediaTitleProps {
  goBack: () => void;
}

type MediaTitle = {
  title: string;
  year: number | "";
  kind?: "Movie" | "TV";
  criticsScore?: number | "";
  rating?: string;
  runtime?: number | "";
  number_of_seasons?: number | "";
  creator?: string;
  synopsis?: string;
};

type MediaAvailability = {
  country_name: string;
  streaming_services: string[];
};

type StreamingService = {
  streaming_service_name: string;
};

export default function AddMediaTitle({ goBack }: AddMediaTitleProps){
    const [media, setMedia] = useState<MediaTitle>({
        title: "",
        year: "",
        kind: undefined,
        criticsScore: "",
        rating: "",
        runtime: "",
        number_of_seasons: "",
        creator: "",
        synopsis: "",
    });

    const [, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [availability, setAvailability] = useState<MediaAvailability[]>([]);
    const [newRegion, setNewRegion] = useState("");
    const [services, setServices] = useState<StreamingService[]>([]);

    // Set the streaming services
    useEffect(() => {
      api<StreamingService[]>("/api/streaming_services")
        .then(setServices)
        .catch(() => console.error("Failed to load services"));
    }, []);

    // Add media titles
    const handleAddMedia = async () => {
      if (!media.kind) {
        alert("Please select Movie or TV show");
        return;
      }

      const payload = {
        title_name: media.title,
        release_year: media.year || null,
        creator: media.creator || null,
        age_rating: media.rating || null,
        rating: media.criticsScore || null,
        description: media.synopsis || null,
        kind: media.kind,
        duration: media.kind === "Movie" ? media.runtime || null : null,
        number_of_seasons: media.kind === "TV" ? media.number_of_seasons || null : null,
        availability,
      };

      try {
        await api("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        goBack();
      } catch (err) {
        console.error("Failed to create media", err);
        alert("Failed to create media");
      }
    };
    
    return (
    <div className="admin-container">
      <div className="watchlist-header">
        <div className="back-btn">
          <button onClick={goBack}>
            <FaArrowLeft size={24} />
          </button>
        </div>
        <div className="watchlist-header-content">
          <div className="header">Add media title</div>
          <div className="subheader">Create a new movie or TV show</div>
        </div>
      </div>
      <div className="poster-stack">
        <div className="poster-wrapper">
          <img
            src={posterPreview || "/placeholder-poster.png"}
            className="poster-img"
          />
        </div>

        <div className="poster-actions">
          <button
            type="button"
            className="poster-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <MdOutlineFileUpload size={20} />
          </button>

          {posterPreview && (
            <button
              type="button"
              className="poster-remove-btn"
              onClick={() => {
                setPosterFile(null);
                setPosterPreview("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <FaTrashAlt />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPosterFile(file);
              setPosterPreview(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>
      <div className="edit-form-box">
        <div className="edit-form-field">
          <div className="form-label">Title</div>
          <input
            className="edit-form-field-input"
            placeholder="Enter the title (e.g. Avatar: The Last Airbender)"
            value={media.title}
            onChange={(e) => setMedia({ ...media, title: e.target.value })}
          />
        </div>
        <div className="edit-form-field">
          <div className="form-label">Year</div>
          <input
            type="number"
            className="edit-form-field-input"
            placeholder="Enter the release year (e.g. 2005)"
            value={media.year}
            onChange={(e) =>
              setMedia({ ...media, year: Number(e.target.value) })
            }
          />
        </div>
        <div className="edit-form-field">
          <div className="form-label">Critics score</div>
          <input
            type="number"
            step="0.1"
            className="edit-form-field-input"
            placeholder="Enter the critics score out of 10 (e.g. 9.3)"
            value={media.criticsScore}
            onChange={(e) =>
              setMedia({ ...media, criticsScore: Number(e.target.value) })
            }
          />
        </div>
        <div className="edit-form-field">
          <div className="form-label">Age rating</div>
          <input
            className="edit-form-field-input"
            placeholder="Enter the age rating (e.g. TV-Y7-FV)"
            value={media.rating}
            onChange={(e) => setMedia({ ...media, rating: e.target.value })}
          />
        </div>
        <div className="edit-form-field">
          <div className="form-label">Movie or show?</div>
          <select
            className="edit-form-field-select"
            value={media.kind}
            onChange={(e) =>
              setMedia({ ...media, kind: e.target.value as "Movie" | "TV" })
            }
          >
            <option value="" disabled>
                Select movie or TV show
            </option>
            <option value="Movie">Movie</option>
            <option value="TV">TV Show</option>
          </select>
        </div>
        {media.kind === "Movie" ? (
          <div className="edit-form-field">
            <div className="form-label">Movie runtime</div>
            <input
              type="number"
              className="edit-form-field-input"
              placeholder="Enter the movie's runtime in minutes (e.g. 124)"
              value={media.runtime}
              onChange={(e) =>
                setMedia({ ...media, runtime: Number(e.target.value) })
              }
            />
          </div>
        ) : (
          <div className="edit-form-field">
            <div className="form-label">Number of seasons</div>
            <input
              type="number"
              className="edit-form-field-input"
              placeholder="Enter the show's total number of seasons (e.g. 3)"
              value={media.number_of_seasons}
              onChange={(e) =>
                setMedia({ ...media, number_of_seasons: Number(e.target.value) })
              }
            />
         </div>
        )}
        <div className="edit-form-field">
          <div className="form-label">Creator</div>
          <input
            className="edit-form-field-input"
            placeholder="Enter the creator or director name"
            value={media.creator}
            onChange={(e) => setMedia({ ...media, creator: e.target.value })}
          />
        </div>
        <div className="edit-form-field">
          <div className="form-label">Synopsis</div>
          <textarea
            className="edit-form-field-textfield"
            placeholder="Enter a brief description of the movie or show"
            value={media.synopsis}
            onChange={(e) => setMedia({ ...media, synopsis: e.target.value })}
          />
        </div>
       <div className="edit-form-field availability">
        <div className="form-label">Where to Watch</div>
        <div className="availability-add">
          <input
            className="edit-form-field-input"
            placeholder="Enter region (e.g. Canada)"
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
          />
          <button
            type="button"
            className="add-region-btn"
            onClick={() => {
              const name = newRegion.trim();
              if (!name) return;
              setAvailability((prev) => [...prev, { country_name: name, streaming_services: [] }, ]);
              setNewRegion("");
            }}
          >
            <IoAddCircleOutline size={24}/>
          </button>
        </div>
        {availability.map((region, regionIndex) => (
          <div key={region.country_name} className="edit-availability-region">
            <div className="availability-region-header">
              <span>{region.country_name}</span>
              <button
                type="button"
                className="remove-region-btn"
                onClick={() =>
                  setAvailability((prev) => prev.filter((_, i) => i !== regionIndex))}
              >
                <MdOutlineCancel />
              </button>
            </div>
          <div className="availability-services">
            {services.map((s) => {
              const checked = region.streaming_services.includes(s.streaming_service_name);
              return (
                <label
                  key={s.streaming_service_name}
                  className="service-checkbox"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setAvailability((prev) =>
                        prev.map((r, i) => i !== regionIndex ? r : {
                          ...r,
                          streaming_services: e.target.checked ? [...r.streaming_services, s.streaming_service_name] : r.streaming_services.filter((x) => x !== s.streaming_service_name),
                        })
                      )
                    }
                  />
                  {s.streaming_service_name}
                </label>
              );
            })}
          </div>
          </div>
        ))}
        </div>
        <div className="details-actions">
          <button className="save-btn" onClick={handleAddMedia}>
            Create
          </button>
        </div>

      </div>
    </div>
  );
}