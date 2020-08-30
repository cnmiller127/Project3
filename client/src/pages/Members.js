import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./style.css";
import Shelf from "../images/shelf.jpg";
import OMDbAPI from "../utils/OMDbAPI";
import useDebounce from "../utils/debounceHook";
import {useMovieContext} from "../utils/movieContext";
import {MOVIE_ID} from "../utils/actions";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Jumbotron, 
  Container,
  Media
} from "reactstrap";



const MembersTab = () => {
  // Setting our component's initial state
const [movies, setMovies] = useState([]);
const [formObject, setFormObject] = useState({title: ""});
const [state, dispatch] = useMovieContext();
const history = useHistory();

const debouncedSearchTerm = useDebounce(formObject, 800);
  // Load all movies and store them with setMovies
  useEffect( () => {
    console.log(state);
    if(!formObject.title){
      return;
    }
    if(debouncedSearchTerm){
      getMovies(formObject.title).then(res => {
        if(res!== undefined && res.length !== 0){
          res.forEach(element => {
            element.saved = false;
          });
          console.log(res);
          setMovies(res);
        }
      })
    }
  }, [debouncedSearchTerm, state]);

  // Loads all movies and sets state to movies that match search
  async function getMovies(title) {
    try{
      let res = await OMDbAPI.searchMovies(title);
      console.log(res.data);
      return res.data.Search;
    }
    catch(err){
        throw err;
    }
  }

function handleInputChange(event) {
  //console.log(event.target.value)
  const { name, value } = event.target;
  setFormObject({...formObject, [name]: value})
  console.log(formObject);
};

const handleClick = (movie) => {
  if(movie.imdbID && movie.Title){
  dispatch({
    type: MOVIE_ID,
    data: {
      Title: movie.Title, 
      imdbID: movie.imdbID
    }
  })
  history.push("/movieDetail");
  }
}

const handleImg  = function(string) {
  if (string !== "N/A") {
    return string;
  } else {
    return "https://bit.ly/3hxWg5k";
  }
}

    return (
      <div>
    <Jumbotron fluid className="homeJumbo">
        <h1 className="display-3">Movie Search</h1>
    </Jumbotron>
        
    
      <Container fluid>
        <Row>
          <Col className="searchBody" sm="6">
          
           
            <label className="label">Search by title: </label>
            <Form onSubmit = {event => {event.preventDefault()}}>
              <Input
                onChange={handleInputChange}
                name="title"
                placeholder="Title"
              />
            </Form>
            </Col>
          </Row>
          
          <Row>
          <Col className="searchBody" sm="10">
            {movies.length ? (
              <div>
              <label className="label">Click "More Info" to view details and save the respecitive movie to your movie shelf!</label>
              
              <ListGroup>
                {movies.map(movie => {
                  return (
                    <ListGroupItem key={movie.imdbID}>
                      {/* <img className="movie-img pr-2 poster" src={handleImg(movie.Poster)} />
                        <strong>
                          {movie.Title}
                        </strong>                     
                        <hr></hr>
                        <Button color="info">Movie Details</Button> */}
                      <Media>
                            <Media left href={handleImg(movie.Poster)}>
                              <Media className="searchPoster"
                                object
                                src={handleImg(movie.Poster)}
                                alt={movie.Title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading><strong>{movie.Title}</strong></Media>
                              <br />
                              <Button onClick={() => handleClick(movie)} color="info">More Info</Button>
                            </Media>
                          </Media>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
              </div>
            ) : (
              <h3 className="label">No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
      </div>
      
    );
  }



export default MembersTab;