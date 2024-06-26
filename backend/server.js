const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Load environment variables
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const transcribeService = new AWS.TranscribeService();

app.use(bodyParser.json());

// Test POSTMAN
app.get("/", (req, res) => {
  res.send({ message: "Success" })
})
 
// Send a job from S3 to Transcribe and return the job to the original bucket
// It works but it's messy. We should create a new folder for each customer and
// put all his files in this folder. 
// But that involves query the customer for the next phone to locate the folder
// So we will see if we have time for that

app.post("/start-transcription", (req, res) => {
  // Need to reconsider how to post audio file info
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

  transcribeService.startTranscriptionJob(transcribeParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return res.status(500).send("Error starting transcription job.");
    } else {
      console.log(data);
      res
        .status(200)
        .send(
          `Transcription job started with name: ${data.TranscriptionJob.TranscriptionJobName}`
        );
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
