interface WatchlistProps {
  goToHome: () => void;
}

export default function Watchlist({ goToHome }: WatchlistProps) {
  return (
    <div>
      <h1>Watchlist Page</h1>
      <button onClick={goToHome}>Back to Home</button>
    </div>
  );
}