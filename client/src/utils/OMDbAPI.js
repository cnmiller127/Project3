import axios from "axios";
export default {
    
  // Gets all books
  searchMovies: async function(title) {
    title = (title.split(" ").join("+").trim().toLowerCase());
    console.log(title);
    return await axios.get("/omdb/movies", {params: {title: title}});
  },

  getMovieByID: async function(id) {
    return await axios.get("/omdb/movieDetail", {params: {id: id}});
  }
           
}