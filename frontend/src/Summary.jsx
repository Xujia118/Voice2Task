import { Button } from "@mui/material";
import React from "react";

function Summary({ summary }) {
  return (
    <>
      <Button variant="contained">Confirm</Button>
      <div>{summary}</div>
    </>
  );
}

export default Summary;
