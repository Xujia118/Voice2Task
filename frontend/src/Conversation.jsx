import React from "react";
import AudioRecorder from "./AudioRecorder";

import Box from "@mui/material/Box";

function Conversation() {
  return (
    <div>
      <Box sx={{ width: "100%", height: 400 }} bgcolor={"skyblue"}>
        Placeholder for real-time analysis
      </Box>
      <AudioRecorder />
    </div>
  );
}

export default Conversation;
