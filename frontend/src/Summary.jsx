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
    // const { name, value } = e.target;
    // setLocalClientData({
    //   ...localClientData,
    //   [name]: value,
    // });
    setLocalClientData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      onFetchStoreSummary({ clientName, clientPhone });
      return;
    }

    // Otherwise, clientData is {}. We use localClientData here.
    console.log(localClientData)
    onFetchStoreSummary(localClientData);

    // All this is to save the caller some time and effort.
    // TODO: Add validation
  };

  return (
    <>
      <form>
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
        <Button variant="contained" onClick={handleSubmit}>
          save
        </Button>
      </form>
      <Box>
        <p>{summary}</p>
      </Box>
    </>
  );
}

export default Summary;
