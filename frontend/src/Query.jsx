import { useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

function Query({ allSummaries, clientData, onFetchSummaryList, error }) {
  useEffect(() => {
    onFetchSummaryList(clientData);
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (allSummaries.length === 0) {
    return <p>This client has no summary yet.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  return (
    <List>
      {allSummaries
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((listObj, index) => {
          const formattedDate = formatDate(listObj.created_at);
          return (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <Typography variant="body1">{formattedDate}</Typography>
                }
                secondary={
                  <Typography variant="body1">
                    {listObj.summary_text}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
    </List>
  );
}

export default Query;
