# Voice2Task

A full-stack application that summarizes actions list for CRM

(spaceholder for other content)

# Dataflow

Frontend: get audio file
## Backend
- post audio file to S3
- get Transcribe to read audio file in S3, convert audio to speech and send text file back to S3 bucket (we can create new bucket for that)
- fetch the text file in S3 and send it to AI for summary
- fetch the summary from AI to 
1. display on frontend
2. send it to database for storage together with the url to the audio file in S3

Frontend: 
Allow to query customer and actions lists