const axios = require("axios");
require('dotenv').config()
const KEY = process.env.REACT_APP_API_KEY;


module.exports = function (app)  {
    
  // Gets all books
    app.get("/omdb/movies", async function (req, res) {
        try{
            var title = req.query.title;
            console.log("REQUEST:", title);
            var query;
            if(title){
                query = `https://www.omdbapi.com/?apikey=${KEY}&s=${title}`;
                     }
            console.log(query);
            let movie = await axios.get(query);
            res.json(movie.data);
        }
        catch (err) {
            throw err;
        }
  }),

  app.get("/omdb/movieDetail", async function (req, res) {
    var query;
    const id = req.query.id;
    query = `https://www.omdbapi.com/?apikey=${KEY}&i=${id}`;
    console.log(query);
    let details = await axios.get(query);
    res.json(details.data);
  });
           
}

