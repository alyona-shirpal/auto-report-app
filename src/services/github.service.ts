import * as dotenv from 'dotenv';
import axios from 'axios';

import * as process from 'process';

import {
  Branch,
  CommitResponse,
  Repository,
} from '../types/interfaces/github.interface';
import moment from 'moment';
import logger from '../utils/logger';

dotenv.config();

export class GitHubService {
  private readonly token: string;
  private readonly apiUrl: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN;

    if (!this.token) {
      logger.error('GitHub token is not set');
      throw new Error(
        'GitHub token is not set. Please set GITHUB_TOKEN in environment variables.'
      );
    }

    this.apiUrl = 'https://api.github.com';
  }

  private async request<T>(endpoint: string, params: object = {}): Promise<T> {
    const response = await axios.get(`${this.apiUrl}${endpoint}`, {
      headers: {
        Authorization: `token ${this.token}`,
        'User-Agent': 'GitHubService',
      },
      params,
    });

    return response.data;
  }

  // get commits of all branches of repos that are specified in the supabase table
  async getCommits(repos: string[]): Promise<CommitResponse[]> {
    try {
      const authenticatedUser = process.env.GITHUB_USER_NAME;

      const reposResponse: Repository[] = await this.request('/user/repos', {
        per_page: 100,
      });

      const selectedRepos = reposResponse.filter(el => repos.includes(el.name));

      const startOfDay = moment()
        .utc()
        .startOf('day')
        .format('YYYY-MM-DD[T]00:00:00[Z]');

      const allCommits: CommitResponse[] = [];

      for (const repo of selectedRepos) {
        const branches: Branch[] = await this.request<Branch[]>(
          `/repos/${repo.owner.login}/${repo.name}/branches`,
          { per_page: 100 }
        );

        for (const branch of branches) {
          // Fetch commits for each branch from the start of the day
          const commits: CommitResponse[] = await this.request(
            `/repos/${repo.owner.login}/${repo.name}/commits`,
            { per_page: 100, since: startOfDay, sha: branch.name }
          );

          if (commits.length) {
            // Filter commits to include only those made by the authenticated user
            const filteredCommits: Partial<CommitResponse>[] = commits
              .filter(commit => commit.commit.author.name === authenticatedUser)
              .map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                date: commit.commit.committer?.date || '',
                repo: repo.name,
                branch: branch.name,
              }));

            logger.info(`Found ${filteredCommits.length} commits.`);

            allCommits.push(...(filteredCommits as CommitResponse[]));
          }
        }
      }

      return allCommits;
    } catch (error) {
      logger.error('Error fetching commits:', error);
      throw new Error(error);
    }
  }
}
