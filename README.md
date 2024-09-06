# Auto-report

Auto-report is a Node.js service written in TypeScript that fetches commits from specified GitHub repositories, generates a human-readable report using OpenAI, and sends the report to a Slack channel once a day using a cron job.

## Features

- Fetches commits from GitHub repositories.
- Generates human-readable daily reports using OpenAI.
- Automatically posts the reports to a Slack channel.
- Uses Supabase to manage the list of GitHub repositories.

## Requirements

- Node.js
- npm
- Supabase account
- GitHub personal access token
- OpenAI API key
- Slack bot token and channel ID

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alyona_shirpal/auto-report-app.git
   cd auto-report-app 
   
2. Install the dependencies:

   ```bash
   npm install
   
   3.  Set up the following environment variables in a `.env`
       ```bash
           PORT=YOUR_PORT

           GITHUB_USER_NAME=YOUR_GITHUB_USERNAME
           GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
        
           OPEN_AI_KEY=YOUR_OPENAI_API_KEY
        
           SLACK_CHANNEL_ID=YOUR_SLACK_CHANNEL_ID
           SLACK_TOKEN=YOUR_SLACK_BOT_TOKEN
        
           SUPABASE_URL=YOUR_SUPABASE_URL
           SUPABASE_KEY=YOUR_SUPABASE_KEY
        
           EXECUTE_TIME=RUN_TIME_FOR_CRON

   4. Run the application
       ```bash
       npm run dev
