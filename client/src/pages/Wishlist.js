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
// import "./library.css";

const WishlistTab = () => {
  const [activeTab, setActiveTab] = useState("All");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  var moviesArray = [];

  useEffect(() => {
    retrieveMovies(activeTab);
  }, [activeTab]);

  const retrieveMovies = async (tab) => {
    try {
      switch (tab) {
        case "All":
          moviesArray = [];
          const movieObject = await SqlAPI.getWishList();
          movieObject.forEach((movie) => moviesArray.push(movie));
          break;
        default:
          break;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div>
      <Jumbotron fluid className="jumbotronWishlist">
        <Container fluid>
          <h1 className="display-3">Your Shelf</h1>
        </Container>
      </Jumbotron>

      <Row>
        <Col className="WishlistTabs" sm="8">
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
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="All">
              <Row>
                <Col className="header" sm="12">
                  <h4>Your Wishlist</h4>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <ListGroup>
                    {moviesArray.map((movie) => (
                      <Row>
                        <ListGroupItem key={movie.id}>
                          <Media>
                            <Media left>
                              <Media
                                object
                                data-src={movie.poster}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body>
                              <Media heading>{movie.title}</Media>
                              {movie.synopsis}
                              <Button outline color="danger" size="sm">Remove from Shelf</Button>
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



app.get("/api/movies/:format", function(req, res) {
    const uid = req.session.passport.user.id;
    const format = req.params.format;
    try{
        const dbMovie = await db.Movie.findAll({where: {userId: uid, format: wishlist }}, {include: db.User});
        res.json(dbMovie);
    }
    catch(err){
        res.status(500).end();
        console.log(err)
    }
})

export default WishlistTab;