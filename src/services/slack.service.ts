import { WebClient } from '@slack/web-api';
import * as process from 'process';

export class SlackService {
  private client: WebClient;

  constructor() {
    this.client = new WebClient(process.env.SLACK_TOKEN);
  }

  public async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel,
        text: message,
      });
      console.log(`Message sent to ${channel}`);
    } catch (error) {
      console.error('Error sending message to Slack channel:', error);
    }
  }
}
