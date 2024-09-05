import { GitHubService } from './services/github.service';
import { CronJob } from 'cron';
import { ChatGptAiService } from './services/openai.service';
import { SlackService } from './services/slack.service';
import * as process from 'process';

// Initialize GitHubService
const gitHubService = new GitHubService();

// Function to run the getCommits method
async function main() {
  try {
    const commits = await gitHubService.getCommits();

    if (commits.length) {
      const chatGptAiService = new ChatGptAiService(commits);

      const aiResponse = await chatGptAiService.generateOpenAIResponse();

      if (aiResponse) {
        const slackService = new SlackService();
        await slackService.sendMessage(
          process.env.SLACK_CHANNEL_ID,
          aiResponse
        );
      }
    }
  } catch (error) {
    console.error('Failed to fetch commits:', error);
  }
}

(async () => {
  await main();
})();

// Schedule the fetchGitHubCommits function to run once per day at 6 PM using `cron`
// const job = new CronJob('0 18 * * *', async () => {
//   console.log('Running daily commit check...');
//   await fetchGitHubCommits();
// });

// Start the cron job
// job.start();
