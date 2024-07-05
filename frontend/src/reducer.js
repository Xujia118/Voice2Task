import { ACTIONS } from "./constants";

export const initialState = {
  tab: 0,
  fileName: "",
  loading_summary: false,
  newSummary: "",
  clientData: {},
  allSummaries: [], // singleit out although it's part of clientData obj as client data obj might change
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
      };

    case ACTIONS.PICKUP_PHONE:
      return {
        ...state,
      };

    case ACTIONS.SUMMARIZE:
      return {
        ...state,
        newSummary: action.payload,
      };

    case ACTIONS.FETCH_CLIENT_DATA:
      return {
        ...state,
        clientData: action.payload,
      };

    case ACTIONS.FETCH_SUMMARY_LIST:
      return {
        ...state,
        allSummaries: action.payload
      }

    default:
      return state;
  }
}
