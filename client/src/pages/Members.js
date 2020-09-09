import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./style.css";
import TMDbAPI from "../utils/TMDbAPI";
import useDebounce from "../utils/debounceHook";
import {useMovieContext} from "../utils/movieContext";
import Shelf from "../images/shelf.jpg";
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
  Media,
  Spinner
} from "reactstrap";



const MembersTab = () => {
  // Setting our component's initial state
const [movies, setMovies] = useState([]);
const [formObject, setFormObject] = useState({text: ""});
const [searchType, setSearchType] = useState("Title");
const [state, dispatch] = useMovieContext();
const history = useHistory();
const [loaded, setLoaded] = useState(false);

const debouncedSearchTerm = useDebounce(formObject, 600);
  // Load all movies and store them with setMovies
  useEffect( () => {
    console.log(formObject.text);
    if(!formObject.text){
      return;
    }
    if(debouncedSearchTerm){
      switch(searchType){
      case "Title":
        TMDbAPI.searchMoviesByTitle(formObject.text).then(res => {
          res = res.data.results;
        if(res!== undefined && res.length !== 0){
          res.forEach(element => {
            element.saved = false;
          });
          console.log(res);
          setMovies(res);
        }
      });
      break;
      case "Person":
        TMDbAPI.getPersonID(formObject.text).then(res => {
        if(res.data.results[0]){
          const id = res.data.results[0].id
          TMDbAPI.searchMoviesByPerson(id).then(res => {
            res = res.data.results;
        if(res!== undefined && res.length !== 0){
          res.forEach(element => {
            element.saved = false;
          });
          console.log(res);
          setMovies(res);
        }
          });
        }
      });
      break;
      case "Genre":
        TMDbAPI.getGenres().then(res => {
          if(getGenreID(formObject.text, res.data.genres)) {
          const genreID = getGenreID(formObject.text, res.data.genres);
          console.log(genreID);
          TMDbAPI.searchMoviesByGenre(genreID).then(res => {
            res = res.data.results;
        if(res!== undefined && res.length !== 0){
          res.forEach(element => {
            element.saved = false;
          });
          console.log(res);
          setMovies(res);
        }
          });
        }
      });
      break;
      default: break; 
    }
    }
  
  }, [debouncedSearchTerm, state, searchType]);

  useEffect( () => {
    new Promise((resolve, reject)  => {
      const jumboImg = new Image();
      jumboImg.src = Shelf;
      jumboImg.onload = () => {
      setLoaded(true);
      resolve();
    }
    jumboImg.onerror = reject();
    });

  },[])

  const searchClick = (event) => {
    event.preventDefault();
    console.log(event.target.value)
    switch(event.target.value){
      case "Title": 
        setSearchType("Title");
        break;
      case "Person": 
        setSearchType("Person");
        break;
      case "Genre":
        setSearchType("Genre");
        break;
      default: break;
    }

  }

  // Loads all movies and sets state to movies that match search
  async function getMovies(title) {
    try{
      let res = await TMDbAPI.searchMovies(title);
      console.log(res.data);
      return res.data.results;
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
  if(movie.id && movie.title){
  dispatch({
    type: MOVIE_ID,
    data: {
      title: movie.title, 
      movie_id: movie.id
    }
  })
  history.push("/movieDetail");
  }
}

const handleImg  = function(poster) {
  if (poster) {
    var imgString = "https://image.tmdb.org/t/p/w500/" + poster;
    return imgString;
  } else {
    return "https://i.imgur.com/FIxkRxV.png";
  }
}

const getGenreID = (searched, genres) => {
 const genreObj = genres.find(genre => {
  return genre.name.toLowerCase() === searched.trim().toLowerCase();
});
return genreObj.id;

}

    return (
      <div>
        {loaded ?
        <React.Fragment>
    <Jumbotron fluid className="homeJumbo">
        <h1 className="hdr">Movie Search</h1>
    </Jumbotron>
        
    
      <Container fluid>
        <Row>
          <Col className="searchBody" sm="6">
          <label className="label">Search by: </label>
          <Button className = "searchBtn" value = "Title" color = "primary" active onClick = {searchClick} >Title</Button>
          <Button className = "searchBtn" value = "Person" color="danger" onClick = {searchClick} >Person</Button>
          <Button className = "searchBtn" value = "Genre" color="info" onClick = {searchClick} >Genre</Button>
            <Form onSubmit = {event => {event.preventDefault()}}>
              <Input
                onChange={handleInputChange}
                name="text"
                placeholder= {searchType}
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
                    <ListGroupItem key={movie.id}>
                      {/* <img className="movie-img pr-2 poster" src={handleImg(movie.Poster)} />
                        <strong>
                          {movie.Title}
                        </strong>                     
                        <hr></hr>
                        <Button color="info">Movie Details</Button> */}
                      <Media>
                            <Media left href={handleImg(movie.poster_path)}>
                              <Media className="searchPoster"
                                object
                                src={handleImg(movie.poster_path)}
                                alt={movie.title}
                              />
                            </Media>
                            <Media body className="movieBody">
                              <Media heading><strong>{movie.title}</strong></Media>
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
              <Row className="justify-content-center">
                <h3 className="label pt-3">No Results to Display</h3>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
      </React.Fragment>
       : <Row className = "justify-content-center">
        <br/>
        <h1 className = "m-5 p-5">Loading...<Spinner  /></h1>
        </Row>}
      </div>
      
    );
  }



export default MembersTab;