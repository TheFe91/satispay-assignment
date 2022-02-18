import React from "react";
import "@Src/config/firebase";
import { ConnectedRouter } from "connected-react-router";
import { history } from "@Src/store/configureStore";
import { Route, Switch } from "react-router-dom";

const App = () => {
	return (
		<ConnectedRouter history={history}>
			<Switch>
				<Route
					component={Home}
					exact
					path="/"
				/>

				<Route
					component={Authenticated}
					exact
					path="/authenticated"
				/>

				<Route
					component={NotFound}
				/>
			</Switch>
		</ConnectedRouter>
	);
};

export default React.memo(App);
