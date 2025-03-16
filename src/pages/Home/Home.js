import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchMovies, getMovieDetails } from "../../api/omdb";
import styles from "./Home.module.css";
import MovieCard from "../../components/MovieCard/MovieCard";

const TOP_RATED_IDS = ["tt0468569", "tt0137523", "tt0110912"];

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const promises = TOP_RATED_IDS.map((id) => getMovieDetails(id));
        const results = await Promise.all(promises);

        setTopRatedMovies(results);

        const allGenres = new Set();
        results.forEach((mov) => {
          if (mov.Genre) {
            mov.Genre.split(", ").forEach((g) => allGenres.add(g.trim()));
          }
        });
        setGenreOptions(Array.from(allGenres));
      } catch (err) {
        console.error("Error fetching top rated:", err);
      }
    }
    fetchTopRated();
  }, []);

  async function fetchAllMovies(query, maxPages = 5) {
    let combinedResults = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages && currentPage <= maxPages) {
      const data = await searchMovies(query, currentPage);
      if (!data.Search) {
        break;
      }
      combinedResults.push(...data.Search);
      totalPages = Math.ceil((parseInt(data.totalResults, 10) || 0) / 10);

      currentPage++;
    }

    const detailedPromises = combinedResults.map((item) =>
      getMovieDetails(item.imdbID)
    );
    const detailedMovies = await Promise.all(detailedPromises);

    return detailedMovies;
  }

  useEffect(() => {
    if (!searchQuery) {
      setMovies([]);
      return;
    }

    async function doSearch() {
      try {
        setLoading(true);
        const detailedMovies = await fetchAllMovies(searchQuery, 5);

        const allGenres = new Set([...genreOptions]);
        detailedMovies.forEach((mov) => {
          if (mov.Genre) {
            mov.Genre.split(", ").forEach((g) => allGenres.add(g.trim()));
          }
        });
        topRatedMovies.forEach((mov) => {
          if (mov.Genre) {
            mov.Genre.split(", ").forEach((g) => allGenres.add(g.trim()));
          }
        });

        setGenreOptions(Array.from(allGenres));
        setMovies(detailedMovies);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
    setPage(1);
  }, [searchQuery]);

  const filteredTopRated = selectedGenre
    ? topRatedMovies.filter(
        (m) => m.Genre && m.Genre.split(", ").includes(selectedGenre)
      )
    : topRatedMovies;

  const filteredMovies = selectedGenre
    ? movies.filter(
        (m) => m.Genre && m.Genre.split(", ").includes(selectedGenre)
      )
    : movies;

  const totalPages = Math.ceil(filteredMovies.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const displayedMovies = filteredMovies.slice(
    startIndex,
    startIndex + pageSize
  );

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function handleGenreChange(e) {
    setSelectedGenre(e.target.value);
    setPage(1);
  }

  function handleMovieClick(imdbID) {
    navigate(`/movies/${imdbID}`, { state: { background: location } });
  }

  function nextPage() {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }

  function prevPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Movie Search & Filter Project</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={handleSearch}
        />

        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genreOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <h2>Top Rated Samples</h2>
      <div className={styles.grid}>
        {filteredTopRated.map((m) => (
          <MovieCard key={m.imdbID} movie={m} onClick={handleMovieClick} />
        ))}
      </div>

      <hr />

      {searchQuery && (
        <>
          <h2>Search Results</h2>
          {loading && <p>Loading…</p>}
          {!loading && (
            <>
              <div className={styles.grid}>
                {displayedMovies.map((m) => (
                  <MovieCard
                    key={m.imdbID}
                    movie={m}
                    onClick={handleMovieClick}
                  />
                ))}
              </div>

              {filteredMovies.length > 0 && (
                <div className={styles.pagination}>
                  <button onClick={prevPage} disabled={page <= 1}>
                    Prev
                  </button>
                  <span>
                    Page {page} / {totalPages}
                  </span>
                  <button onClick={nextPage} disabled={page >= totalPages}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
