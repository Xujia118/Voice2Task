import { useState } from "react";

import { ACTIONS } from "./constants";

import {
  Button,
  Divider,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Margin } from "@mui/icons-material";

const clientDetails = ["name", "phone"];

function ClientDetails({
  dispatch,
  clientData,
  onFetchGetClient,
  onFetchSummaryList,
  error,
}) {
  const [localClientData, setLocalClientData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalClientData({
      ...localClientData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // send the client data object to backend for query
    onFetchGetClient(localClientData);
    onFetchSummaryList(localClientData);

    // Clear form at submit
    setLocalClientData({
      name: "",
      phone: "",
    });
  };

  return (
    <>
      <Typography variant="h6" p={1} sx={{ textAlign: "center" }}>
        Query Client
      </Typography>
      <Box height={250}>
        {error ? (
          <p style={{ marginLeft: "1rem" }}>{error}</p>
        ) : (
          Object.entries(clientData).map(([label, item]) => (
            <ListItem key={label}>
              <ListItemText primary={`${label}: ${item}`} />
            </ListItem>
          ))
        )}
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          {clientDetails.map((detail) => (
            <Box
              mb={2}
              pl={2}
              pr={2}
              sx={{ display: "flex", flexDirection: "column" }}
              key={detail}
            >
              <TextField
                type="text"
                name={detail}
                id={detail}
                label={detail}
                value={localClientData[detail]}
                onChange={handleChange}
              ></TextField>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" type="submit">
              Query
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default ClientDetails;
