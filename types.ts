
export enum Subject {
  TOAN = 'TOAN',
  GDKTPL = 'GDKTPL',
  LICHSU = 'LICHSU',
  TIME = 'TIME'
}

export enum ModuleTab {
  SPEED = 'speed',
  SOCRATIC = 'socratic',
  NOTEBOOKLM = 'notebooklm',
  PERPLEXITY = 'perplexity',
  TOOLS = 'tools'
}

export interface SimilarQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AIResponse {
  speed: {
    answer: string;
    similar: SimilarQuestion;
  };
  socratic: string;
  notebooklm: string;
  perplexity: string;
  tools: string;
  mermaid: string;
}

export interface AppState {
  currentSubject: Subject | null;
  activeTab: ModuleTab;
  isLoading: boolean;
  response: AIResponse | null;
}