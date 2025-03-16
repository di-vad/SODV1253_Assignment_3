import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MovieDetails from "./pages/MovieDetails/MovieDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:imdbID" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;
