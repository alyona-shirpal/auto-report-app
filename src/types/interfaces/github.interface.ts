interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

interface Commit {
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

interface CommitResponse extends Commit{
  repo: string
  branch: string,
}
