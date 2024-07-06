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
  fetchTranscriptionStatus,
  storeAudioToS3,
  transcribeAudioToText,
} from "./services";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const summarizePhoneCall = async (blob, fileName) => {
    try {
      const uploadAudioMessage = await isAudioUploaded(blob, fileName);

      if (uploadAudioMessage === "Audio uploaded successfully.") {
        await isTranscriptionComplete(fileName);
      }

      const data = await fetchSummary(fileName);
      console.log("summary received:", data);
      dispatch({ type: ACTIONS.SUMMARIZE, payload: data.summary });
    } catch (err) {
      console.error(err);
    }
  };

  const isAudioUploaded = async (blob, file) => {
    try {
      const data = await storeAudioToS3(blob, file);
      dispatch({ type: ACTIONS.LOADING_STATUS, payload: data.message });
      return data.message;
    } catch (err) {
      console.log(err);
    }
  };

  const isTranscriptionComplete = async (
    fileName,
    maxAttempts = 10,
    delay = 10000
  ) => {
    let jobName;

    // Start transcription
    try {
      const data = await transcribeAudioToText(fileName);
      jobName = data.jobName;
      dispatch({ type: ACTIONS.LOADING_STATUS, payload: data.message });
    } catch (err) {
      console.log(err);
      dispatch({ type: ACTIONS.REPORT_ERROR, payload: err?.error });
    }

    // Get transcription status
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const transcriptionStatus = await fetchTranscriptionStatus(jobName);

        if (transcriptionStatus.status === "COMPLETED") {
          return true;
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        console.error(
          `Transcription status check attempt ${attempt + 1} failed:`,
          err
        );
        if (attempt === maxAttempts - 1) throw error;
      }
    }
    throw new Error("Transcription timed out");
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
