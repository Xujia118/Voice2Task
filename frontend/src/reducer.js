import { TABS, ACTIONS } from "./constants";

export const initialState = {
  //   tab: TABS.CONVERSATION,
  tab: 0,
  fileName: "",
  loading_summary: false,
  summary: "",
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TAB:
      return {
        ...state,
        tab: action.payload,
      };
     
    case ACTIONS.SET_FILE_NAME: 
      return {
        ...state,
        fileName: action.payload,
      }

    case ACTIONS.PICKUP_PHONE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
