import { User } from "../types/user.types";

function XpToLevel(user: User): number {
  if (user.level === null || user.xp === null) {
    return 0;
  }

  return user.level * 100;
}
export default XpToLevel;
