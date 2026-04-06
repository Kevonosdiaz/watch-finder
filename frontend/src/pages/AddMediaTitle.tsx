import { useState, useRef } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";

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
        <div className="details-actions">
          <button className="save-btn">
            Create
          </button>
        </div>

      </div>
    </div>
  );
}