import React from "react";
import styles from "./MovieCard.module.css";

function MovieCard({ movie, onClick }) {
  function handleClick() {
    onClick(movie.imdbID);
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <h4>{movie.Title}</h4>
      <p>Year: {movie.Year}</p>
      <p>Rating: {movie.imdbRating || "N/A"}</p>
    </div>
  );
}

export default MovieCard;
