import { useRef, useState } from "react";

import { ACTIONS } from "./constants";

import { PhoneDisabled, PhoneForwarded } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { storeAudioToS3 } from "./services";

const AudioRecorder = ({ tab, fileName, summarizePhoneCall, switchTab, dispatch }) => {
  const currentFileName = useRef(fileName);
  
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      // const newFileName = `phone-audio-${Date.now()}.mp3`;
      const newFileName = 'phone-audio.mp3';
      currentFileName.current = newFileName;
      dispatch({ type: ACTIONS.SET_FILE_NAME, payload: newFileName });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/mp3" });

        // Extract metadata
        const durationInSeconds = Math.ceil(
          chunks.current.reduce((acc, chunk) => acc + chunk.duration, 0)
        );
        recordedBlob.duration = durationInSeconds;

        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];

        // Upload recorded audio to backend and then to S3
        uploadToS3(recordedBlob, currentFileName.current);
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Trigger the entire summary logic and set the tab to summary
    summarizePhoneCall(currentFileName.current);
    
    // TODO: switch tab 
    switchTab(1)
  };

  const uploadToS3 = async (blob, newFileName) => {
    try {
      const formData = new FormData();
      formData.append("audioFile", blob, newFileName);

      const response = await fetch(
        "http://localhost:3000/api/store-audio-file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully to backend.");
        // Optionally handle response from backend if needed
      } else {
        console.error("Failed to upload file to backend:", response.statusText);
        // Handle error scenario
      }
    } catch (error) {
      console.error("Error uploading file to backend:", error);
      // Handle network or other errors
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <audio controls src={recordedUrl} />
      <Stack direction={"row"} spacing={2}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "red" }}
          onClick={stopRecording}
        >
          <PhoneDisabled />
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "green" }}
          onClick={startRecording}
        >
          <PhoneForwarded />
        </Button>
      </Stack>
    </Box>
  );
};

export default AudioRecorder;
