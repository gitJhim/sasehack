export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
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
