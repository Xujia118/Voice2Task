import React from "react";
import AudioRecorder from "./AudioRecorder";

import Box from "@mui/material/Box";

import { List, ListItem, ListItemText } from "@mui/material";

const listItems = [
  "Verify first name, last name",
  "Verify phone and email",
  "Verify date and time",
  "Verify any quantity",
];

function Conversation({
  tab,
  fileName,
  summarizePhoneCall,
  switchTab,
  dispatch,
}) {
  return (
    <div>
      <Box sx={{ width: "100%", height: 400 }}>
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText>{item}</ListItemText>
            </ListItem>
          ))}
        </List>
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
