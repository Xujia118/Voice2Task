import { ACTIONS } from "./constants";

export const initialState = {
    tab: "conversation",
    
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.PICKUP_PHONE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
