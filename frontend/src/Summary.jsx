import { Button } from "@mui/material";

function Summary({ summary, onFetchClientData }) {
  const handleConfirm = async () => {
    onFetchClientData(summary); // Might need to write a separate api to insert summary
  };

  return (
    <>
      <Button variant="contained" onClick={handleConfirm}>
        Confirm
      </Button>
      <div>{summary}</div>
    </>
  );
}

export default Summary;
