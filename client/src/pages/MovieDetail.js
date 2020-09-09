import React, { useState, useEffect } from "react";
import { Media, Button, Row, Col, Container, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import SqlAPI from "../utils/SQL-API";
import TMDbAPI from "../utils/TMDbAPI";
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
    movie_id: "",
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
    if (movieState.title) {
      localStorage.setItem("movie", JSON.stringify(movieState));
      console.log(movieState);
      retrieveMovie(movieState).then((res) => {
        console.log(res);
        setMovie(res);
        console.log(movie);
      });
    } else if (localStorage.getItem("movie")) {
      const getStor = JSON.parse(localStorage.getItem("movie"));
      console.log(getStor);
      retrieveMovie(getStor).then((res) => {
        console.log(res);
        setMovie(res);
        console.log(movie);
      });
    }
  }, []);

  const retrieveMovie = async (movie) => {
    try {
      let res = await TMDbAPI.getMovieByID(movie.movie_id);
      await checkUniqueWish(movie);
      // await checkUniqueLib(movie)
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

  const checkUniqueWish = async function (movie) {
    const count = await SqlAPI.countEntriesWish(movie.movie_id);
    console.log(count.data);
    if (count.data > 0) {
      setButtonStatus({
        ...buttonStatus,
        wishlist: "Hidden",
      });
      console.log(false);
      return false;
    } else {
      return true;
    }
  };

  // const checkUniqueLib = async function(movie) {
  //   const count = await SqlAPI.countEntries(movie.imdbID);
  //   if (count.data > 0) {
  //     switch(movie.format) {
  //       case "DVD":
  //         setButtonStatus({
  //           ...buttonStatus,
  //           DVD: "Hidden"
  //         });
  //       case "BluRay":
  //         setButtonStatus({
  //           ...buttonStatus,
  //           BluRay: "Hidden"
  //         });
  //       case "VOD":
  //         setButtonStatus({
  //           ...buttonStatus,
  //           VOD: "Hidden"
  //         });
  //       default:
  //         return false;
  //     }} else {
  //       return true;
  //     }
  //   }

  const deleteIfOnWish = async function (movie) {
    const isUnique = await checkUniqueWish(movie);
    if (!isUnique) {
      SqlAPI.deleteWishlist(movie.movie_id);
    }
  };

  const getCast = function (movie) {
    var cast_string = "";
    if(movie.credits.cast.length >= 5 )
      for(var i = 0; i < 5; i++){
        if(i < 4) {
          cast_string += (movie.credits.cast[i].name + ", ");
        }
        else {
          cast_string += movie.credits.cast[i].name;
        }
      }
    else {
      for(var i = 0; i < movie.credits.cast.length; i++){
        if(i < movie.credits.cast.length - 1){
          cast_string += (movie.credits.cast[i].name + ", ");
        }
        else {
          cast_string += movie.credits.cast[i].name;
        }
      }

    }
    return cast_string;
  }

  const getDirector = function (movie) {
    var director_string = "";
    const crew = movie.credits.crew; 
    const directorArr = crew.filter(person => {
      return person.job === "Director"
    });
    for(var i = 0; i < directorArr.length; i++){
      if(i < directorArr.length - 1){
        director_string += (directorArr[i].name + ", ");
      }
      else {
        director_string += directorArr[i].name;
      }
    }
    return director_string;
    
  }

  const handleSave = function (e) {
    e.preventDefault();
    const movieObject = {
      movie_id: movie.id,
      title: movie.title,
      poster: handleImg(movie.poster_path),
      year: movie.release_date,
      synopsis: movie.overview,
      director: getDirector(movie),
      cast: getCast(movie),
      format: this.value,
      wishlist: false,
    };
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

    console.log(movieObject);
    deleteIfOnWish(movieObject).then(saveMovieToDB(movieObject));
  };

  const handleSaveToWish = function (e) {
    e.preventDefault();
    const movieObject = {
      movie_id: movie.id,
      title: movie.title,
      poster: handleImg(movie.poster_path),
      year: movie.release_date,
      synopsis: movie.overview,
      director: getDirector(movie),
      cast: getCast(movie),
      format: "",
      wishlist: true,
    };
    if (movieObject.wishlist) {
      setButtonStatus({
        ...buttonStatus,
        wishlist: "Hidden",
      });
    }
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

  const renderWishBtn = function (movie) {
    if (buttonStatus.wishlist === "Show") {
      return (
        <Button
          className="formatBtn"
          left="true"
          outline
          color="primary"
          wish="wishlist"
          onClick={handleSaveToWish}
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
          onClick={handleSaveToWish}
        >
          Saved to Wishlist!
        </Button>
      );
    }
  };

  const handleImg  = function(poster) {
    if (poster) {
      var imgString = "https://image.tmdb.org/t/p/w500/" + poster;
      return imgString;
    } else {
      return "https://i.imgur.com/FIxkRxV.png";
    }
  }

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
      {movie.title ? (
        <Row>
          <Col xs="12" sm="10">
            <div>
              <Button
                outline
                color="secondary"
                className="backBtn"
                onClick={history.goBack}
              >
                &lt; Go Back
              </Button>
            </div>
            <Media className="movieDetail">
              <Media className="mediaPoster">
                <Media
                  className="largePoster"
                  object
                  src={handleImg(movie.poster_path)}
                  alt={movie.title}
                />
              </Media>
              <Media body className="movieBody">
                <Media heading className="title">
                  <h2>
                    <strong>
                      {movie.title} {"(" + movie.release_date + ")"}
                    </strong>
                  </h2>
                </Media>
                <strong>Directed by {getDirector(movie)}</strong>
                <hr />
                <strong>Starring: {getCast(movie)}</strong>
                <hr />
                {handleSynopsis(movie.overview)}
                <hr />
                <h3>Own it? Click the formats you own</h3>
                {renderButtons(movie)}
                <hr />
                <h3>Want to own it?</h3>
                {renderWishBtn(movie)}
              </Media>
            </Media>
          </Col>
        </Row>
      ) : <Row className = "justify-content-center">
        <br/>
        <h1 className = "m-5 p-5">Loading...<Spinner  /></h1>
        </Row>}
    </Container>
  );
}
export default MovieDetail;
