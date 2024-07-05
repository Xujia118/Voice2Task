import { Button } from "@mui/material";
import { useEffect } from "react";

function Query({ allSummaries, clientData, onFetchSummaryList }) {
  if (!allSummaries) {
    return <p>No records</p>;
  }

  useEffect(() => {
    onFetchSummaryList(clientData)
  }, []);

  return (
    <div>
      <Button variant="contained">View client history</Button>
      <ul>
        {allSummaries.map((listObj) => (
          <li key={listObj.created_at}>
            {listObj.summary_text}
            {listObj.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Query;
