A full-stack application for CRM. 
After a phone conversation, it makes a summary and a list of actions for follow-up.

## Table of Contents
- [About the App](#about-the-app)
    - Features
- [Architecture](#architecture)
    - Services
- [Technical Stacks](#technical-stacks)
    - Backend
    - Frontend
    - Database
    - AWS Cloud Services

# About the App
## Features
    - Record simulated phone conversation on computer
    - Save audio file on AWS S3 bucket
    - Transcribe audio to text using AWS Transcribe
    - Summarize text and generate a list of actions using Claude AI
    - Send the generated summary and list of actions to the user
    - Query summary history of clients
    - Streamlined operations such as add new summary to an existing or a new client with a single button

# Architecture
![image](https://github.com/Xujia118/Voice2Task/assets/116283847/f609745a-b512-4de0-94fd-7bb944a9e7e3)

# Technical Stacks
## Backend - Services
- Node.js
- Express

## Database
- Mysql

## Frontend
- React.js
- JavaScript
- HTML
- CSS
- MUI

## AWS Cloud Services
- S3
- AWS Transcribe
- AWS RDS Mysql

## Further Developments
- Capture internal audio in computer regardless software source
- Expand functions, for example, to give CRM managers a way to visualize team performance
