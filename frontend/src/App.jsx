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

  const summarizePhoneCall = async (fileName) => {
    try {
      await isTranscriptionComplete(fileName);
      // await isAudioUploaded(fileName)

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
  const isAudioUploaded = async (blob, file) => {
    try {
      const data = await storeAudioToS3(blob, file);
      dispatch({ type: ACTIONS.LOADING_STATUS, payload: data.message });
    } catch (err) {
      console.log(err);
    }
  };

  const isTranscriptionComplete = async (
    fileName,
    maxAttempts = 10,
    delay = 10000
  ) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const data = await transcribeAudioToText(fileName);
        dispatch({ type: ACTIONS.LOADING_STATUS, payload: data.message });
      } catch (error) {
        console.error(`Attempt to trancribe ${attempt + 1} failed:`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };

  const onFetchGetClient = async (clientObj) => {
    try {
      const data = await fetchGetClient(clientObj);
      dispatch({ type: ACTIONS.FETCH_CLIENT_DATA, payload: data.clientData });
    } catch (err) {
      dispatch({ type: ACTIONS.CLEAR_CLIENT_DATA });
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
      dispatch({ type: ACTIONS.REPORT_ERROR, payload: err?.error });
    }
  };

  return (
    <>
      <Header />
      <WorkBench
        dispatch={dispatch}
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
