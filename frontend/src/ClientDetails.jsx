import { useState } from "react";

import { ACTIONS } from "./constants";

import { Button, Divider, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";

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
    console.log(localClientData);
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
        Placerholder
      </Typography>
      <Box height={250}>
        {error ? (
          <p>{error}</p>
        ) : (
          Object.values(clientData).map((item) => <li key={item}>{item}</li>)
        )}
      </Box>
      <Divider />
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
          <Button variant="contained" type="submit">
            Query
          </Button>
        </form>
      </Box>
    </>
  );
}

export default ClientDetails;
