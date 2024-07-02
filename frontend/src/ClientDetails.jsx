import { useState } from "react";

import { Button, Divider, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const clientDetails = ["Name", "Phone", "Email", "Address"];

function ClientDetails() {
  const [clientData, setClientData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // send the client data object to backend for query
    console.log(clientData);

    // Clear form at submit
    setClientData({
      Name: "",
      Phone: "",
      Email: "",
      Address: "",
    });
  };

  return (
    <>
      <Typography variant="h6" p={1} sx={{ textAlign: "center" }}>
        Placerholder
      </Typography>
      <Box height={250}>Client info display placeholder</Box>
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
                value={clientData[detail]}
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
