import * as dotenv from 'dotenv';
import  axios from 'axios';
import * as process from 'process';


dotenv.config();

// Interface for Commit structure
interface Commit {
  sha: string;
  message: string;
  date: string;
}

// Interface for Repository structure
interface Repository {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}

export class GitHubService {
  private token: string;
  private apiUrl: string;

  constructor() {
    // Get the token from environment variables
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      throw new Error('GitHub token is not set. Please set GITHUB_TOKEN in environment variables.');
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




  // get commits of all branches of repos that are specified in the env.
  async getCommits(): Promise<CommitResponse[]> {
    try {
      const authenticatedUser = process.env.GITHUB_USER_NAME;

      // Fetch all repositories for the authenticated user
      const reposResponse: Repository[] = await this.request('/user/repos', {per_page: 100});

      const myRepos = process.env.GITHUB_REPOS.split(',');

      const selectedRepos = reposResponse.filter(el => myRepos.includes(el.name));


      // Get the start of the current day in UTC, in ISO 8601 format
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getUTCDate()).padStart(2, '0');
      const startOfDay = `${year}-${month}-${day}T00:00:00Z`;


      let allCommits: any[] = [];

      for (const repo of selectedRepos) {
        // Fetch all branches in the repository
        const branches: Branch[] = await this.request<Branch[]>(`/repos/${repo.owner.login}/${repo.name}/branches`, { per_page: 100 });


        for (const branch of branches) {
          // Fetch commits for each branch from the start of the day to now
          const commits: Commit[] = await this.request(`/repos/${repo.owner.login}/${repo.name}/commits`, {
            per_page: 100,
            since: startOfDay,
            sha: branch.name,
          });
          if(commits.length) {
            // Filter commits to include only those made by the authenticated user
            const filteredCommits: Commit[] = commits
              .filter((commit: any) => commit.commit.author.name === authenticatedUser)
              .map((commit: any) => ({
                sha: commit.sha,
                message: commit.commit.message,
                date: commit.commit.committer?.date || '',
                repo: repo.name,
                branch: branch.name,
              }));

            // Append commits to allCommits array
            allCommits.push(...filteredCommits)
          }

        }
      }

      console.log(allCommits);
      return allCommits;
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
  }
}
