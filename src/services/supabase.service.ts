import { createClient } from '@supabase/supabase-js';
import * as process from 'process';

export class SupabaseService {
  private readonly supabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  public async getRepos(): Promise<string[] | null> {
    const { data: repos, error } = await this.supabaseClient
      .from('repos')
      .select('name');

    if (error) {
      throw new Error(
        `Error in fetching repos from supabase: ${error.message}`
      );
    }

    const toReturn = repos.map(el => el.name);

    return toReturn;
  }
}
