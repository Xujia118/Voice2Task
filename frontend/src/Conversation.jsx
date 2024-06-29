import React from "react";
import AudioRecorder from "./AudioRecorder";

import Box from "@mui/material/Box";

function Conversation({ tab, summarizePhoneCall, switchTab }) {
  return (
    <div>
      <Box sx={{ width: "100%", height: 400 }} bgcolor={"skyblue"}>
        Placeholder for real-time analysis
      </Box>
      <AudioRecorder
        tab={tab}
        summarizePhoneCall={summarizePhoneCall}
        switchTab={switchTab}
      />
    </div>
  );
}

export default Conversation;
