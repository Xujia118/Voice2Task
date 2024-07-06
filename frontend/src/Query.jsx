import { useEffect } from "react";

function Query({ allSummaries, clientData, onFetchSummaryList, error }) {
  useEffect(() => {
    onFetchSummaryList(clientData)
    console.log(allSummaries)
  }, []);

  if (error) {
    return <p>{error}</p>
  }

  if (allSummaries.length === 0) {
    return <p>This client has no summary yet.</p>
  }

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
