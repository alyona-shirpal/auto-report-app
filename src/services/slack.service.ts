import { WebClient } from '@slack/web-api';
import * as process from 'process';
import logger from '../utils/logger';

export class SlackService {
  private client: WebClient;

  constructor() {
    this.client = new WebClient(process.env.SLACK_TOKEN);
  }

  public async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.client.chat.postMessage({ channel, text: message });
    } catch (error) {
      logger.error(`Error sending message to Slack channel: ${error}`);
    }
  }
}
