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
      <ul>
        {allSummaries.map((listObj) => (
          <li key={listObj.summary_text}>
            {listObj.summary_text}
            {listObj.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Query;
