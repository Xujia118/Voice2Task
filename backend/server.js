import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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

// Test POSTMAN
app.get("/", (req, res) => {
  res.send({ message: "Success" });
});

// API to store audio file to S3 bucket
const fileKey = "foo.csv";

const getS3Object = async (params) => {
  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const fileContent = await streamToString(data.Body);
    console.log(fileContent);
  } catch (err) {
    console.error(err);
  }
};

const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

getS3Object({ Bucket: bucketName, Key: fileKey });

// Send a job from S3 to Transcribe and return the job to the original bucket
app.post("/start-transcription", async (req, res) => {
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
