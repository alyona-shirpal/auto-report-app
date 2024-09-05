export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
  };
  committer: {
    login: string;
  };
}

export interface CommitResponse extends Commit {
  repo: string;
  branch: string;
}

export interface Repository {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}
