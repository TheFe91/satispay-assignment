import produce from "immer";
import { types as TYPES } from "./types";

const initialState = {

};

export default (state = initialState, { type, payload }) => produce(state, (draft) => {
	switch (type) {

	default: {
		break;
	}
	}
});
