import { useEffect } from "react";

function Query({ allSummaries, clientData, onFetchSummaryList, error }) {
  useEffect(() => {
    onFetchSummaryList(clientData)
    console.log(allSummaries)
  }, []);

  if (allSummaries.length === 0) {
    return <p>{error}</p>
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
