import { saga as authSaga } from "@State/pokemon";
import { all, fork } from "redux-saga/effects";

function combineSagas(...sagas) {
	return function* combinedSagas() {
		yield all(sagas.map((saga) => fork(saga)));
	};
}

export default function createSaga() {
	return combineSagas(
		authSaga,
	);
}
