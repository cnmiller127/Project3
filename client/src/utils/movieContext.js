import React, {createContext, useContext, useReducer} from "react";
import {MOVIE_ID} from "./actions";

const MovieContext = createContext();
const {Provider} = MovieContext;

const reducer = (state, action) => {
    switch(action.type){
        case MOVIE_ID:
            return {
                ...state,
                title: action.data.title,
                movie_id: action.data.movie_id
            }
        default:
            return state;
    }
}

const MovieProvider = ({value, ...props}) => {
    const initialState = value || {
        title: "",
        movie_id: ""
    };
    const [movieState, movieDispatch] = useReducer(reducer, initialState);
    return <Provider value={[movieState, movieDispatch]} {...props} />
}

const useMovieContext = () => {
    return useContext(MovieContext);
}

export {MovieProvider, useMovieContext};