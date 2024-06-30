import React from "react";
import AudioRecorder from "./AudioRecorder";

import Box from "@mui/material/Box";

function Conversation({ tab, fileName, summarizePhoneCall, switchTab, dispatch }) {
  return (
    <div>
      <Box sx={{ width: "100%", height: 400 }} bgcolor={"skyblue"}>
        Placeholder for real-time analysis
      </Box>
      <AudioRecorder
        dispatch={dispatch}
        tab={tab}
        fileName={fileName}
        summarizePhoneCall={summarizePhoneCall}
        switchTab={switchTab}
      />
    </div>
  );
}

export default Conversation;
