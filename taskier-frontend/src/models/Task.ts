export interface Task {
    id: number;
    description: string;
    estimated_time: number;
    used_time: number;
    created_at: string;
    completed_at: string | null;
    user: {
      name: string;
    };
  }
  