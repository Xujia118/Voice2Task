import { useReducer } from "react";

import { initialState, reducer } from "./reducer";
import { ACTIONS } from "./constants";

import WorkBench from "./WorkBench";
import Header from "./Header";

import {
  fetchGetClient,
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
      await new Promise(resolve => setTimeout(resolve, 3000));

      const summaryData = await fetchSummary(fileName);
      dispatch({ type: ACTIONS.SUMMARIZE, payload: summaryData.summary });
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
      dispatch({ type: ACTIONS.FETCH_CLIENT_DATA, payload: data.clientData });
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header />
      <WorkBench
        dispatch={dispatch}
        tab={state.tab}
        switchTab={switchTab}
        fileName={state.fileName}
        summarizePhoneCall={summarizePhoneCall}
        summary={state.newSmmary}
        
        onFetchGetClient={onFetchGetClient}
        
        clientData={state.clientData}

        allSummaries={state.allSummaries}
      />
    </>
  );
}

export default App;
