import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../../api/omdb";
import PortalModal from "../../components/PortalModal";
import styles from "./MovieDetails.module.css";

function MovieDetails() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    }
    fetchMovie();
  }, [imdbID]);

  if (!movie) {
    return null;
  }

  function closeModal() {
    navigate(-1);
  }

  return (
    <PortalModal>
      <div className={styles.backdrop} onClick={closeModal}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h1>
            {movie.Title} ({movie.Year})
          </h1>
          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>
          <p>
            <strong>Cast:</strong> {movie.Actors}
          </p>
          <p>
            <strong>Rating:</strong> {movie.imdbRating}
          </p>
          <p>
            <strong>Plot:</strong> {movie.Plot}
          </p>

          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </PortalModal>
  );
}

export default MovieDetails;
