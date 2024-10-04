import { Session } from "@supabase/supabase-js";

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;

  session: Session | null;
  setSession: (session: Session) => void;
};

export type User = {
  id: string | null;
  avatar_url: string | null;
  name: string | null;
  email: string | null;
  username: string | null;
  avatarURL: string | null;
  lastSignIn: Date | null;
  school: string | null;
};
