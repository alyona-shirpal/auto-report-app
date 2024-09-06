import { WebClient } from '@slack/web-api';
import * as process from 'process';
import logger from '../utils/logger';

export class SlackService {
  private client: WebClient;
  private readonly channel: string;

  constructor() {
    this.client = new WebClient(process.env.SLACK_TOKEN);
    this.channel = process.env.SLACK_CHANNEL_ID;
  }

  public async sendMessage(message: string): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel: this.channel,
        text: message,
      });
    } catch (error) {
      logger.error(`Error sending message to Slack channel: ${error}`);
    }
  }
}
