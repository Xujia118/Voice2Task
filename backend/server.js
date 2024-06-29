import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

// AWS imports
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

// Anthropic import
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const port = 3000;
app.use(express.json());

// AWS API key
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

// Anthropic API key
const anthropicAcessKey = process.env.AHTHROPIC_SCRETE_KEY;

const anthropic = new Anthropic({
  apiKey: anthropicAcessKey,
});

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
app.post(
  "/api/store-audio-file",
  upload.single("audioFile"),
  async (req, res) => {
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
  }
);

// Send a job from S3 to Transcribe and return the job to the original bucket
app.post("/api/transcribe-audio-file", async (req, res) => {
  const { audioFileName } = req.body;
  const audioFileUri = `s3://${process.env.S3_BUCKET_NAME}/${audioFileName}`;

  // Extract the original file name, add "-text" to the original file name for better readability
  // Ex: sampleOrder.m4 -> sampleOrder-text.json
  const nameWithoutExtension = audioFileName.substring(
    0,
    audioFileName.lastIndexOf(".")
  );
  const textFileName = `${nameWithoutExtension}-text.json`;

  const transcribeParams = {
    TranscriptionJobName: `TranscriptionJob-${Date.now()}`,
    LanguageCode: "en-US",
    Media: {
      MediaFileUri: audioFileUri,
    },
    OutputBucketName: process.env.S3_BUCKET_NAME,
    OutputKey: textFileName,
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

// Get AI summary
app.get("/api/get-transcription", async (req, res) => {
  // Get the transcripts from the JSON file in S3
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).send("Missing fileName query parameter.");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const fileContent = await streamToString(data.Body);
    const jsonContent = JSON.parse(fileContent);
    const transcripts = jsonContent.results.transcripts[0].transcript;

    // Send over to AI(Claude) to generate summary
    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      temperature: 0,
      system: "Based on the phone call conversaion, make a summary and a list of actions to do",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: transcripts,
            },
          ],
        },
      ],
    });

    const summary = msg.content[0].text;
    console.log(summary);
    res.status(200).json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving file.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
