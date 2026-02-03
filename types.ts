export type DataType = 'int' | 'bool' | 'string' | 'float' | 'mixed' | 'array' | 'object';

export interface Level {
  id: number;
  title: string;
  incomingValueDisplay: string;
  incomingValueType: DataType;
  targetType: DataType;
  contextCode: string;
  variableName: string;
  
  // What happens if you cast (Hammer)
  hammerCast: string; // e.g., "(int)"
  hammerResultDisplay: string; // e.g., "0"
  hammerFeedback: string;
  hammerDamage: number; // 0-100 Tech Debt increase
  hammerScore: number; // Points for efficiency if safe

  // What happens if you validate (Measure)
  measureAction: string; // e.g., "is_numeric()" or "filter_var()"
  measureFeedback: string;
  measureScore: number;
  
  explanation: string; // From the blog post
}

export type GameState = 'START' | 'PLAYING' | 'FEEDBACK' | 'GAME_OVER' | 'VICTORY' | 'DEADLINE_MISSED';

export interface PlayerState {
  score: number;
  techDebt: number; // 0 to 100. 100 = Crash.
  currentLevelIndex: number;
  hoursRemaining: number;
}