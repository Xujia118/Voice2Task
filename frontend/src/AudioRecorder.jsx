import { useRef, useState } from "react";

const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
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
        uploadToS3(recordedBlob);
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

  const uploadToS3 = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("audioFile", blob, "recorded-audio.mp3");

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
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default AudioRecorder;
