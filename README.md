<div align="center" style="margin-top: 0; margin-bottom: 0;">
  <img src="frontend/src/assets/watch-finder-logo.png" alt="WatchFinder Logo" width="200" style="display:block; margin:0 auto;"/>
</div>

# WATCH FINDER

WATCH FINDER is a mobile-friendly web app that helps users find, track, and
search movies, TV shows, and other media across streaming platforms in their
region.

## Getting Started: Running this project

### Clone the repository:

```bash
git clone https://github.com/Kevonosdiaz/watch-finder.git
cd watch-finder
```

### Running the backend:

1. Ensure `uv` and `MySQL` is installed
```bash
uv --version
mysql --version
```
2. In the `backend` directory, execute `uv sync` to install dependencies

```bash
cd backend
uv sync
```
3. Import the database and example data

```bash
mysql -u root < db_setup.sql
```
4. Ensure MySQL is running and start the backend server

```bash
uv run main.py
```

### Running the frontend:

1. Make sure you have Node and npm installed. You can check by running:

```bash
node -v
npm -v
```

2. Clone the repository and install dependencies

```bash
cd frontend
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open the URL shown in your terminal (usually http://localhost:5173).
