export interface UserInfo {
  id: number;
  username: string;
}

export interface Program {
  title: string;
  content: string;
  status: string;
  start_timeStr: string;
  end_timeStr: string;
  user_id?: number;
}