import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import createReducer from "./reducer";
import createSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

const history = createBrowserHistory();

function configureStore() {
	// Middlewares
	const middlewares = [
		sagaMiddleware,
		routerMiddleware(history),
	];

	// Enhancers
	const enhancers = [
		applyMiddleware(...middlewares),
	];

	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	const composeEnhancers = process.env.NODE_ENV !== "production"
	&& typeof window === "object"
	&& window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
			// Prevent recomputing reducers for `replaceReducer`
			actionsBlacklist: "IGNORE_",
			shouldHotReload: false,
		})
		: compose;
	/* eslint-enable */

	// Store

	const store = createStore(
		createReducer(history),
		{},
		composeEnhancers(...enhancers),
	);

	// Extensions
	store.runSaga = sagaMiddleware.run;

	// Make reducers hot reloadable, see http://mxs.is/googmo
	if (module.hot) {
		module.hot.accept("./reducer", () => {
			store.replaceReducer(createReducer(history));
		});
	}

	return store;
}

const store = configureStore(history);
store.runSaga(createSaga());

export { store, history };
