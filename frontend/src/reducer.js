import { ACTIONS } from "./constants";

export const initialState = {
  tab: 0,
  fileName: "",
  loading_summary: false,
  newSummary: "",
  clientData: {},
  allSummaries: [], 
  error: "",
};

export function reducer(state, action) {
  switch (action.type) {
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

    // get client
    case ACTIONS.FETCH_CLIENT_DATA:
      return {
        ...state,
        clientData: action.payload,
      };

    // create client
    case ACTIONS.CREATE_CLIENT:
      return {
        ...state,

      }

    // store summary
    case ACTIONS.STORE_SUMMARY:
      return {
        ...state,

      }

    case ACTIONS.FETCH_SUMMARY_LIST:
      return {
        ...state,
        allSummaries: action.payload
      }

    default:
      return state;
  }
}
