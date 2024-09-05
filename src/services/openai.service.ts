import * as process from 'process';
import OpenAI from 'openai';
import { Chat } from 'openai/resources';
import { CommitResponse } from '../types/interfaces/github.interface';
import ChatCompletionMessageParam = Chat.ChatCompletionMessageParam;
import logger from '../utils/logger';

export class ChatGptAiService {
  private openai: OpenAI;
  private readonly currentCommits: CommitResponse[];

  constructor(commits: CommitResponse[]) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });

    this.currentCommits = commits;
  }

  private createCommitPrompt(): string {
    return `Create a human readable response for tracking system of my daily work. 
     The response information should include data from the array 
     ${JSON.stringify(this.currentCommits)} - message, branch and repo. 
     Generate response based on the information of commit message. 
     Do not specify the time and date. Avoid any explanation`;
  }

  private async generateCompletion(prompt: string): Promise<string> {
    const request = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt },
      ] as ChatCompletionMessageParam[],
      max_tokens: 1960,
      temperature: 0.8,
    };

    try {
      const response = await this.openai.chat.completions.create(request);

      const content = response.choices[0].message.content;

      if (content) return content;
    } catch (err) {
      logger.error('Error in openai.chat.completions');
      throw new Error(`Error in openai.chat.completions.create: ${err}`);
    }
  }

  public async generateOpenAIResponse(): Promise<string> {
    const prompt = this.createCommitPrompt();

    return await this.generateCompletion(prompt);
  }
}
