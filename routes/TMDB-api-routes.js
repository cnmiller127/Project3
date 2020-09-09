const axios = require("axios");
require('dotenv').config()
const KEY = process.env.API_KEY;
// API key safely stored in env variables on our backend
module.exports = function (app)  {
    
    //Get movies by title
  app.get("/tmdb/title", async function (req, res) {
    try{
        var title = req.query.title;
        var query;
        if(title){
            query = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${title}&page=1&include_adult=false`;
                 }
        let movies = await axios.get(query);
        console.log(movies.data);
        res.json(movies.data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}),
  // Get person id
  app.get("/tmdb/person", async function (req, res) {
    try{
        var person = req.query.person;
        var query;
        if(person){
            query = `https://api.themoviedb.org/3/search/person?api_key=${KEY}&language=en-US&query=${person}&page=1&include_adult=false`;
                 }
        let movie = await axios.get(query);
        res.json(movie.data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}),
    //get movies with searched person in cast
app.get("/tmdb/person/movies", async function (req, res) {
    try{
        const id = req.query.id;
        var query;
        if(id){
            query = `http://api.themoviedb.org/3/discover/movie?with_cast=${id}&api_key=${KEY}&page=1`;
        }
        let movie = await axios.get(query);
        res.json(movie.data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}),
    //Get movie details including cast
  app.get("/tmdb/movieDetail", async function (req, res) {
      try{
            var query;
            const id = req.query.id;
            query = `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=en-US&append_to_response=credits`;
            let details = await axios.get(query);
            res.json(details.data);
      }
      catch (err) {
             res.status(500).json(err);
      }

    });     
}