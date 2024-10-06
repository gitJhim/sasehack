import { Session } from "@supabase/supabase-js";

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;
};

export type User = {
  id: string | null;
  name: string | null;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  lastSignIn: Date | null;
  school: string | null;
  level: number | null;
  xp: number | null;
};

export type Event = {
  id: string | null;
  userId: string | null;
  dataId: string | null;
  type: LogEventType;
  createdAt: string | null;
};

export enum LogEventType {
  NEW_CYCLE = "NEW_CYCLE",
  NEW_MARKER = "NEW_MARKER",
}
