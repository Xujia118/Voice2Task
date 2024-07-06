import { useRef, useState } from "react";

import { ACTIONS } from "./constants";

import { PhoneDisabled, PhoneForwarded } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { storeAudioToS3 } from "./services";

const AudioRecorder = ({ fileName, summarizePhoneCall, dispatch }) => {
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

        // Trigger the entire summary logic
        summarizePhoneCall(recordedBlob, currentFileName.current);
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
