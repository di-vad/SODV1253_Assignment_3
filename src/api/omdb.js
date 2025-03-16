const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
    query
  )}&type=movie&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "False") {
    return { Search: [], totalResults: 0 };
  }
  return data;
}

export async function getMovieDetails(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "False") {
    throw new Error("Movie not found.");
  }
  return data;
}
