import { Box, Button, Divider, TextField } from "@mui/material";
import { useState } from "react";

const clientDetails = ["name", "phone"];

function Summary({
  summary,
  clientData,
  onFetchCreateClient,
  onFetchStoreSummary,
}) {
  const [localClientData, setLocalClientData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // onFetchStoreSummary() will handle both finding an existing client or creating a new client
    // All it needs is {clientName, clientPhone}, so here we just need to send clientName and clientPhone.
    // If a query has been launched and the client is found, clientData state will contain its info
    const clientName = clientData.name;
    const clientPhone = clientData.phone;
    if (clientName && clientPhone) {
      onFetchStoreSummary({
        clientName,
        clientPhone,
        summary_text: summary,
        url: "URLPlacerholder",
      });
      return;
    }

    // Otherwise, clientData is {}. We use localClientData here.
    const updatedLocalClientData = {
      ...localClientData,
      summary_text: summary,
      url: "URLPlaceholder",
    };

    onFetchStoreSummary(updatedLocalClientData);

    // All this is to save the caller some time and effort.
    // TODO: Add validation
  };

  return (
    <>
      <form onClick={handleSubmit}>
        {clientDetails.map((detail) => (
          <TextField
            key={detail}
            id="standard-basic"
            placeholder={`Client ${detail}`}
            variant="standard"
            name={detail}
            value={clientData[detail]}
            onChange={handleChange}
          />
        ))}
        <Button variant="contained" type="submit">
          save
        </Button>
      </form>
      <Box>
        <p>placeholder: {summary}</p>
      </Box>
    </>
  );
}

export default Summary;
