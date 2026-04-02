<div align="center" style="margin-top: 0; margin-bottom: 0;">
  <img src="frontend/src/assets/watch-finder-logo.png" alt="WatchFinder Logo" width="200" style="display:block; margin:0 auto;"/>
</div>

# WATCH FINDER

WATCH FINDER is a mobile-friendly web app that helps users find, track, and
search movies, TV shows, and other media across streaming platforms in their
region.

## Getting Started: Running this project

### Running the frontend:

1. Make sure you have Node and npm installed. You can check by running:

```bash
node -v
npm -v
```

2. Clone the repository and install dependencies

```bash
git clone https://github.com/Kevonosdiaz/watch-finder.git
cd frontend
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open the URL shown in your terminal (usually http://localhost:5173).

### Running the backend:

- Planning to allow either pip or uv in the future

1. Ensure `uv` is installed

2. In the `backend` directory, execute `uv sync` to install dependencies

```bash
uv sync
```

3. Start the backend server with `uv run main.py`

```bash
uv run main.py
```

4. Open the URL shown in your terminal (e.g. http://localhost:8000)
