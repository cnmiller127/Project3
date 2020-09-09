import axios from "axios";
export default {
    
  // Search movies by title
  searchMoviesByTitle: async function(title) {
    title = (title.split(" ").join("+").trim().toLowerCase());
    console.log(title);
    return await axios.get("/tmdb/title", {params: {title: title}});
  },
  getPersonID: async function(person) {
    person = (person.split(" ").join("+").trim().toLowerCase());
    return await axios.get("/tmdb/person", {params: {person: person}});

  },
  searchMoviesByPerson: async function(id) {
    return await axios.get("/tmdb/person/movies", {params: {id: id}});
  },
  getGenres: async function() {
    return await axios.get("/tmdb/genre");
  },
  searchMoviesByGenre: async function(id) {
    return await axios.get("/tmdb/genre/movies", {params: {id: id}});
  },

  getMovieByID: async function(id) {
    return await axios.get("/tmdb/movieDetail", {params: {id: id}});
  }
           
}