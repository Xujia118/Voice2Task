import React, { useReducer } from "react";

import { initialState, reducer } from "./reducer";
import { TABS, ACTIONS } from "./constants";

import WorkBench from "./WorkBench";
import Header from "./Header";

import {
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
      console.log('file name at app.jsx', fileName)

      await isAudioIsUploaded(fileName);
      await isTranscriptionComplete(fileName);
      const summaryData = await fetchSummary(fileName);
      dispatch({ type: ACTIONS.SUMMARIZE, payload: summaryData.summary });
    } catch (err) {
      console.error(err);
    }
  };

  // All service call take some time, so give retries with delay
  const isAudioIsUploaded = async (
    fileName,
    maxAttempts = 3,
    delay = 2000
  ) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await storeAudioToS3(fileName);
        console.log("attempts:", attempt)
        return true;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  };

  const isTranscriptionComplete = async (
    fileName,
    maxAttempts = 2,
    delay = 5000
  ) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await transcribeAudioToText(fileName);
        return true;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return false;
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
        summary={state.summary}
      />
    </>
  );
}

export default App;
