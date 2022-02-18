import { combineReducers } from "redux";
import pokemonReducer from "./state/pokemon";
import { connectRouter } from "connected-react-router";

export default (history) => combineReducers({
	pokemon: pokemonReducer,
	router: connectRouter(history),
});
