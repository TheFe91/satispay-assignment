import { types as authTypes } from "./types";
import { actions as authActions } from "./actions";
import { selectors as authSelectors } from "./selectors";
import authSaga from "./saga";
import authReducer from "./reducer";

export const types = {
	...authTypes,
};

export const actions = {
	...authActions,
};

export const selectors = {
	...authSelectors,
};

export const saga = authSaga;

export default authReducer;
