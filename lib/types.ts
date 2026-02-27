export interface ScanResult {
  safe: boolean;
  threatType?: string;
  platform?: string;
  engineResults?: { engine: string; verdict: string }[];
}

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  urlToImage: string | null;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ThreatEntry {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  description: string;
  warningSigns: string[];
  preventionTips: string[];
}

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  score: PasswordScore;
  label: string;
  tips: string[];
}

export type Severity = 'warning' | 'danger';

export interface HeaderFlag {
  field: string;
  message: string;
  severity: Severity;
}

export interface ParsedEmailHeader {
  from: string;
  replyTo: string;
  returnPath: string;
  messageId: string;
  originatingIp: string;
  receivedChain: string[];
  flags: HeaderFlag[];
}
