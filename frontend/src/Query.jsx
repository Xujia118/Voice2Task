import { Button } from "@mui/material";
import { useEffect } from "react";

function Query({ allSummaries, clientData, onFetchSummaryList }) {
  if (!allSummaries) {
    return <p>No records</p>;
  }

  useEffect(() => {
    console.log("client data:", clientData)
    onFetchSummaryList(clientData)
  }, []);

  return (
    <div>
      <Button variant="contained">View client history</Button>
      <ul>
        {allSummaries.map((listObj) => (
          <li>
            {listObj.summary_text}
            {listObj.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Query;
