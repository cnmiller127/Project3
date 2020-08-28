import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMovieContext } from "../utils/movieContext";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Jumbotron,
  Container,
  Media,
  Badge,
} from "reactstrap";
import { MOVIE_ID } from "../utils/actions";
import classnames from "classnames";
import SqlAPI from "../utils/SQL-API";
import "./library.css";

const LibraryTab = () => {
  var moviesArray = [];
  const [activeTab, setActiveTab] = useState("All");
  const [movieList, setMovieList] = useState(moviesArray);

  const [state, dispatch] = useMovieContext();
  const history = useHistory();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    retrieveMovies(activeTab);
  }, [activeTab]);

  const retrieveMovies = async (tab) => {
    try {
      switch (tab) {
        case "All":
          moviesArray = [];
          const movieObject = await SqlAPI.getMovies();
          const allMovies = movieObject.data;
          allMovies.forEach((movie) => moviesArray.push(movie));
          setMovieList(moviesArray);
          break;
        case "DVD":
          moviesArray = [];
          const dvdMovieObject = await SqlAPI.getMoviesByFormat("DVD");
          const dvdMovies = dvdMovieObject.data;
          dvdMovies.forEach((movie) => moviesArray.push(movie));
          setMovieList(moviesArray);
          break;
        case "Blu-Ray":
          moviesArray = [];
          const brMovieObject = await SqlAPI.getMoviesByFormat("BluRay");
          const brMovies = brMovieObject.data;
          brMovies.forEach((movie) => moviesArray.push(movie));
          setMovieList(moviesArray);
          break;
        case "VOD":
          moviesArray = [];
          const vodMovieObject = await SqlAPI.getMoviesByFormat("VOD");
          const vodMovies = vodMovieObject.data;
          vodMovies.forEach((movie) => moviesArray.push(movie));
          setMovieList(moviesArray);
          break;
        default:
          break;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = function () {
    const id = this.id;
    SqlAPI.deleteMovie(id);
    const newList = movieList.filter((item) => item.id !== id);
    setMovieList(newList);
  };

  const renderBadges = function (movieObject) {
    switch (movieObject.format) {
      case "DVD":
        return (
          <Badge color="success" pill>
            DVD
          </Badge>
        );
      case "BluRay":
        return (
          <Badge color="primary" pill>
            Blu-Ray
          </Badge>
        );
      case "VOD":
        return (
          <Badge color="warning" pill>
            VOD
          </Badge>
        );
      default:
        break;
    }
  };

  const handleClick = (movie) => {
    if (movie.imdbID && movie.title) {
      dispatch({
        type: MOVIE_ID,
        data: {
          Title: movie.title,
          imdbID: movie.imdbID,
        },
      });
      history.push("/movieDetail");
    }
  };

  return (
    <div>
      <Jumbotron fluid className="jumbotronLibrary">
        <Container fluid>
          <h1 className="display-3">Your Shelf</h1>
        </Container>
      </Jumbotron>

      <Row>
        <Col className="libraryTabs" sm="8">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "All" })}
                onClick={() => {
                  toggle("All");
                }}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "DVD" })}
                onClick={() => {
                  toggle("DVD");
                }}
              >
                DVD
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "Blu-Ray" })}
                onClick={() => {
                  toggle("Blu-Ray");
                }}
              >
                Blu-Ray
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "VOD" })}
                onClick={() => {
                  toggle("VOD");
                }}
              >
                VOD
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="All">
              <Row>
                <Col className="header" xs="11" sm="12">
                  <h4>
                    <strong>Your Library</strong>
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left top href={movie.poster}>
                              <Media
                                object
                                className="poster"
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>
                                <strong>
                                  {movie.title} {"(" + movie.year + ")"}{" "}
                                  {renderBadges(movie)}
                                </strong>
                              </Media>
                              {movie.synopsis}{" "}
                              <Button
                                className="infoBtn"
                                size="sm"
                                onClick={() => handleClick(movie)}
                                color="info"
                              >
                                More Info
                              </Button>
                              <br />
                              <Button
                                className="deleteBtn"
                                outline
                                color="danger"
                                size="sm"
                                id={movie.id}
                                onClick={handleDelete}
                              >
                                Remove from Shelf
                              </Button>
                            </Media>
                          </Media>
                        </ListGroupItem>
                      </Row>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="DVD">
              <Row>
                <Col className="header" xs="12">
                  <h4>
                    <strong>Your DVDs</strong>
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media
                                className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>
                                <strong>
                                  {movie.title} {"(" + movie.year + ")"}
                                </strong>
                              </Media>
                              {movie.synopsis}{" "}
                              <Button
                                className="infoBtn"
                                size="sm"
                                onClick={() => handleClick(movie)}
                                color="info"
                              >
                                More Info
                              </Button>
                              <br />
                              <Button
                                className="deleteBtn"
                                outline
                                color="danger"
                                size="sm"
                                id={movie.id}
                                onClick={handleDelete}
                              >
                                Remove from Shelf
                              </Button>
                            </Media>
                          </Media>
                        </ListGroupItem>
                      </Row>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="Blu-Ray">
              <Row>
                <Col className="header" xs="12">
                  <h4>
                    <strong>Your Blu-Rays</strong>
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media
                                className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>
                                <strong>
                                  {movie.title} {"(" + movie.year + ")"}
                                </strong>
                              </Media>
                              {movie.synopsis}{" "}
                              <Button
                                className="infoBtn"
                                size="sm"
                                onClick={() => handleClick(movie)}
                                color="info"
                              >
                                More Info
                              </Button>
                              <br />
                              <Button
                                className="deleteBtn"
                                outline
                                color="danger"
                                size="sm"
                                id={movie.id}
                                onClick={handleDelete}
                              >
                                Remove from Shelf
                              </Button>
                            </Media>
                          </Media>
                        </ListGroupItem>
                      </Row>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="VOD">
              <Row>
                <Col className="header" xs="12">
                  <h4>
                    <strong>Your VOD Purchases</strong>
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media
                                className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>
                                <strong>
                                  {movie.title} {"(" + movie.year + ")"}
                                </strong>
                              </Media>
                              {movie.synopsis}{" "}
                              <Button
                                className="infoBtn"
                                size="sm"
                                onClick={() => handleClick(movie)}
                                color="info"
                              >
                                More Info
                              </Button>
                              <br />
                              <Button
                                className="deleteBtn"
                                outline
                                color="danger"
                                size="sm"
                                id={movie.id}
                                onClick={handleDelete}
                              >
                                Remove from Shelf
                              </Button>
                            </Media>
                          </Media>
                        </ListGroupItem>
                      </Row>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default LibraryTab;
