import { Box, Button, Divider, TextField } from "@mui/material";

function Summary({
  summary,
  clientData,
  onFetchCreateClient,
  onFetchStoreSummary,
}) {
  const handleSave = async () => {
    console.log("client data:", clientData);

    // If a query has been launched, clientData state will contain its info
    // We can directly save

    // Otherwise, user can enter client name and phone here
    // We can combine query + save

    // If the client does not exist, prompt the user to create a new client first
    // Then save the summary
  };

  return (
    <>
      <form>
        <TextField
          id="standard-basic"
          label="Client Name"
          // variant="standard"
          value={clientData.name}
        />
        <TextField
          id="standard-basic"
          label="Client Phone"
          // variant="standard"
          value={clientData.phone}
        />
        <Button variant="contained" onClick={handleSave}>
          save
        </Button>
      </form>
      <Box>
        <p>{summary}</p>
      </Box>
      <div>{summary}</div>
    </>
  );
}

export default Summary;
