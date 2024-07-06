import { useReducer } from "react";

import { initialState, reducer } from "./reducer";
import { ACTIONS } from "./constants";

import WorkBench from "./WorkBench";
import Header from "./Header";

import {
  fetchCreateClient,
  fetchGetClient,
  fetchGetSummaryList,
  fetchStoreSummary,
  fetchSummary,
  storeAudioToS3,
  transcribeAudioToText,
} from "./services";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const switchTab = (value) => {
    dispatch({ type: "SET_TAB", payload: value });
  };

  const summarizePhoneCall = async (fileName) => {
    try {
      await isTranscriptionComplete(fileName);

      // Wait three seconds to process summary
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const data = await fetchSummary(fileName);

      console.log("summary received:", data);

      dispatch({ type: ACTIONS.SUMMARIZE, payload: data.summary });
    } catch (err) {
      console.error(err);
    }
  };

  // All service call take some time, so give retries with delay
  const isAudioIsUploaded = async (fileName, maxAttempts = 2, delay = 2000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const testpromise = await storeAudioToS3(fileName);

        console.log("test promise:", testpromise);

        console.log("attempts:", attempt);
        return true;
      } catch (error) {
        console.error(`Attempt to upload ${attempt + 1} failed:`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  };

  const isTranscriptionComplete = async (
    fileName,
    maxAttempts = 6,
    delay = 10000
  ) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await transcribeAudioToText(fileName);
        return true;
      } catch (error) {
        console.error(`Attempt to trancribe ${attempt + 1} failed:`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  };

  const onFetchGetClient = async (clientObj) => {
    try {
      const data = await fetchGetClient(clientObj);
      if (!data.clientData) {
        dispatch({ type: ACTIONS.REPORT_ERROR, payload: data.message });
      } else {
        dispatch({ type: ACTIONS.FETCH_CLIENT_DATA, payload: data.clientData });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: ACTIONS.REPORT_ERROR, payload: err?.error });
    }
  };

  const onFetchCreateClient = async (clientObj) => {
    try {
      const data = await fetchCreateClient(clientObj);
      dispatch({ type: ACTIONS.CREATE_CLIENT, payload: data.client_id });
    } catch (err) {
      console.log(err);
    }
  };

  const onFetchStoreSummary = async (clientObj) => {
    try {
      const data = await fetchStoreSummary(clientObj);
      console.log("data:", data);
      dispatch({ type: ACTIONS.STORE_SUMMARY, payload: data.message });
    } catch (err) {
      console.log(err);
    }
  };

  const onFetchSummaryList = async (clientObj) => {
    try {
      const data = await fetchGetSummaryList(clientObj);
      dispatch({ type: ACTIONS.FETCH_SUMMARY_LIST, payload: data.summaryList });
    } catch (err) {
      console.log(err);
      // dispatch({ type: ACTIONS.FETCH_SUMMARY_LIST, payload: data.summaryList });
      dispatch({ type: ACTIONS.REPORT_ERROR, payload: err?.error });
    }
  };

  return (
    <>
      <Header />
      <WorkBench
        dispatch={dispatch}
        tab={state.tab}
        switchTab={switchTab}
        fileName={state.fileName}
        summarizePhoneCall={summarizePhoneCall}
        summary={state.newSummary}
        onFetchGetClient={onFetchGetClient}
        onFetchCreateClient={onFetchCreateClient}
        onFetchStoreSummary={onFetchStoreSummary}
        onFetchSummaryList={onFetchSummaryList}
        clientData={state.clientData}
        allSummaries={state.allSummaries}
        error={state.error}
      />
    </>
  );
}

export default App;
