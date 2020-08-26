import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import classnames from "classnames";
import SqlAPI from "../utils/SQL-API";
import "./library.css";

const LibraryTab = () => {
  var moviesArray = [];
  const [activeTab, setActiveTab] = useState("All");
  const [movieList, setMovieList] = useState(moviesArray);

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

  const handleDelete = function(id, e) {
    // e.preventDefault();
    // SqlAPI.deleteMovie(id)
    // moviesArray.splice(moviesArray.findIndex(element => element.id === id), 1);
  }

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
                <Col className="header" sm="12">
                  <h4>Your Library</h4>
                </Col>
              </Row>
              <Row>
                <Col >
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>{movie.title}</Media>
                              {movie.synopsis}
                              <br />
                              <Button className="deleteBtn" outline color="danger" size="sm" onClick={handleDelete(movie.id)}>Remove from Shelf</Button>
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
                <Col className="header" sm="12">
                  <h4>Your DVDs</h4>
                </Col>
              </Row>
              <Row>
                <Col >
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>{movie.title}</Media>
                              {movie.synopsis}
                              <br />
                              <Button className="deleteBtn" outline color="danger" size="sm" onClick={handleDelete(movie.id)}>Remove from Shelf</Button>
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
                <Col className="header" sm="12">
                  <h4>Your Blu-Rays</h4>
                </Col>
              </Row>
              <Row>
                <Col >
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>{movie.title}</Media>
                              {movie.synopsis}
                              <br />
                              <Button className="deleteBtn" outline color="danger" size="sm" onClick={handleDelete(movie.id)}>Remove from Shelf</Button>
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
                <Col className="header" sm="12">
                  <h4>Your VOD Purchases</h4>
                </Col>
              </Row>
              <Row>
                <Col >
                  <ListGroup>
                    {movieList.map((movie) => (
                      <Row>
                        <ListGroupItem className="movieItem" key={movie.id}>
                          <Media>
                            <Media left href={movie.poster}>
                              <Media className="poster"
                                object
                                src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading>{movie.title}</Media>
                              {movie.synopsis}
                              <br />
                              <Button className="deleteBtn" outline color="danger" size="sm" onClick={handleDelete(movie.id)}>Remove from Shelf</Button>
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