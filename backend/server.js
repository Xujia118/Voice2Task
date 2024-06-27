import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

const app = express();
const port = 3000;

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const transcribeClient = new TranscribeClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

app.use(bodyParser.json());

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Store audio file to S3 bucket
app.post("/api/store-audio-file", upload.single("audioFile"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file.");
  }
});

// Send a job from S3 to Transcribe and return the job to the original bucket
app.post("/api/transcribe-audio-file", async (req, res) => {
  const { audioFileName } = req.body;
  const audioFileUri = `s3://${process.env.S3_BUCKET_NAME}/${audioFileName}`;

  const transcribeParams = {
    TranscriptionJobName: `TranscriptionJob-${Date.now()}`,
    LanguageCode: "en-US",
    Media: {
      MediaFileUri: audioFileUri,
    },
    OutputBucketName: process.env.S3_BUCKET_NAME,
  };

  try {
    const command = new StartTranscriptionJobCommand(transcribeParams);
    const data = await transcribeClient.send(command);
    console.log(data);
    res
      .status(200)
      .send(
        `Transcription job started with name: ${data.TranscriptionJob.TranscriptionJobName}`
      );
  } catch (err) {
    console.log(err, err.stack);
    res.status(500).send("Error starting transcription job.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
