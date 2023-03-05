export interface Repository {
  id: string;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
}

export interface RepositoriesData {
  items: Repository[];
}
