import React, { useState, useEffect, useRef } from "react";
import { Media, Button } from "reactstrap";
import classnames from "classnames";
import SqlAPI from "../utils/SQL-API";
import OMDbAPI from "../utils/OMDbAPI";
import { useMovieContext } from "../utils/movieContext";

function MovieDetail(props) {
  const [movieState, dispatchMovie] = useMovieContext();
  const [movie, setMovie] = useState({
    title: "",
    poster: "",
    year: "",
    synopsis: "",
    format: "",
    wishlist: false,
  });

  useEffect(() => {
    console.log(movieState);
    retrieveMovie(movieState).then((res) => {
      console.log(res);
      setMovie(res);
      console.log(movie);
    });
  }, []);

  const retrieveMovie = async (movie) => {
    try {
      let res = await OMDbAPI.getMovieByID(movie.imdbID);
      //console.log(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const saveMovieToDB = async (movieData) => {
    try {
      await SqlAPI.saveMovie(movieData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = function (e) {
    e.preventDefault();
    const movieObject = {
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      synopsis: movie.Plot,
      format: this.value,
      wishlist: false,
    };

    console.log(movieObject);
    saveMovieToDB(movieObject);
  };

  const handleImg = function (string) {
    if (string !== "N/A") {
      return string;
    } else {
      return "https://bit.ly/3hxWg5k";
    }
  };

  const handleSynopsis = function (string) {
    if (string !== "N/A") {
      return string;
    } else {
      return "No synopsis available";
    }
  };

  const handleHide = function (e) {};

  return (
    <div>
      <h2 className="detailHeader"><strong>Movie Details</strong></h2>
      <Media className="movieDetail">
        <Media left>
          <Media
            className="largePoster"
            object
            src={handleImg(movie.Poster)}
            alt={movie.Title}
          />
        </Media>
        <Media body className="movieBody">
          <Media heading>{movie.Title}</Media>
          {handleSynopsis(movie.Plot)}
          <br />
          <h3>Own it? Click the formats you own</h3>
          <br />
          <Button
            className="formatBtn"
            left="true"
            color="success"
            value="DVD"
            onClick={handleSave}
          >
            DVD
          </Button>
          <Button
            className="formatBtn"
            left="true"
            color="primary"
            value="BluRay"
            onClick={handleSave}
          >
            Blu-Ray
          </Button>
          <Button
            className="formatBtn"
            left="true"
            color="warning"
            value="VOD"
            onClick={handleSave}
          >
            VOD
          </Button>
        </Media>
      </Media>
    </div>
  );
}
export default MovieDetail;
