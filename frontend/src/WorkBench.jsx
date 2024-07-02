import * as React from "react";
import { useState } from "react";
import ClientDetails from "./ClientDetails";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Conversation from "./Conversation";
import Summary from "./Summary";
import Query from "./Query";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function WorkBench({
  tab,
  switchTab,
  fileName,
  summarizePhoneCall,
  summary,
  allSummaries,
  dispatch,
  clientData,
  onFetchClientData,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <main>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}>
          <ClientDetails
            sx={{ flex: 1 }}
            dispatch={dispatch}
            clientData={clientData}
            onFetchClientData={onFetchClientData}
          />
        </Box>
        <Box sx={{ flex: 3 }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="conversation" {...a11yProps(0)} />
                <Tab label="summary" {...a11yProps(1)} />
                <Tab label="logs" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Conversation
                dispatch={dispatch}
                tab={tab}
                fileName={fileName}
                summarizePhoneCall={summarizePhoneCall}
                switchTab={switchTab}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Summary summary={summary} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Query allSummaries={allSummaries} />
            </CustomTabPanel>
          </Box>
        </Box>
      </Box>
    </main>
  );
}

export default WorkBench;
