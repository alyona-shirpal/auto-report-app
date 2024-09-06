import { GitHubService } from './services/github.service';
import { CronJob } from 'cron';
import { ChatGptAiService } from './services/openai.service';
import { SlackService } from './services/slack.service';
import * as process from 'process';
import { SupabaseService } from './services/supabase.service';
import logger from './utils/logger';

const gitHubService = new GitHubService();
const supabaseService = new SupabaseService();

async function main() {
  try {
    const repos = await supabaseService.getRepos();

    const commits = await gitHubService.getCommits(repos);

    if (commits.length) {
      const chatGptAiService = new ChatGptAiService(commits);

      const aiResponse = await chatGptAiService.generateOpenAIResponse();

      logger.info('Message to slack:', aiResponse);

      if (aiResponse) {
        const slackService = new SlackService();

        await slackService.sendMessage(aiResponse);
      }

      logger.info('Message sent successfully to Slack channel');
    }
  } catch (error) {
    logger.error(error);
  }
}

// Uncomment to test locally
// (async () => {
//   await main();
// })();

// Schedule the function to run once per day at the time provided by env
const job = new CronJob(`0 ${process.env.EXECUTE_TIME} * * *`, async () => {
  logger.info('Running daily commit check...');
  await main();
});

job.start();
