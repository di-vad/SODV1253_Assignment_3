Movie Search App (React + OMDb API)
Overview

A simple React app that allows users to search for movies using the OMDb API. Features include searching by title, filtering by genre, viewing top-rated movies, and paginated results.
Features

Search movies by title
Filter search results by genre
View top-rated movies
Paginate through search results
Click on a movie to see details in a modal

Installation:

Add your OMDb API key in a .env file:

REACT_APP_OMDB_API_KEY=your_api_key_here

Start the development server:

npm start

Project Structure
src/
│── api/omdb.js # API helper functions
│── components/
│ ├── MovieCard.js # Displays movie cards
│ ├── PortalModal.js # React Portal for movie details
│── pages/
│ ├── Home.js # Search, filtering, pagination
│ ├── MovieDetails.js # Movie details modal
│── App.js # Routing setup
