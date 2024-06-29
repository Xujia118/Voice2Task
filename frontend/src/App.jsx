import React, { useReducer } from "react";

import { initialState, reducer } from "./reducer";

import WorkBench from "./WorkBench";
import Header from "./Header";

import "./App.css";
import { TABS, ACTIONS } from "./constants";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const switchTab = (value) => {
    dispatch({ type: "SET_TAB", payload: value });
  };

  const summarizePhoneCall = () => {};

  return (
    <>
      <Header />
      <WorkBench
        tab={state.tab}
        summarizePhoneCall={summarizePhoneCall}
        switchTab={switchTab}
      />
    </>
  );
}

export default App;
