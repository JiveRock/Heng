export type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';

export interface Problem {
  equation: string;
  solution: string;
  steps: Step[];
  hint: string;
}

export interface Step {
  desc: string;
  val: string;
  explanation?: string;
}

export interface Formula {
  name: string;
  latex: string;
  category: string;
  description?: string;
}
