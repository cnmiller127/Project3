import React, { useState, useEffect } from "react";
import { Media, Button, Row, Col, Container } from "reactstrap";
import { useHistory } from 'react-router-dom';
import SqlAPI from "../utils/SQL-API";
import OMDbAPI from "../utils/OMDbAPI";
import { useMovieContext } from "../utils/movieContext";

function MovieDetail(props) {
  const [movieState, dispatchMovie] = useMovieContext();
  const [buttonStatus, setButtonStatus] = useState({
    DVD: "Show",
    BluRay: "Show",
    VOD: "Show",
    wishlist: "Show",
  });
  const [movie, setMovie] = useState({
    imdbID: "",
    title: "",
    poster: "",
    year: "",
    synopsis: "",
    director: "",
    cast: "",
    format: "",
    wishlist: false,
  });

  const history = useHistory();

  useEffect(() => {
    if (movieState.Title) {
      localStorage.setItem("movie", JSON.stringify(movieState));
      console.log(movieState);
      retrieveMovie(movieState).then((res) => {
        console.log(res);
        setMovie(res);
      });
    } else if (localStorage.getItem("movie")) {
      const getStor = JSON.parse(localStorage.getItem("movie"));
      console.log(getStor);
      retrieveMovie(getStor).then((res) => {
        console.log(res);
        setMovie(res);
      });
    }
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

  useEffect(() => {
    return;
  }, [buttonStatus]);

  const handleSave = function (e) {
    e.preventDefault();
    const movieObject = {
      imdbID: movie.imdbID,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
      synopsis: movie.Plot,
      director: movie.Director,
      cast: movie.Actors,
      format: this.value,
      wishlist: false,
    };
    if (this.wish === "wishlist") {
      movieObject.wishlist = true;
    }
    switch (movieObject.format) {
      case "DVD":
        setButtonStatus({
          ...buttonStatus,
          DVD: "Hidden",
        });
        break;
      case "BluRay":
        setButtonStatus({
          ...buttonStatus,
          BluRay: "Hidden",
        });
        break;
      case "VOD":
        setButtonStatus({
          ...buttonStatus,
          VOD: "Hidden",
        });
        break;
      default:
        break;
    }
    if (movieObject.wishlist) {
      setButtonStatus({
        ...buttonStatus,
        wishlist: "Hidden",
      });
    }
    console.log(movieObject);
    saveMovieToDB(movieObject);
  };

  const renderButtons = function () {
    const buttons = [];
    if (buttonStatus.DVD === "Show") {
      buttons.push(
        <Button
          className="formatBtn"
          key="1"
          left="true"
          color="success"
          value="DVD"
          onClick={handleSave}
        >
          DVD
        </Button>
      );
    } else {
      buttons.push(
        <Button
          className="formatBtn"
          key="1"
          left="true"
          outline
          disabled
          color="success"
          value="DVD"
          onClick={handleSave}
        >
          Saved DVD!
        </Button>
      );
    }
    if (buttonStatus.BluRay === "Show") {
      buttons.push(
        <Button
          className="formatBtn"
          key="2"
          left="true"
          color="primary"
          value="BluRay"
          onClick={handleSave}
        >
          Blu-Ray
        </Button>
      );
    } else {
      buttons.push(
        <Button
          className="formatBtn"
          key="2"
          left="true"
          outline
          disabled
          color="primary"
          value="BluRay"
          onClick={handleSave}
        >
          Saved Blu-Ray!
        </Button>
      );
    }
    if (buttonStatus.VOD === "Show") {
      buttons.push(
        <Button
          className="formatBtn"
          key="3"
          left="true"
          color="warning"
          value="VOD"
          onClick={handleSave}
        >
          VOD
        </Button>
      );
    } else {
      buttons.push(
        <Button
          className="formatBtn"
          key="3"
          left="true"
          outline
          disabled
          color="warning"
          value="VOD"
          onClick={handleSave}
        >
          VOD Saved!
        </Button>
      );
    }
    return buttons.map((element) => element);
  };

  const renderWishBtn = function () {
    if (buttonStatus.wishlist === "Show") {
      return (
        <Button
          className="formatBtn"
          left="true"
          outline
          color="primary"
          wish="wishlist"
          onClick={handleSave}
        >
          Add to Wishlist
        </Button>
      );
    } else {
      return (
        <Button
          className="formatBtn"
          left="true"
          outline
          disabled
          color="primary"
          wish="wishlist"
          onClick={handleSave}
        >
          Saved to Wishlist!
        </Button>
      );
    }
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

  return (
    <Container fluid>
      <h1 className="detailHeader">
        <strong>Movie Details</strong>
      </h1>
      <Row>
        <Col xs="12" sm="10">
        <div><a className="backBtn" onClick={history.goBack}>&lt; Go Back</a></div>
          <Media className="movieDetail">
            <Media className="mediaPoster">
              <Media
                className="largePoster"
                object
                src={handleImg(movie.Poster)}
                alt={movie.Title}
              />
            </Media>
            <Media body className="movieBody">
              <Media heading className="title">
                <h2>
                  <strong>
                    {movie.Title} {"(" + movie.Year + ")"}
                  </strong>
                </h2>
              </Media>
              <strong>Directed by {movie.Director}</strong>
              <hr />
              <strong>Starring: {movie.Actors}</strong>
              <hr />
              {handleSynopsis(movie.Plot)}
              <hr />
              <h3>Own it? Click the formats you own</h3>
              {renderButtons()}
              <hr />
              <h3>Want to own it?</h3>
              {renderWishBtn()}
            </Media>
          </Media>
        </Col>
      </Row>
    </Container>
  );
}
export default MovieDetail;
