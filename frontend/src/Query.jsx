import React from "react";
import { Button } from "@mui/material";

function Query({ allSummaries }) {
  if (!allSummaries) {
    return <p>No summaries</p>;
  }

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
