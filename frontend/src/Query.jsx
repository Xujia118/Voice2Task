import { Button } from "@mui/material";
import { useEffect } from "react";

function Query({ allSummaries, clientData, onFetchClientData }) {
  if (!allSummaries) {
    return <p>No records</p>;
  }

  // Every time this tab is loaded, update client state to get summary list
  useEffect(() => {
    onFetchClientData(clientData);
  }, []);

  return (
    <div>
      <Button variant="contained">View client history</Button>
      <ul>
        {allSummaries.map((summary) => (
          <li>{summary}</li>
        ))}
      </ul>
    </div>
  );
}

export default Query;
