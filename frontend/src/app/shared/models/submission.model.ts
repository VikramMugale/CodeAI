// submission.model.ts
export interface Submission {
    _id: string;
    userId: string;
    filename: string;
    code: string;
    language: string;
    aiFeedback?: any;
  }
  